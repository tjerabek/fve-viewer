"use client";

export default function TrendUp({ value }) {
  return (
    <div
      className={[
        "bg-gray-50 dark:bg-gray-800 w-5 h-5 flex justify-center items-center rounded-lg text-opacity-80 text-xs font-semibold",
        // value > 0 ? "bg-green-50 text-green-900" : "",
        // value < 0 ? "bg-orange-50 text-orange-900" : "",
      ].join(" ")}
    >
      {value > 0 ? (
        <span className="opacity-50 relative top-[2px]">⌃</span>
      ) : (
        <span className="opacity-50 rotate-180">⌃</span>
      )}
    </div>
  );
}
