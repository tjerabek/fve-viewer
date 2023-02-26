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

export default function BuyChart({ reverseChart }) {
  return (
    <>
      <div className="h-[200px] dark:hidden">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={500} height={200} data={reverseChart}>
            <XAxis dataKey="name" />
            <CartesianGrid vertical={false} />
            <Line type="monotone" dataKey="buyValue" stroke="#2B2A2B" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="h-[200px] hidden dark:block">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={500} height={200} data={reverseChart}>
            <XAxis dataKey="name" />
            <CartesianGrid vertical={false} stroke="#353d4e" />
            <Line type="monotone" dataKey="buyValue" stroke="#6b7280" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
