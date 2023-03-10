"use client";

export default function TrendDown({ value }) {
  return (
    <div
      className={[
        "bg-gray-50 w-7 h-7 flex justify-center items-center rounded-lg text-opacity-80 text-base font-semibold",
        // value < 0 ? "bg-green-50 text-green-900" : "",
        // value > 0 ? "bg-orange-50 text-orange-900" : "",
      ].join(" ")}
    >
      {value > 0 ? (
        <span className="opacity-50">△</span>
      ) : (
        <span className="opacity-50">▽</span>
      )}
    </div>
  );
}
