"use client";

import { formatNumber } from "../lib/formatNumber";
import IconHouse from "./icon-house";
import IconPowerplant from "./icon-powerplant";
import IconSun from "./icon-sun";

export default function OverviewChart({ generationPower, buyPower, usePower }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] grid-rows-2 p-6 md:p-10 max-w-[375px]">
      <div>
        <div className="flex items-center space-x-4">
          <div>
            <IconSun className={generationPower > 0 ? "" : "opacity-20"} />
          </div>
          <div
            className={[
              generationPower > 0 ? "" : "opacity-20",
              "flex-1 text-center",
            ].join(" ")}
          >
            <div className="text-sm border-[1.5px] border-black rounded-full px-2 dark:text-white dark:border-white">
              {formatNumber(generationPower, 0)} W
            </div>
          </div>
        </div>
      </div>
      <div className="row-span-2 py-3 mr-2">
        <div className="flex">
          <div
            className={[
              "w-1/2 bg-black h-[1.5px] dark:bg-white",
              generationPower > 0 ? "" : "opacity-20",
            ].join(" ")}
          ></div>
          <div className="w-1/2 bg-black h-[1.5px] dark:bg-white"></div>
        </div>
        <div className={buyPower < 0 ? "" : "opacity-20"}>
          <div className="w-1/2 h-14 border-b-[1.5px] border-r-[1.5px] border-black rounded-br-xl dark:border-white"></div>
        </div>
      </div>
      <div className="">
        <IconHouse className={""} />
      </div>
      <div className="flex items-end">
        <div className="flex items-center space-x-4 flex-1">
          <div>
            <IconPowerplant className={buyPower < 0 ? "" : "opacity-20"} />
          </div>
          <div
            className={[
              buyPower < 0 ? "" : "opacity-20",
              "flex-1 text-center",
            ].join(" ")}
          >
            <div className="text-sm border-[1.5px] border-black rounded-full px-2 dark:text-white dark:border-white">
              {formatNumber(Math.abs(buyPower), 0)} W
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
