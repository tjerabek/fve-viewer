import { filterKeys } from "./filter-keys";
import { parseJSON } from "./parse-json";

export type OverviewData = {
  generationPower?: number;
  usePower?: number;
  buyPower?: number;
  batterySoc?: number;
  generationValue?: number;
  generationTotal?: number;
  buyValue?: number;
  date?: Date;
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
    "wirePower", // buyPower
    "batterySoc",
    "generationValue",
    "generationTotal",
    "buyValue",
    "batteryPower",
  ];

  return fetch(
    "https://home.solarmanpv.com/maintain-s/operating/system/3084557",
    {
      method: "GET",
      headers,
    }
  )
    .then(parseJSON)
    .then((result) => filterKeys(result, filteredKeys))
    .then((result) => {
      result['buyPower'] = result['wirePower'];
      delete result['wirePower'];
      return result;
    })
    .then((result) => ({
      ...result,
    }));
}

export async function fetchChart(year, month, cached) {
  const url = `https://home.solarmanpv.com/maintain-s/history/batteryPower/3084557/stats/month?year=${year}&month=${month}`;

  if (!cached) {
    return fetch(url, {
      method: "GET",
      headers,
    })
      .then(parseJSON)
      .then((result) => result?.records);
  }
  if (cached) {
    return fetch(url, {
      method: "GET",
      headers,
      next: { revalidate: false },
      cache: "force-cache",
    })
      .then(parseJSON)
      .then((result) => result?.records);
  }
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
