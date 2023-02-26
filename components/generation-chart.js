'use client';

import {
  BarChart,
  LineChart,
  Bar,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  Line,
} from "recharts";

export default function GenerationChart({ reverseChart }) {
  return (
    <>
      <div className="h-[200px] dark:hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={500} height={200} data={reverseChart}>
            <XAxis dataKey="name" />
            <CartesianGrid vertical={false} />
            <Bar
              dataKey="generationValue"
              fill="#2B2A2B"
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="h-[200px] hidden dark:block">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={500} height={200} data={reverseChart}>
            <XAxis dataKey="name" />
            <CartesianGrid vertical={false} stroke="#353d4e" />
            <Bar
              dataKey="generationValue"
              fill="#6b7280"
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
