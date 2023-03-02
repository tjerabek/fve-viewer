"use client";

import {
  BarChart,
  LineChart,
  Bar,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  Line,
  YAxis,
} from "recharts";

export default function ProgressChart({ data, dataKey }) {
  return (
    <>
      <div className="h-[75px] dark:hidden">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={200} height={100} data={data}>
            <Line
              type="natural"
              dataKey={dataKey}
              stroke="#6b7280"
              dot={false}
              isAnimationActive={false}
              strokeWidth={1.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="h-[75px] hidden dark:block">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={200} height={100} data={data}>
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#6b7280"
              dot={false}
              isAnimationActive={false}
              strokeWidth={1.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
