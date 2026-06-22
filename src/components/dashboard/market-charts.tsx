"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MarketTrendPoint } from "@/types/marketplace";
import { formatCurrency } from "@/lib/utils";

interface MarketTrendChartProps {
  data: MarketTrendPoint[];
}

function TooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-medium" style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export function MarketTrendChart({ data }: MarketTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        No trend data yet — run the scraper to populate market history.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0070f3" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#0070f3" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickFormatter={(v) => v.slice(5)}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<TooltipContent />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="averagePrice"
          name="Average"
          stroke="#0070f3"
          strokeWidth={2}
          fill="url(#avgGradient)"
        />
        <Area
          type="monotone"
          dataKey="lowestPrice"
          name="Lowest"
          stroke="#22c55e"
          strokeWidth={1.5}
          fill="none"
          strokeDasharray="4 4"
        />
        <Area
          type="monotone"
          dataKey="highestPrice"
          name="Highest"
          stroke="#f59e0b"
          strokeWidth={1.5}
          fill="none"
          strokeDasharray="4 4"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
