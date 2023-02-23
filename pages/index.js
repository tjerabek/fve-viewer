import Head from "next/head";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import OverviewChart from "../components/overview-chart";
import SummaryItem from "../components/summary-item";

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

const Home = ({ data, chart, reverseChart, year, error }) => {
  return (
    <div className="dark:bg-black">
      <Head>
        <title>FVE</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
        <meta name="apple-mobile-web-app-title" content="Notentool" />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

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
              <div className="flex items-center space-x-px">
                <div className="border border-gray-500 w-[21px] h-[12px] rounded p-px">
                  <div
                    className="h-full bg-gray-800 dark:bg-gray-100 rounded-sm"
                    style={{ width: `${data?.batterySoc}%` }}
                  ></div>
                </div>
                <div className="bg-gray-500 w-[2px] h-[6px] rounded-r-sm"></div>
              </div>
            </div>
            <div className="text-gray-500">Baterie</div>
          </div>
          <SummaryItem title="Dnes vyrobeno">
            {data?.generationValue.toLocaleString()} kWh
          </SummaryItem>
          <SummaryItem title="Dnes vyrobeno dojezd">
            {(data?.generationValue / 0.2).toLocaleString()} km
          </SummaryItem>
          <SummaryItem title="Dnes baterie auta">
            {(data?.generationValue / (78 / 100)).toFixed(1).toLocaleString()} %
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

        <div className="h-[200px] dark:hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart width={500} height={200} data={reverseChart}>
              <XAxis dataKey="name" />
              <CartesianGrid vertical={false} />
              <Bar
                dataKey="generationValue"
                fill="#2B2A2B"
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="h-[200px] hidden dark:block">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart width={500} height={200} data={reverseChart}>
              <XAxis dataKey="name" />
              <CartesianGrid vertical={false} stroke="#353d4e" />
              <Bar
                dataKey="generationValue"
                fill="#6b7280"
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 md:p-10 dark:text-white">
          <div className="hidden md:grid md:grid-cols-5">
            <div className="">Měsíc</div>
            <div className="text-right">Výroba</div>
            <div className="text-right">Spotřeba</div>
            <div className="text-right">Nákup</div>
            <div></div>
          </div>
          {year.map((item, key) => (
            <div
              key={key}
              className="grid md:grid-cols-5 py-4 md:py-0 border-b dark:border-gray-800"
            >
              <div className="font-semibold">
                {new Intl.DateTimeFormat("cs-CZ", { month: "long" }).format(
                  new Date(item.year, item.month, item.day)
                )}
              </div>
              <div className="grid grid-cols-2 md:block">
                <div className="md:hidden">Výroba</div>
                <div className="text-right">
                  {item.generationValue.toFixed(1)} kWh
                </div>
              </div>
              <div className="grid grid-cols-2 md:block">
                <div className="md:hidden">Spotřeba</div>
                <div className="text-right">{item.useValue.toFixed(1)} kWh</div>
              </div>
              <div className="grid grid-cols-2 md:block">
                <div className="md:hidden">Nákup</div>
                <div className="text-right">{item.buyValue.toFixed(1)} kWh</div>
              </div>
              <div className="grid grid-cols-2 md:block">
                <div className="md:hidden">Procenta</div>
                <div className="text-right">
                  {(item.generationValue / (item.useValue / 100)).toFixed(1)} %
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 md:p-10 dark:text-white">
          <div className="hidden md:grid md:grid-cols-5">
            <div className="">Datum</div>
            <div className="text-right">Výroba</div>
            <div className="text-right">Spotřeba</div>
            <div className="text-right">Nákup</div>
            <div></div>
          </div>
          {chart.map((item, key) => (
            <div
              key={key}
              className="grid md:grid-cols-5 py-4 md:py-0 border-b dark:border-gray-800"
            >
              <div className="font-semibold">
                {item.day}.{item.month}.{item.year}
              </div>
              <div className="grid grid-cols-2 md:block">
                <div className="md:hidden">Výroba</div>
                <div className="text-right">
                  {item.generationValue.toFixed(1)} kWh
                </div>
              </div>
              <div className="grid grid-cols-2 md:block">
                <div className="md:hidden">Spotřeba</div>
                <div className="text-right">{item.useValue.toFixed(1)} kWh</div>
              </div>
              <div className="grid grid-cols-2 md:block">
                <div className="md:hidden">Nákup</div>
                <div className="text-right">{item.buyValue.toFixed(1)} kWh</div>
              </div>
              <div className="grid grid-cols-2 md:block">
                <div className="md:hidden">Procenta</div>
                <div className="text-right">
                  {(item.generationValue / (item.useValue / 100)).toFixed(1)} %
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer>{error}</footer>
    </div>
  );
};

Home.getInitialProps = async () => {
  try {
    const [data, chart1, chart2, year] = await Promise.all([
      fetchOverview(),
      fetchChart(2023, 1),
      fetchChart(2023, 2),
      fetchYear(2023),
    ]);

    const chart = chart1.concat(chart2).reverse().slice(0, 31);
    const reverseChart = chart.slice().reverse();

    return { data, chart, reverseChart, year };
  } catch (error) {
    return { error };
  }
};
export default Home;
