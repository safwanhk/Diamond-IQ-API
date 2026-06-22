"use client";

import { useEffect, useState } from "react";
import { Gem, Search, TrendingUp, Filter } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Valuation {
  id: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  estimatedPrice: number;
  confidence: number;
  trend: string;
  createdAt: string;
}

export default function ValuationsPage() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/valuations")
      .then((r) => r.json())
      .then((d) => {
        setValuations(d.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = valuations.filter(
    (v) =>
      v.color.toLowerCase().includes(search.toLowerCase()) ||
      v.clarity.toLowerCase().includes(search.toLowerCase()) ||
      v.cut.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell
      title="Valuations"
      description="Browse your valuation history and search patterns"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by color, clarity, cut..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Gem className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="text-lg font-semibold">No valuations yet</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Your valuation history will appear here once you start making API requests.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((v) => (
            <Card key={v.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                      <Gem className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {v.carat}ct · {v.color} · {v.clarity} · {v.cut}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(v.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatCurrency(v.estimatedPrice)}</p>
                      <div className="flex items-center gap-1 justify-end">
                        <TrendingUp className={`h-3 w-3 ${v.trend === "UP" ? "text-success" : "text-red-500"}`} />
                        <span className="text-xs text-muted-foreground">{v.confidence}% confidence</span>
                      </div>
                    </div>
                    <Badge variant={v.trend === "UP" ? "success" : "secondary"}>
                      {v.trend}
                    </Badge>
                  </div>
                </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
