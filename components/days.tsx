"use client";

import { useState } from "react";
import { formatNumber } from "../lib/formatNumber";
import TableHeader from "./table-header";
import TableItem from "./table-item";

export default function Days({ chart }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <button
        onClick={() => setOpen(!isOpen)}
        className="rounded-[5px] text-gray-800 px-8 leading-[20px] border border-gray-200 inline-block h-10 w-full md:w-auto hover:border-gray-800 transition dark:text-white"
      >
        {!isOpen ? `Zobrazit dny` : `Skrýt dny`}
      </button>
      {isOpen && (
        <div>
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
      )}
    </div>
  );
}
