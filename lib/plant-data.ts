import { filterKeys } from "./filter-keys";
import { parseJSON } from "./parse-json";

export type OverviewData = {
  generationPower?: number;
  usePower?: number;
  buyPower?: number;
  batterySoc?: number;
  generationValue?: number;
  generationTotal?: number;
};

const AUTH = `Bearer ${process.env.AUTH_TOKEN}`;

const headers = {
  "Content-Type": "application/json",
  Authorization: AUTH,
};

export async function fetchOverview(): Promise<OverviewData> {
  const filteredKeys = [
    "generationPower",
    "usePower",
    "buyPower",
    "batterySoc",
    "generationValue",
    "generationTotal",
  ];

  return fetch(
    "https://home.solarmanpv.com/maintain-s/operating/station/information/3084557?language=cs",
    {
      method: "GET",
      headers,
    }
  )
    .then(parseJSON)
    .then((result) => filterKeys(result, filteredKeys))
    .then((result) => ({
      ...result,
    }));
}

export async function fetchChart(year, month) {
  return fetch(
    `https://home.solarmanpv.com/maintain-s/history/batteryPower/3084557/stats/month?year=${year}&month=${month}`,
    {
      method: "GET",
      headers,
    }
  )
    .then(parseJSON)
    .then((result) => result?.records);
}

export async function fetchYear(year) {
  return fetch(
    `https://home.solarmanpv.com/maintain-s/history/batteryPower/3084557/stats/year?year=${year}`,
    {
      method: "GET",
      headers,
    }
  )
    .then(parseJSON)
    .then((result) => result?.records);
}
