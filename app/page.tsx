import BuyChart from "../components/buy-chart";
import GenerationChart from "../components/generation-chart";
import IconBattery from "../components/icon-battery";
import OverviewChart from "../components/overview-chart";
import SummaryItem from "../components/summary-item";
import TableHeader from "../components/table-header";
import TableItem from "../components/table-item";
import Title from "../components/title";
import { datediff } from "../lib/datediff";
import { fetchForecast } from "../lib/forecast";
import { fetchChart, fetchOverview, fetchYear } from "../lib/plant-data";

const START_DATE = new Date(2023, 0, 9);
const TODAY = new Date();

const CURRENT_MONTH = new Date();
CURRENT_MONTH.setDate(1);

const LAST_MONTH = new Date();
LAST_MONTH.setDate(1);
LAST_MONTH.setMonth(CURRENT_MONTH.getMonth() - 1);

const CAR_CONSUMPTION = 0.2;
const CAR_BATTERY_SIZE = 78;

export default async function Page() {
  const [data, chart1, chart2, year, forecast] = await Promise.all([
    fetchOverview(),
    fetchChart(LAST_MONTH.getFullYear(), LAST_MONTH.getMonth() + 1, true),
    fetchChart(CURRENT_MONTH.getFullYear(), CURRENT_MONTH.getMonth() + 1, false),
    fetchYear(CURRENT_MONTH.getFullYear()),
    fetchForecast(),
  ]);

  const chart = chart1.concat(chart2).reverse().slice(0, 31);
  const reverseChart = chart.slice().reverse();

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
              {data?.usePower?.toLocaleString()} W
            </SummaryItem>
            <SummaryItem title="Výroba">
              {data?.generationPower?.toLocaleString()} W
            </SummaryItem>
            <SummaryItem title="Síť">
              {Math.abs((data?.buyPower || 0) * -1).toLocaleString()} W
            </SummaryItem>
            <div>
              <div className="flex space-x-2">
                <div className="text-xl dark:text-white">
                  {data?.batterySoc?.toLocaleString()} %
                </div>
                <IconBattery value={data?.batterySoc} />
              </div>
              <div className="text-gray-500">Baterie</div>
            </div>
            <div className="space-y-2">
              <SummaryItem title="Dnes vyrobeno">
                {data?.generationValue?.toLocaleString()} kWh
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
              {(
                (data?.generationValue || 0) / CAR_CONSUMPTION
              ).toLocaleString()}{" "}
              km
            </SummaryItem>
            <SummaryItem title="Dnes baterie auta">
              {((data?.generationValue || 0) / (CAR_BATTERY_SIZE / 100))
                .toFixed(1)
                .toLocaleString()}{" "}
              %
            </SummaryItem>
            <div>
              <div className="text-xl dark:text-white">
                {((data?.generationTotal || 0) / CAR_CONSUMPTION)
                  .toFixed(0)
                  .toLocaleString()}{" "}
                km
              </div>
              <div className="text-gray-500">Celkem vyrobeno dojezd</div>
              <div className="text-gray-500">
                {(
                  (data?.generationTotal || 0) /
                  CAR_CONSUMPTION /
                  datediff(START_DATE, TODAY)
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
      </div>
    </>
  );
}
