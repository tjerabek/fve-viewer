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

export async function fetchDbChart(): Promise<Array<any>> {
  const { data, error } = await supabase
    .from("view_days")
    .select("*")
    .order("date", { ascending: false })
    .limit(31);
  return data || [];
}

export async function fetchDbYear(): Promise<Array<any>> {
  const { data, error } = await supabase
    .from("view_months")
    .select("*")
    .order("month", { ascending: false });
  return data || [];
}
