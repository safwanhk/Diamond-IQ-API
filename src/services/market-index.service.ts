import { prisma } from "@/lib/db";
import { goldRepository } from "@/repositories/gold.repository";
import { watchRepository } from "@/repositories/watch.repository";
import { valuationRepository } from "@/repositories/valuation.repository";

export interface MarketIndex {
  asset: "diamond" | "gold" | "watch";
  label: string;
  averageValue: number;
  trend: "UP" | "DOWN" | "STABLE";
  volume24h: number;
  changePercent: number;
}

export class MarketIndexService {
  async getIndex(): Promise<{
    indexes: MarketIndex[];
    updatedAt: string;
  }> {
    const [diamondAgg, goldAgg, watchAgg, diamondCount, goldCount, watchCount] =
      await Promise.all([
        prisma.diamondValuation.aggregate({
          _avg: { estimatedPrice: true },
          where: { createdAt: { gte: daysAgo(30) } },
        }),
        goldRepository.avgPrice(),
        watchRepository.avgPrice(),
        prisma.diamondValuation.count({ where: { createdAt: { gte: daysAgo(1) } } }),
        prisma.goldValuation.count({ where: { createdAt: { gte: daysAgo(1) } } }),
        prisma.watchValuation.count({ where: { createdAt: { gte: daysAgo(1) } } }),
      ]);

    const diamondTrend = await valuationRepository.getTrends();

    return {
      updatedAt: new Date().toISOString(),
      indexes: [
        {
          asset: "diamond",
          label: "Diamond Index",
          averageValue: Math.round(diamondAgg._avg.estimatedPrice ?? 8500),
          trend: sentimentToTrend(diamondTrend.marketSentiment),
          volume24h: diamondCount,
          changePercent: 2.4,
        },
        {
          asset: "gold",
          label: "Gold Index",
          averageValue: Math.round(goldAgg._avg.retailValue ?? 2350),
          trend: "UP",
          volume24h: goldCount,
          changePercent: 1.8,
        },
        {
          asset: "watch",
          label: "Luxury Watch Index",
          averageValue: Math.round(watchAgg._avg.estimatedValue ?? 18500),
          trend: "UP",
          volume24h: watchCount,
          changePercent: 3.1,
        },
      ],
    };
  }
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function sentimentToTrend(s: string): "UP" | "DOWN" | "STABLE" {
  if (s === "BULLISH") return "UP";
  if (s === "BEARISH") return "DOWN";
  return "STABLE";
}

export const marketIndexService = new MarketIndexService();
