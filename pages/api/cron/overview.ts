import { supabase } from "../../../lib/db";
import { fetchOverview } from "../../../lib/plant-data";

export default async function handler(req, res) {
  const data = await fetchOverview();
  await supabase.from('overview').insert({ plantid: 3084557, ...data });
  res.status(200).end('cron / overview');
}