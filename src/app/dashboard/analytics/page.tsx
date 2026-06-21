"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, DollarSign, Users, Gem } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  RequestsChart,
  RevenueChart,
  UsageLineChart,
  TopItemsChart,
} from "@/components/dashboard/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockRevenue = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5800 },
  { month: "Mar", revenue: 7100 },
  { month: "Apr", revenue: 6500 },
  { month: "May", revenue: 8900 },
  { month: "Jun", revenue: 10200 },
];

const mockHourly = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  requests: Math.floor(Math.random() * 80) + 10,
}));

const mockTopDiamonds = [
  { name: "D/VVS1/1ct", value: 342 },
  { name: "E/VS1/1.5ct", value: 218 },
  { name: "F/SI1/2ct", value: 156 },
  { name: "G/VS2/0.8ct", value: 124 },
  { name: "Other", value: 89 },
];

const mockCustomers = [
  { name: "LuxeGems API", requests: 12400, revenue: "$2,480" },
  { name: "RingCraft", requests: 8900, revenue: "$1,780" },
  { name: "DiamondDirect", requests: 6200, revenue: "$1,240" },
  { name: "GemVault", requests: 4100, revenue: "$820" },
];

interface DashboardData {
  dailyUsage: Array<{ date: string; count: number }>;
  usage: { used: number; plan: string };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <DashboardShell
      title="Usage Analytics"
      description="Monitor API performance, revenue, and usage patterns"
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Requests" value={data?.usage?.used ?? "—"} icon={Activity} trend={{ value: "+18% this month", positive: true }} index={0} />
        <StatCard title="Monthly Revenue" value="$10,200" icon={DollarSign} trend={{ value: "+24% vs last month", positive: true }} index={1} />
        <StatCard title="Active API Keys" value="3" icon={Users} index={2} />
        <StatCard title="Diamond Searches" value="929" icon={Gem} trend={{ value: "+8% this week", positive: true }} index={3} />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Requests Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <RequestsChart data={data?.dailyUsage || []} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={mockRevenue} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">API Usage (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <UsageLineChart data={mockHourly} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Most Searched Diamonds</CardTitle>
            </CardHeader>
            <CardContent>
              <TopItemsChart data={mockTopDiamonds} />
              <div className="mt-4 space-y-2">
                {mockTopDiamonds.slice(0, 4).map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ background: ["#2563eb", "#06b6d4", "#22c55e", "#8b5cf6"][i] }}
                      />
                      <span>{d.name}</span>
                    </div>
                    <span className="text-muted-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Requests</th>
                    <th className="pb-3 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCustomers.map((c) => (
                    <tr key={c.name} className="border-b border-border/50 last:border-0">
                      <td className="py-3 font-medium">{c.name}</td>
                      <td className="py-3 text-muted-foreground">{c.requests.toLocaleString()}</td>
                      <td className="py-3 text-muted-foreground">{c.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardShell>
  );
}
