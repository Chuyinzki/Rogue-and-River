"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SwimmingPoint = {
  label: string;
  distanceKm: number;
};

type SwimmingWeeklyChartProps = {
  data: SwimmingPoint[];
};

export function SwimmingWeeklyChart({ data }: SwimmingWeeklyChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#64748b33" />
          <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} unit=" km" />
          <Tooltip
            contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid #334155",
              backgroundColor: "#0f172a",
              color: "#e2e8f0",
            }}
          />
          <Line
            type="monotone"
            dataKey="distanceKm"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
