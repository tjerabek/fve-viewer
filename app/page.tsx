import BuyChart from "../components/buy-chart";
import GenerationChart from "../components/generation-chart";
import IconBattery from "../components/icon-battery";
import OverviewChart from "../components/overview-chart";
import SummaryItem from "../components/summary-item";
import TableHeader from "../components/table-header";
import TableItem from "../components/table-item";
import Title from "../components/title";
import TrendUp from "../components/trend-up";
import { datediff } from "../lib/datediff";
import { fetchForecast } from "../lib/forecast";
import { formatNumber } from "../lib/formatNumber";
import {
  fetchDbChart,
  fetchDbOverview,
  fetchDbYear,
  fetchDbYesterday,
} from "../lib/plant-db-data";

const START_DATE = new Date(2023, 0, 9);
const TODAY = new Date();

const CURRENT_MONTH = new Date();
CURRENT_MONTH.setDate(1);

const LAST_MONTH = new Date();
LAST_MONTH.setDate(1);
LAST_MONTH.setMonth(CURRENT_MONTH.getMonth() - 1);

const CAR_CONSUMPTION = 0.2;
const CAR_BATTERY_SIZE = 78;
const PRICE = 6;

export const dynamic = "force-dynamic";

export default async function Page() {
  const [data, chart, year, forecast, yesterday] = await Promise.all([
    fetchDbOverview(),
    fetchDbChart(),
    fetchDbYear(),
    fetchForecast(),
    fetchDbYesterday(),
  ]);
  const reverseChart = chart.slice().reverse();

  return (
    <>
      <div className="dark:bg-black">
        <main>
          <OverviewChart
            generationPower={data?.generationPower}
            buyPower={data?.buyPower}
            usePower={data?.usePower}
          />
          <div className="p-6 md:p-10 gap-8 grid grid-cols-1 md:grid-cols-4">
            <SummaryItem title="Výroba">
              {formatNumber(data?.generationPower)} W
            </SummaryItem>
            <SummaryItem title="Spotřeba">
              {formatNumber(data?.usePower)} W
            </SummaryItem>
            <SummaryItem title="Síť">
              {formatNumber(Math.abs(data?.buyPower || 0))} W
            </SummaryItem>
            <div>
              <div className="flex space-x-2">
                <div className="text-xl dark:text-white">
                  {formatNumber(data?.batterySoc)} %
                </div>
                <IconBattery value={data?.batterySoc} />
              </div>
              <div className="text-gray-500">Baterie</div>
            </div>
            <div className="space-y-2">
              <SummaryItem title="Dnes vyrobeno">
                <div className="flex justify-between">
                  <div>{formatNumber(data?.generationValue, 1)} kWh</div>
                </div>
              </SummaryItem>
              <div>
                <div className="grid grid-cols-2 text-gray-500">
                  <div>Auto dojezd</div>
                  <div className="text-right">
                    {formatNumber(
                      (data?.generationValue || 0) / CAR_CONSUMPTION,
                      1
                    )}{" "}
                    km
                  </div>
                </div>
                <div className="grid grid-cols-2 text-gray-500">
                  <div>Auto baterie</div>
                  <div className="text-right">
                    {formatNumber(
                      (data?.generationValue || 0) / (CAR_BATTERY_SIZE / 100),
                      1
                    )}
                    %
                  </div>
                </div>
                <div className="grid grid-cols-2 text-gray-500">
                  <div>Před 24h</div>
                  <div className="text-right flex justify-end space-x-2">
                    <TrendUp
                      value={
                        (data?.generationValue || 0) -
                        yesterday?.generationValue
                      }
                    />
                    <div>{formatNumber(yesterday?.generationValue, 1)} kWh</div>
                  </div>
                </div>
                {forecast && forecast.length === 2 && (
                  <>
                    <div className="grid grid-cols-2 text-gray-500">
                      <div>Předpověď dnes</div>
                      <div className="text-right">
                        {formatNumber(forecast[0] / 1000, 1)} kWh
                      </div>
                    </div>
                    <div className="grid grid-cols-2 text-gray-500">
                      <div>Předpověď zítra</div>
                      <div className="text-right">
                        {formatNumber(forecast[1] / 1000, 1)} kWh
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <SummaryItem title="Dnes nakoupeno">
                <div className="flex justify-between">
                  <div>{formatNumber(data?.buyValue, 1)} kWh</div>
                </div>
              </SummaryItem>
              <div>
                <div className="grid grid-cols-2 text-gray-500">
                  <div>Před 24h</div>
                  <div className="text-right flex justify-end space-x-2">
                    <TrendUp
                      value={
                        (data?.generationValue || 0) -
                        yesterday?.generationValue
                      }
                    />
                    <div>{formatNumber(yesterday?.buyValue, 1)} kWh</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 text-gray-500">
                  <div>Cena</div>
                  <div className="text-right">
                    {formatNumber((data?.buyValue || 0) * PRICE, 0)} Kč
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <SummaryItem title="Celkem vyrobeno">
                {formatNumber(
                  (data?.generationTotal || 0) / CAR_CONSUMPTION,
                  0
                )}{" "}
                km
              </SummaryItem>
              <div>
                <div className="grid grid-cols-2 text-gray-500">
                  <div>Průměrně</div>
                  <div className="text-right">
                    {formatNumber(
                      (data?.generationTotal || 0) /
                        CAR_CONSUMPTION /
                        datediff(START_DATE, TODAY),
                      0
                    )}{" "}
                    km/den
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Title>Výroba</Title>
          <GenerationChart reverseChart={reverseChart} />
          <Title>Nákup</Title>
          <BuyChart reverseChart={reverseChart} />

          <div className="p-6 md:p-10 dark:text-white">
            <TableHeader title="Datum" />
            {year?.map((item, key) => (
              <div
                key={key}
                className="grid md:grid-cols-4 py-4 md:py-0 border-b dark:border-gray-800 items-center"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">
                    {new Intl.DateTimeFormat("cs-CZ", {
                      timeZone: "Europe/Prague",
                      month: "long",
                    }).format(new Date(item.month))}
                  </div>
                  <div className="h-1 w-1/4 bg-gray-100 dark:bg-gray-800 rounded-full md:hidden">
                    <div
                      className="h-full bg-gray-500 dark:bg-gray-500 rounded-full"
                      style={{
                        width: `${
                          item.generationValue /
                          ((item.generationValue + item.buyValue) / 100)
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <TableItem title="Výroba">
                  {formatNumber(item.generationValue, 1)} kWh
                </TableItem>
                <TableItem title="Nákup">
                  {formatNumber(item.buyValue, 1)} kWh
                </TableItem>
                <div className="md:flex justify-end hidden">
                  <div className="h-1 w-1/4 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <div
                      className="h-full bg-gray-500 dark:bg-gray-500 rounded-full"
                      style={{
                        width: `${
                          item.generationValue /
                          ((item.generationValue + item.buyValue) / 100)
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 md:p-10 dark:text-white">
            <TableHeader title="Datum" />
            {chart?.map((item, key) => (
              <div
                key={key}
                className="grid md:grid-cols-4 py-4 md:py-0 border-b dark:border-gray-800 items-center"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">
                    {new Intl.DateTimeFormat("cs-CZ", {}).format(
                      new Date(item.date)
                    )}
                  </div>
                  <div className="h-1 w-1/4 bg-gray-100 dark:bg-gray-800 rounded-full md:hidden">
                    <div
                      className="h-full bg-gray-500 dark:bg-gray-500 rounded-full"
                      style={{
                        width: `${
                          item.generationValue /
                          ((item.generationValue + item.buyValue) / 100)
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <TableItem title="Výroba">
                  {formatNumber(item.generationValue, 1)} kWh
                </TableItem>
                <TableItem title="Nákup">
                  {formatNumber(item.buyValue, 1)} kWh
                </TableItem>
                <div className="md:flex justify-end hidden">
                  <div className="h-1 w-1/4 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <div
                      className="h-full bg-gray-500 dark:bg-gray-500 rounded-full"
                      style={{
                        width: `${
                          item.generationValue /
                          ((item.generationValue + item.buyValue) / 100)
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
