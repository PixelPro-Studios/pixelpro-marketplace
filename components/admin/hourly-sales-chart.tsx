"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface HourlySalesData {
  hour: string;
  sales: number;
  orders: number;
}

interface HourlySalesChartProps {
  data: HourlySalesData[];
}

export function HourlySalesChart({ data }: HourlySalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-brand-platinum">
        No hourly sales data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis
          dataKey="hour"
          stroke="#999"
          tick={{ fill: '#999' }}
        />
        <YAxis
          stroke="#999"
          tick={{ fill: '#999' }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={((value: any, name: any) => {
            if (name === "Sales ($)" || name === "sales") {
              const numValue = Number(value) || 0;
              return [`$${numValue.toFixed(2)}`, "Sales"];
            }
            return [value, "Orders"];
          }) as any}
          contentStyle={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "8px",
            color: "#e5e5e5",
          }}
          labelStyle={{
            color: "#e5e5e5",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6' }}
          name="Sales ($)"
        />
        <Line
          type="monotone"
          dataKey="orders"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981' }}
          name="Orders"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
