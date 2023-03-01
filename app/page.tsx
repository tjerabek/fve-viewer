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
import { fetchDbChart, fetchDbOverview } from "../lib/plant-db-data";

const START_DATE = new Date(2023, 0, 9);
const TODAY = new Date();

const CURRENT_MONTH = new Date();
CURRENT_MONTH.setDate(1);

const LAST_MONTH = new Date();
LAST_MONTH.setDate(1);
LAST_MONTH.setMonth(CURRENT_MONTH.getMonth() - 1);

const CAR_CONSUMPTION = 0.2;
const CAR_BATTERY_SIZE = 78;
const BUY_PRICE = 6;

const formatNumber = (number?: number, digits?: number) => {
  if (!number) {
    return number;
  }
  return number.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const [data, chart, forecast] = await Promise.all([
    fetchDbOverview(),
    fetchDbChart(),
    // fetchYear(CURRENT_MONTH.getFullYear()),
    fetchForecast(),
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
          <div className="p-6 md:p-10 gap-8 grid grid-cols-1 md:grid-cols-5">
            <SummaryItem title="Spotřeba">
              {formatNumber(data?.usePower)} W
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
                {formatNumber(data?.generationValue, 1)} kWh
              </SummaryItem>
              <div>
                <div className="grid grid-cols-2 text-gray-500">
                  <div>Auto dojezd</div>
                  <div className="text-right">
                    {formatNumber(
                      (data?.generationValue || 0) / CAR_CONSUMPTION
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
                {formatNumber(data?.buyValue, 1)} kWh
              </SummaryItem>
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
            {chart?.map((item, key) => (
              <div
                key={key}
                className="grid md:grid-cols-3 py-4 md:py-0 border-b dark:border-gray-800"
              >
                <div className="font-semibold">
                  {new Intl.DateTimeFormat("cs-CZ", {}).format(
                    new Date(item.date)
                  )}
                </div>
                <TableItem title="Výroba">
                  {formatNumber(item.generationValue, 1)} kWh
                </TableItem>
                <TableItem title="Nákup">
                  {formatNumber(item.buyValue, 1)} kWh
                </TableItem>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
