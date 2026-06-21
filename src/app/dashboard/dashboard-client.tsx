"use client";

import { useEffect, useState } from "react";
import type { User } from "@prisma/client";
import { motion } from "framer-motion";
import { Activity, Key, TrendingUp, Zap, ArrowUpRight } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { RequestsChart } from "@/components/dashboard/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/utils";

interface DashboardData {
  usage: {
    plan: string;
    limit: number;
    used: number;
    remaining: number;
    percentage: number;
  };
  apiKeys: Array<{ id: string; name: string; key: string; active: boolean }>;
  recentRequests: Array<{ id: string; endpoint: string; statusCode: number; createdAt: string }>;
  dailyUsage: Array<{ date: string; count: number }>;
}

export function DashboardClient({ user }: { user: User }) {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const usage = data?.usage;
  const limitDisplay = usage?.limit === -1 ? "Unlimited" : formatNumber(usage?.limit || 0);
  const remainingDisplay =
    usage?.remaining === -1 ? "Unlimited" : formatNumber(usage?.remaining || 0);

  return (
    <DashboardShell
      user={{ name: user.name, email: user.email, role: user.role, plan: user.plan }}
      title="Overview"
      description={`Welcome back, ${user.name.split(" ")[0]}`}
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current Plan"
          value={usage?.plan || user.plan}
          icon={Zap}
          index={0}
          delay={0}
        />
        <StatCard
          title="Requests Used"
          value={usage?.used ?? "—"}
          description={`of ${limitDisplay} this month`}
          icon={Activity}
          trend={{ value: "+12% vs last month", positive: true }}
          index={1}
          delay={0.05}
        />
        <StatCard
          title="Remaining"
          value={remainingDisplay}
          icon={TrendingUp}
          index={2}
          delay={0.1}
        />
        <StatCard
          title="API Keys"
          value={data?.apiKeys?.length ?? "—"}
          icon={Key}
          index={3}
          delay={0.15}
        />
      </div>

      {usage && usage.limit !== -1 && (
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Monthly Usage</CardTitle>
              <Badge variant={usage.percentage > 80 ? "destructive" as const : "secondary"}>
                {usage.percentage}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between text-sm text-muted-foreground">
                <span>{usage.used} used</span>
                <span>{usage.remaining} remaining</span>
              </div>
              <Progress value={usage.percentage} className="h-2" />
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Requests Over Time</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <RequestsChart data={data?.dailyUsage || []} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(data?.recentRequests || []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Activity className="mb-3 h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No requests yet</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Make your first API call to see activity here
                    </p>
                  </div>
                ) : (
                  data?.recentRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 transition-colors hover:border-primary/20 hover:bg-white/[0.04]"
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
        </motion.div>
      </div>
    </DashboardShell>
  );
}
