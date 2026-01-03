"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface SalespersonData {
  name: string;
  value: number;
  sales: number;
}

interface SalespersonPieChartProps {
  data: SalespersonData[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function SalespersonPieChart({ data }: SalespersonPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-brand-platinum">
        No salesperson data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data as any[]}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any) => {
            const val = typeof value === "number" ? value : 0;
            return [`$${val.toFixed(2)}`, "Revenue"];
          }}
          contentStyle={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "8px",
            color: "#e5e5e5",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
