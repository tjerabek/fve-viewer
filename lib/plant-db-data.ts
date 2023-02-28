import { supabase } from "./db";
import { OverviewData } from "./plant-data";

export async function fetchDbOverview(): Promise<OverviewData> {
  const { data } = await supabase
    .from("overview")
    .select("*")
    .eq("date", new Date().toISOString())
    .order("id", { ascending: false })
    .limit(1)
    .single();
  return data as OverviewData;
}
