"use client";

import { useEffect, useState } from "react";
import { Users, Activity, DollarSign, CreditCard, Server } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface AdminData {
  stats: {
    totalUsers: number;
    totalRequests: number;
    requestsLast30d: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    systemHealth: string;
  };
  planBreakdown: Array<{ plan: string; count: number }>;
  topEndpoints: Array<{ endpoint: string; count: number }>;
  mostRequested: Array<{
    color: string;
    clarity: string;
    cut: string;
    count: number;
    avgPrice: number;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    plan: string;
    createdAt: string;
    _count: { requests: number };
  }>;
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);

  useEffect(() => {
    fetch("/api/admin")
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <DashboardShell title="Admin Dashboard" description="System overview and analytics">
      {data && (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard title="Total Users" value={data.stats.totalUsers} icon={Users} index={0} />
            <StatCard title="Total Requests" value={data.stats.totalRequests} icon={Activity} index={1} />
            <StatCard title="Requests (30d)" value={data.stats.requestsLast30d} icon={Activity} index={2} />
            <StatCard title="Active Subscriptions" value={data.stats.activeSubscriptions} icon={CreditCard} index={3} />
            <StatCard title="Monthly Revenue" value={formatCurrency(data.stats.monthlyRevenue)} icon={DollarSign} index={0} />
          </div>

          <div className="mb-6 flex items-center gap-2">
            <Server className="h-4 w-4 text-success" />
            <span className="text-sm text-success">
              System Health: {data.stats.systemHealth}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Plan Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.planBreakdown.map((p) => (
                    <div key={p.plan} className="flex items-center justify-between rounded-lg border border-white/[0.04] px-3 py-2">
                      <span className="text-sm font-medium">{p.plan}</span>
                      <Badge variant="secondary">{p.count} users</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.topEndpoints.map((ep) => (
                    <div key={ep.endpoint} className="flex items-center justify-between rounded-lg border border-white/[0.04] px-3 py-2">
                      <code className="text-sm text-accent">{ep.endpoint}</code>
                      <span className="text-sm text-muted-foreground">{ep.count} calls</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Most Requested Valuations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.mostRequested.map((v, i) => (
                    <div key={i} className="flex items-center justify-between text-sm rounded-lg border border-white/[0.04] px-3 py-2">
                      <span>{v.color} / {v.clarity} / {v.cut}</span>
                      <span className="text-muted-foreground">
                        {v.count}x · avg {formatCurrency(v.avgPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.recentUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between rounded-lg border border-white/[0.04] px-3 py-2">
                      <div>
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="accent">{u.plan}</Badge>
                        <p className="mt-1 text-xs text-muted-foreground">{formatDate(u.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
