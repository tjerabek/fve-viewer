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
  const failed: { day: string; reason: string }[] = [];

  for (const [monthKey, days] of Array.from(byMonth.entries())) {
    const [year, month] = monthKey.split("-").map(Number);
    let records: any[];
    try {
      records = await fetchChart(year, month, false);
    } catch (e: any) {
      days.forEach((d) => failed.push({ day: d, reason: `fetch error: ${e?.message}` }));
      continue;
    }

    if (!Array.isArray(records)) {
      days.forEach((d) => failed.push({ day: d, reason: `unexpected records type: ${JSON.stringify(records)}` }));
      continue;
    }

    if (debug) {
      return res.status(200).json({ sample: records.slice(0, 3) });
    }

    // Build a lookup: "2026-08-22" → record.
    // Solarman monthly records use separate year/month/day integer fields.
    const byDay = new Map<string, any>();
    for (const r of records) {
      const key =
        r.year && r.month && r.day
          ? `${r.year}-${String(r.month).padStart(2, "0")}-${String(r.day).padStart(2, "0")}`
          : normaliseDate(r.date ?? r.acceptDay ?? r.time);
      if (key) byDay.set(key, r);
    }

    for (const dayStr of days) {
      const solarmanRecord = byDay.get(dayStr);
      if (!solarmanRecord) {
        failed.push({ day: dayStr, reason: `not in Solarman response (keys: ${Array.from(byDay.keys()).join(", ")})` });
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
        failed.push({ day: dayStr, reason: `db insert: ${error.message}` });
      } else {
        inserted.push(dayStr);
      }
    }
  }

  return res.status(200).json({ inserted, failed, total: missingDays.length });
}

function normaliseDate(raw: string | number | undefined | null): string | null {
  if (raw == null) return null;
  const s = String(raw);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  // "20260801" → "2026-08-01"
  if (/^\d{8}$/.test(s)) return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  const n = Number(s);
  if (!isNaN(n) && n > 1_000_000_000) return new Date(n).toISOString().split("T")[0];
  return null;
}
