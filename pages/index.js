import Head from "next/head";
import BuyChart from "../components/buy-chart";
import GenerationChart from "../components/generation-chart";
import IconBattery from "../components/icon-battery";
import OverviewChart from "../components/overview-chart";
import SummaryItem from "../components/summary-item";
import TableHeader from "../components/table-header";
import TableItem from "../components/table-item";
import Title from "../components/title";

const AUTH =
  "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIwX3QuamVyYWJla0BnbWFpbC5jb21fMiIsInNjb3BlIjpbImFsbCJdLCJkZXRhaWwiOnsib3JnYW5pemF0aW9uSWQiOjAsInRvcEdyb3VwSWQiOm51bGwsImdyb3VwSWQiOm51bGwsInJvbGVJZCI6LTEsInVzZXJJZCI6Nzc1Mjg5LCJ2ZXJzaW9uIjoxLCJpZGVudGlmaWVyIjoidC5qZXJhYmVrQGdtYWlsLmNvbSIsImlkZW50aXR5VHlwZSI6MiwiYXBwSWQiOm51bGx9LCJleHAiOjE2Nzg0ODAwNTgsImF1dGhvcml0aWVzIjpbImFsbCJdLCJqdGkiOiI3M2JlMWQ2Yy0wNDVlLTQ2MTktOWEwNC0zOGE0YWRhNTQ0OTYiLCJjbGllbnRfaWQiOiJ0ZXN0In0.dxkLByPOUW1h_cX2xDUPXJyKoe_PIv0tEUWMRaSyWCiWSFLQdCHVIqmm8wiMf6gBgBajCzFaUSag42Y2cNBIQWNNHY3LABFLlP_vWEDvVgrR7Ci-WLVnJt6TWdpDujzhhSZtdeOLhoXdJcMEoDYH2r9k1n5mOwOqeAmCRp0yMC7A1Af8xQXWSkgm7ano-GSKJaRg5ZlDTbz2Bq0XTqlZoqo01y58BAdgvSD6wjLm2AnD82emaTosd6z--CK3U6Dp-lseIe7TG_Z_Y64lX3xW8AgQl5AjWVNeqwUqa22PImipLpuNr9u6SFbLmsz5Bk_Mj1QodIWnmrkhHO4B9xBOhA";

const headers = {
  "Content-Type": "application/json",
  Authorization: AUTH,
};

const parseJSON = (resp) => (resp.json ? resp.json() : resp);

function datediff(first, second) {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

function filterKeys(result, filteredKeys) {
  const items = {};
  Object.keys(result)
    .filter((key) => filteredKeys.includes(key))
    .map((k) => (items[k] = result[k]));
  return items;
}

async function fetchOverview() {
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

async function fetchChart(year, month) {
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

async function fetchYear(year) {
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

async function fetchForecast() {
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

const Home = ({ data, chart, reverseChart, year, forecast, error }) => {
  return (
    <>
      <div className="dark:bg-black">
        <main>
          <OverviewChart
            generationPower={data?.generationPower}
            buyPower={data?.buyPower}
          />
          <div className="p-6 md:p-10 gap-8 grid grid-cols-1 md:grid-cols-4">
            <SummaryItem title="Spotřeba">
              {data?.usePower.toLocaleString()} W
            </SummaryItem>
            <SummaryItem title="Výroba">
              {data?.generationPower.toLocaleString()} W
            </SummaryItem>
            <SummaryItem title="Síť">
              {Math.abs(data?.buyPower * -1).toLocaleString()} W
            </SummaryItem>
            <div>
              <div className="flex space-x-2">
                <div className="text-xl dark:text-white">
                  {data?.batterySoc.toLocaleString()} %
                </div>
                <IconBattery value={data?.batterySoc} />
              </div>
              <div className="text-gray-500">Baterie</div>
            </div>
            <div className="space-y-2">
              <SummaryItem title="Dnes vyrobeno">
                {data?.generationValue.toLocaleString()} kWh
              </SummaryItem>
              {forecast && forecast.length === 2 && (
                <div>
                  <div className="text-gray-500">
                    Předpověď dnes: {(forecast[0] / 1000).toFixed(1)} kWh
                  </div>
                  <div className="text-gray-500">
                    Předpověď zítra: {(forecast[1] / 1000).toFixed(1)} kWh
                  </div>
                </div>
              )}
            </div>
            <SummaryItem title="Dnes vyrobeno dojezd">
              {(data?.generationValue / 0.2).toLocaleString()} km
            </SummaryItem>
            <SummaryItem title="Dnes baterie auta">
              {(data?.generationValue / (78 / 100)).toFixed(1).toLocaleString()}{" "}
              %
            </SummaryItem>
            <div>
              <div className="text-xl dark:text-white">
                {(data?.generationTotal / 0.2).toFixed(0).toLocaleString()} km
              </div>
              <div className="text-gray-500">Celkem vyrobeno dojezd</div>
              <div className="text-gray-500">
                {(
                  data?.generationTotal /
                  0.2 /
                  datediff(new Date(2023, 0, 9), new Date())
                ).toFixed(1)}{" "}
                km/den
              </div>
            </div>
          </div>
          <Title>Výroba</Title>
          <GenerationChart reverseChart={reverseChart} />
          <Title>Nákup</Title>
          <BuyChart reverseChart={reverseChart} />

          <div className="p-6 md:p-10 dark:text-white">
            <TableHeader title="Měsíc" />
            {year?.map((item, key) => (
              <div
                key={key}
                className="grid md:grid-cols-4 py-4 md:py-0 border-b dark:border-gray-800"
              >
                <div className="font-semibold">
                  {new Intl.DateTimeFormat("cs-CZ", { month: "long" }).format(
                    new Date(item.year, item.month, item.day)
                  )}
                </div>
                <TableItem title="Výroba">
                  {item.generationValue.toFixed(1)} kWh
                </TableItem>
                <TableItem title="Nákup">
                  {item.buyValue.toFixed(1)} kWh
                </TableItem>
                <TableItem title="Procenta">
                  {(item.generationValue / (item.useValue / 100)).toFixed(1)} %
                </TableItem>
              </div>
            ))}
          </div>

          <div className="p-6 md:p-10 dark:text-white">
            <TableHeader title="Datum" />
            {chart?.map((item, key) => (
              <div
                key={key}
                className="grid md:grid-cols-4 py-4 md:py-0 border-b dark:border-gray-800"
              >
                <div className="font-semibold">
                  {item.day}.{item.month}.{item.year}
                </div>
                <TableItem title="Výroba">
                  {item.generationValue.toFixed(1)} kWh
                </TableItem>
                <TableItem title="Nákup">
                  {item.buyValue.toFixed(1)} kWh
                </TableItem>
                <TableItem title="Procenta">
                  {(item.generationValue / (item.useValue / 100)).toFixed(1)} %
                </TableItem>
              </div>
            ))}
          </div>
        </main>

        <footer>{error}</footer>
      </div>
    </>
  );
};

Home.getInitialProps = async () => {
  try {
    const [data, chart1, chart2, year, forecast] = await Promise.all([
      fetchOverview(),
      fetchChart(2023, 1),
      fetchChart(2023, 2),
      fetchYear(2023),
      fetchForecast(),
    ]);

    const chart = chart1.concat(chart2).reverse().slice(0, 31);
    const reverseChart = chart.slice().reverse();

    return { data, chart, reverseChart, year, forecast };
  } catch (error) {
    console.log({ error });
    return { error };
  }
};
export default Home;
