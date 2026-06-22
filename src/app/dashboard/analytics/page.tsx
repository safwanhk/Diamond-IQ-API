"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Activity, DollarSign, Users, Gem } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RequestsChart = dynamic(
  () => import("@/components/dashboard/charts").then((m) => m.RequestsChart),
  { ssr: false, loading: () => <Skeleton className="h-[280px] w-full rounded-lg" /> }
);
const RevenueChart = dynamic(
  () => import("@/components/dashboard/charts").then((m) => m.RevenueChart),
  { ssr: false, loading: () => <Skeleton className="h-[280px] w-full rounded-lg" /> }
);
const UsageLineChart = dynamic(
  () => import("@/components/dashboard/charts").then((m) => m.UsageLineChart),
  { ssr: false, loading: () => <Skeleton className="h-[200px] w-full rounded-lg" /> }
);
const TopItemsChart = dynamic(
  () => import("@/components/dashboard/charts").then((m) => m.TopItemsChart),
  { ssr: false, loading: () => <Skeleton className="h-[240px] w-full rounded-lg" /> }
);

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
  requests: 20 + (i % 5) * 12 + (i > 8 && i < 18 ? 30 : 0),
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Requests Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <RequestsChart data={data?.dailyUsage || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={mockRevenue} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">API Usage (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <UsageLineChart data={mockHourly} />
          </CardContent>
        </Card>

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
                      style={{ background: ["#0070f3", "#50e3c2", "#888888", "#ededed"][i] }}
                    />
                    <span>{d.name}</span>
                  </div>
                  <span className="text-muted-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
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
    </DashboardShell>
  );
}
