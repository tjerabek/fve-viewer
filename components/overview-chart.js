import Image from "next/image";

export default function OverviewChart({ generationPower, buyPower }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] grid-rows-2 p-6 md:p-10 max-w-[375px]">
      <div>
        <div className="flex items-center">
          <div>
            <Image
              src="sun-dark.svg"
              width={24}
              height={24}
              className={[
                generationPower > 0 ? "" : "opacity-20",
                "dark:hidden",
              ].join(" ")}
            />
            <Image
              src="sun-light.svg"
              width={24}
              height={24}
              className={[
                generationPower > 0 ? "" : "opacity-20",
                "hidden dark:block",
              ].join(" ")}
            />
          </div>
        </div>
      </div>
      <div className="row-span-2 py-3 px-4">
        <svg
          viewBox="0 0 194 73"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <path
            d="M1 1H192"
            stroke-width="1.5"
            stroke-linecap="round"
            className={[
              generationPower > 0 ? "" : "opacity-20",
              "stroke-black dark:stroke-white",
            ].join(" ")}
          />
          <path
            d="M1 71H58.5C64.0228 71 68.5 66.5228 68.5 61V11C68.5 5.47715 72.9772 1 78.5 1H192"
            stroke="black"
            stroke-width="1.5"
            stroke-linecap="round"
            className={[
              buyPower < 0 ? "" : "opacity-20",
              "stroke-black dark:stroke-white",
            ].join(" ")}
          />
        </svg>
      </div>
      <div className="space-y-2 flex-row items-center">
        <div>
          <Image
            src="house-dark.svg"
            width={24}
            height={24}
            className="dark:hidden"
          />
          <Image
            src="house-light.svg"
            width={24}
            height={24}
            className="dark:block hidden"
          />
        </div>
      </div>
      <div className="flex items-end">
        <div className="flex items-center">
          <div>
            <Image
              src="power-plant-dark.svg"
              width={24}
              height={24}
              className={[
                buyPower < 0 ? "" : "opacity-20",
                "dark:hidden",
              ].join(" ")}
            />
            <Image
              src="power-plant-light.svg"
              width={24}
              height={24}
              className={[
                buyPower < 0 ? "" : "opacity-20",
                "dark:block hidden",
              ].join(" ")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
