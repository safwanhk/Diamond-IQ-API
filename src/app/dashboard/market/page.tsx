"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Gem,
  RefreshCw,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useDashboardUser } from "@/components/providers/dashboard-user-provider";
import type { MarketStats, MarketTrendPoint } from "@/types/marketplace";

const MarketTrendChart = dynamic(
  () => import("@/components/dashboard/market-charts").then((m) => m.MarketTrendChart),
  { ssr: false, loading: () => <Skeleton className="h-[300px] w-full rounded-lg" /> }
);

interface MarketData {
  stats: MarketStats;
  trend: MarketTrendPoint[];
  recent: Array<{
    id: string;
    source: string;
    carat: number;
    color: string;
    clarity: string;
    cut: string;
    certificate: string;
    price: number;
    scrapedAt: string;
  }>;
}

export default function MarketDashboardPage() {
  const user = useDashboardUser();
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);

  async function loadData() {
    setLoading(true);
    const res = await fetch("/api/market/stats");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function triggerScrape() {
    setScraping(true);
    await fetch("/api/market/scrape", { method: "POST" });
    await loadData();
    setScraping(false);
  }

  const stats = data?.stats;
  const trendDirection =
    data?.trend && data.trend.length >= 2
      ? data.trend[data.trend.length - 1].averagePrice -
        data.trend[data.trend.length - 2].averagePrice
      : 0;

  return (
    <DashboardShell
      title="Market Data"
      description="Live diamond listings scraped from public marketplaces"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Gem className="h-4 w-4" />
          {stats?.lastScrapedAt
            ? `Last updated ${formatDate(stats.lastScrapedAt)}`
            : "No scrape data yet"}
        </div>
        {user?.role === "ADMIN" && (
          <Button variant="outline" size="sm" onClick={triggerScrape} disabled={scraping}>
            <RefreshCw className={`mr-2 h-4 w-4 ${scraping ? "animate-spin" : ""}`} />
            {scraping ? "Scraping..." : "Run Scraper Now"}
          </Button>
        )}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Average Price"
          value={loading ? "—" : formatCurrency(stats?.averagePrice ?? 0)}
          icon={DollarSign}
          index={0}
        />
        <StatCard
          title="Lowest Price"
          value={loading ? "—" : formatCurrency(stats?.lowestPrice ?? 0)}
          icon={ArrowDown}
          index={1}
        />
        <StatCard
          title="Highest Price"
          value={loading ? "—" : formatCurrency(stats?.highestPrice ?? 0)}
          icon={ArrowUp}
          index={2}
        />
        <StatCard
          title="Total Listings"
          value={loading ? "—" : (stats?.totalListings ?? 0)}
          icon={Gem}
          trend={
            trendDirection !== 0
              ? {
                  value: `${trendDirection > 0 ? "+" : ""}${formatCurrency(Math.abs(trendDirection))} vs prior day`,
                  positive: trendDirection < 0,
                }
              : undefined
          }
          index={3}
        />
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Price Trend (30 days)</CardTitle>
          {trendDirection !== 0 && (
            <Badge variant={trendDirection < 0 ? "success" : "secondary"}>
              {trendDirection < 0 ? (
                <TrendingDown className="mr-1 h-3 w-3" />
              ) : (
                <TrendingUp className="mr-1 h-3 w-3" />
              )}
              {trendDirection < 0 ? "Trending Down" : "Trending Up"}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[300px] w-full rounded-lg" />
          ) : (
            <MarketTrendChart data={data?.trend ?? []} />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">By Marketplace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(stats?.bySource ?? []).map((s) => (
                <div
                  key={s.source}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{s.source.replace(/_/g, " ")}</p>
                    <p className="text-xs text-muted-foreground">{s.count} listings</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(s.averagePrice)}</p>
                </div>
              ))}
              {!loading && (stats?.bySource.length ?? 0) === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No listings yet. Run the scraper to collect market data.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(data?.recent ?? []).map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {l.carat}ct · {l.color} · {l.clarity}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {l.source.replace(/_/g, " ")} · {l.certificate}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(l.price)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
