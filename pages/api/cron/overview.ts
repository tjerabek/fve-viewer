import { supabase } from "../../../lib/db";
import { fetchOverview } from "../../../lib/plant-data";

export default async function handler(req, res) {
  try {
    const data = await fetchOverview();
    if (data) {
      await supabase.from("overview").insert({ plantid: 3084557, ...data });
    } else {
      console.error("No data");
    }
    res.status(200).end("cron / overview");
  } catch (err) {
    console.error("Cron error", err);
    res.status(500).end("error");
  }
}
