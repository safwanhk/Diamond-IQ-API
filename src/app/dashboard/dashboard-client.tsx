"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Activity, Key, TrendingUp, Zap, ArrowUpRight, Calendar, CheckCircle2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatNumber } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { useDashboardUser } from "@/components/providers/dashboard-user-provider";

const RequestsChart = dynamic(
  () => import("@/components/dashboard/charts").then((m) => m.RequestsChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[280px] w-full rounded-lg" />,
  }
);

interface DashboardData {
  usage: {
    plan: string;
    limit: number;
    used: number;
    remaining: number;
    percentage: number;
  };
  metrics?: {
    requestsToday: number;
    requestsThisWeek: number;
    requestsThisMonth: number;
    remainingCredits: number;
    successRate: number;
  };
  apiKeys: Array<{ id: string; name: string; key: string; active: boolean }>;
  recentRequests: Array<{ id: string; endpoint: string; statusCode: number; createdAt: string }>;
  dailyUsage: Array<{ date: string; count: number }>;
}

export function DashboardClient() {
  const user = useDashboardUser();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!user) return null;

  const usage = data?.usage;
  const limitDisplay = usage?.limit === -1 ? "Unlimited" : formatNumber(usage?.limit || 0);
  const remainingDisplay =
    usage?.remaining === -1 ? "Unlimited" : formatNumber(usage?.remaining || 0);

  return (
    <DashboardShell
      title="Overview"
      description={`Welcome back, ${user.name.split(" ")[0]}`}
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Current Plan" value={usage?.plan || user.plan} icon={Zap} index={0} />
        <StatCard
          title="Today"
          value={data?.metrics?.requestsToday ?? "—"}
          description="requests"
          icon={Calendar}
          index={1}
        />
        <StatCard
          title="This Week"
          value={data?.metrics?.requestsThisWeek ?? "—"}
          description="requests"
          icon={Activity}
          index={2}
        />
        <StatCard
          title="This Month"
          value={data?.metrics?.requestsThisMonth ?? usage?.used ?? "—"}
          description={`of ${limitDisplay}`}
          icon={TrendingUp}
          index={3}
        />
        <StatCard
          title="Success Rate"
          value={data?.metrics?.successRate != null ? `${data.metrics.successRate}%` : "—"}
          icon={CheckCircle2}
          index={4}
        />
        <StatCard title="API Keys" value={data?.apiKeys?.length ?? "—"} icon={Key} index={5} />
      </div>

      {usage && usage.limit !== -1 && (
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Monthly Usage</CardTitle>
            <Badge variant={usage.percentage > 80 ? ("destructive" as const) : "secondary"}>
              {usage.percentage}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between text-sm text-muted-foreground">
              <span>{usage.used} used</span>
              <span>{remainingDisplay} remaining</span>
            </div>
            <Progress value={usage.percentage} className="h-2" />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Requests Over Time</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <RequestsChart data={data?.dailyUsage || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(data?.recentRequests || []).length === 0 ? (
                <EmptyState
                  icon={Activity}
                  title="No requests yet"
                  description="Make your first API call to see activity here"
                />
              ) : (
                data?.recentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{req.endpoint}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(req.createdAt)}
                      </p>
                    </div>
                    <Badge variant={req.statusCode < 400 ? "success" : "destructive"}>
                      {req.statusCode}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
