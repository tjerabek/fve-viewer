import { supabase } from "../../../lib/db";
import { fetchChart } from "../../../lib/plant-data";

/**
 * Backfill missing or incomplete days using Solarman monthly stats.
 *
 * A day is considered a gap when view_days has no record for it, OR when
 * its generationValue is 0/null (cron ran briefly but missed peak production).
 *
 * Usage:
 *   GET /api/cron/backfill?startDate=2024-01-01&endDate=2024-03-31
 *   GET /api/cron/backfill               (defaults: last 90 days)
 *   GET /api/cron/backfill?dry=true      (report gaps without inserting)
 *
 * Inserts ONE record per gap day with daily totals from Solarman
 * (generationValue, buyValue). Live power readings are left null.
 * Safe to run repeatedly — today is never touched.
 */
export default async function handler(req, res) {
  const dry = req.query.dry === "true";
  const debug = req.query.debug === "true";

  const endDate = req.query.endDate
    ? new Date(req.query.endDate as string)
    : new Date();
  const startDate = req.query.startDate
    ? new Date(req.query.startDate as string)
    : (() => {
        const d = new Date(endDate);
        d.setDate(d.getDate() - 90);
        return d;
      })();

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ error: "Invalid date range" });
  }

  // 1. Query view_days — a day is covered only if it has a positive generationValue.
  //    Days where the cron ran briefly but captured 0 kWh are treated as gaps.
  const startStr = startDate.toISOString().split("T")[0];
  const endStr = endDate.toISOString().split("T")[0];

  const { data: existing, error: existingError } = await supabase
    .from("view_days")
    .select("date, generationValue")
    .gte("date", startStr)
    .lte("date", endStr);

  if (existingError) {
    return res.status(500).json({ error: existingError.message });
  }

  const coveredDays = new Set(
    (existing || [])
      .filter((r) => (r.generationValue ?? 0) > 0)
      .map((r) => (r.date ?? "").split("T")[0])
  );

  // 2. Find all calendar days in [startDate, endDate] that need backfill.
  const missingDays: string[] = [];
  const cursor = new Date(startDate);
  // Never touch today — the cron is actively writing it.
  const todayStr = new Date().toISOString().split("T")[0];
  while (cursor < endDate) {
    const dayStr = cursor.toISOString().split("T")[0];
    if (dayStr !== todayStr && !coveredDays.has(dayStr)) {
      missingDays.push(dayStr);
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  if (missingDays.length === 0) {
    return res.status(200).json({ message: "No gaps found", inserted: 0 });
  }

  if (dry) {
    return res.status(200).json({ gaps: missingDays });
  }

  // 3. Group missing days by year-month so we make one Solarman call per month.
  const byMonth = new Map<string, string[]>();
  for (const day of missingDays) {
    const key = day.slice(0, 7); // "2024-01"
    if (!byMonth.has(key)) byMonth.set(key, []);
    byMonth.get(key)!.push(day);
  }

  const inserted: string[] = [];
  const failed: string[] = [];

  for (const [monthKey, days] of Array.from(byMonth.entries())) {
    const [year, month] = monthKey.split("-").map(Number);
    let records: any[];
    try {
      records = await fetchChart(year, month, false);
    } catch {
      failed.push(...days);
      continue;
    }

    if (!Array.isArray(records)) {
      failed.push(...days);
      continue;
    }

    if (debug) {
      return res.status(200).json({ sample: records.slice(0, 3) });
    }

    // Build a lookup: "2024-01-15" → record
    const byDay = new Map<string, any>();
    for (const r of records) {
      // Solarman returns dates in various formats; normalise to YYYY-MM-DD.
      const key = normaliseDate(r.date ?? r.day ?? r.time ?? r.collectTime ?? r.statisticsTime);
      if (key) byDay.set(key, r);
    }

    for (const dayStr of days) {
      const solarmanRecord = byDay.get(dayStr);
      if (!solarmanRecord) {
        // Solarman has no data for this day either — truly missing.
        failed.push(dayStr);
        continue;
      }

      const { error } = await supabase.from("overview").insert({
        plantid: 3084557,
        date: dayStr,
        generationValue: solarmanRecord.generationValue ?? solarmanRecord.generation_value ?? null,
        buyValue: solarmanRecord.buyValue ?? solarmanRecord.buy_value ?? solarmanRecord.purchaseValue ?? null,
        // Leave live-power fields null — this is a backfill record.
      });

      if (error) {
        failed.push(dayStr);
      } else {
        inserted.push(dayStr);
      }
    }
  }

  return res.status(200).json({ inserted, failed, total: missingDays.length });
}

function normaliseDate(raw: string | undefined | null): string | null {
  if (!raw) return null;
  // Accept "2024-01-15", "2024-01-15T..." or epoch millis as string
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const n = Number(raw);
  if (!isNaN(n) && n > 1_000_000_000) {
    return new Date(n).toISOString().split("T")[0];
  }
  return null;
}
