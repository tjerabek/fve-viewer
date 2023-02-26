import { parseJSON } from "./parse-json";

export async function fetchForecast(): Promise<Array<number>> {
  const url =
    "https://api.forecast.solar/estimate/50.063212/15.675951/40/0/6.25";
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 1 * 60 * 60 },
  })
    .then(parseJSON)
    .then((result) => Object.values(result?.result?.watt_hours_day || []));
}
