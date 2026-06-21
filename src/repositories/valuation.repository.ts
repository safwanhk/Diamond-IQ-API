import { prisma } from "@/lib/db";
import type { Trend } from "@prisma/client";

export class ValuationRepository {
  async create(data: {
    userId?: string;
    carat: number;
    color: string;
    clarity: string;
    cut: string;
    certificate: string;
    estimatedPrice: number;
    lowPrice: number;
    highPrice: number;
    confidence: number;
    trend: Trend;
    investmentScore: number;
  }) {
    return prisma.diamondValuation.create({
      data: data as Parameters<typeof prisma.diamondValuation.create>[0]["data"],
    });
  }

  async findByUserId(userId: string, limit = 20) {
    return prisma.diamondValuation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async getTrends() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const valuations = await prisma.diamondValuation.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: {
        trend: true,
        estimatedPrice: true,
        carat: true,
        color: true,
        createdAt: true,
      },
    });

    const trendCounts = { UP: 0, DOWN: 0, STABLE: 0 };
    let totalPrice = 0;

    for (const v of valuations) {
      trendCounts[v.trend]++;
      totalPrice += v.estimatedPrice;
    }

    const avgPrice =
      valuations.length > 0 ? Math.round(totalPrice / valuations.length) : 0;

    return {
      period: "30d",
      totalValuations: valuations.length,
      averagePrice: avgPrice,
      trends: trendCounts,
      marketSentiment:
        trendCounts.UP > trendCounts.DOWN
          ? "BULLISH"
          : trendCounts.DOWN > trendCounts.UP
            ? "BEARISH"
            : "NEUTRAL",
    };
  }

  async getMostRequested() {
    const results = await prisma.diamondValuation.groupBy({
      by: ["color", "clarity", "cut"],
      _count: { id: true },
      _avg: { estimatedPrice: true, carat: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });

    return results.map((r) => ({
      color: r.color,
      clarity: r.clarity,
      cut: r.cut,
      count: r._count.id,
      avgPrice: Math.round(r._avg.estimatedPrice || 0),
      avgCarat: Math.round((r._avg.carat || 0) * 100) / 100,
    }));
  }
}

export const valuationRepository = new ValuationRepository();
