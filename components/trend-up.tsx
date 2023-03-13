"use client";

export default function TrendUp({ value, isReverse }) {
  return (
    <div
      className={[
        "bg-gray-50 dark:bg-gray-800 w-5 h-5 flex justify-center items-center rounded-lg text-opacity-80 text-xs font-semibold",
        (value > 0 && !isReverse) || (value < 0 && isReverse) ? "bg-green-50 text-green-900 dark:bg-green-900 dark:text-green-400" : "",
        (value < 0 && !isReverse) || (value > 0 && isReverse) ? "bg-orange-50 text-orange-900 dark:bg-orange-900 dark:text-orange-400" : "",
      ].join(" ")}
    >
      {value > 0 ? (
        <span className="opacity-50">⌃</span>
      ) : (
        <span className="opacity-50 rotate-180">⌃</span>
      )}
    </div>
  );
}
