import { prisma } from "@/lib/db";
import type {
  Certificate,
  DiamondClarity,
  DiamondColor,
  DiamondCut,
  MarketplaceSource,
  ScraperRunStatus,
} from "@prisma/client";
import type { MarketStats, MarketTrendPoint } from "@/types/marketplace";

export class ListingRepository {
  async createRun(sources: string[]) {
    return prisma.scraperRun.create({
      data: {
        status: "RUNNING",
        sources: JSON.stringify(sources),
      },
    });
  }

  async completeRun(
    id: string,
    data: { totalFound: number; totalSaved: number; status: ScraperRunStatus; error?: string }
  ) {
    return prisma.scraperRun.update({
      where: { id },
      data: {
        ...data,
        completedAt: new Date(),
      },
    });
  }

  async saveListings(
    batchId: string,
    listings: Array<{
      externalId?: string;
      source: MarketplaceSource;
      carat: number;
      color: DiamondColor;
      clarity: DiamondClarity;
      cut: DiamondCut;
      certificate: Certificate;
      price: number;
      currency?: string;
      listingUrl?: string;
    }>
  ) {
    if (listings.length === 0) return 0;

    const result = await prisma.diamondListing.createMany({
      data: listings.map((l) => ({
        batchId,
        externalId: l.externalId,
        source: l.source,
        carat: l.carat,
        color: l.color,
        clarity: l.clarity,
        cut: l.cut,
        certificate: l.certificate,
        price: l.price,
        currency: l.currency ?? "USD",
        listingUrl: l.listingUrl,
      })),
    });

    return result.count;
  }

  async getLatestRun() {
    return prisma.scraperRun.findFirst({
      where: { status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
    });
  }

  async getStats(days = 30): Promise<MarketStats> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [agg, bySource, latest] = await Promise.all([
      prisma.diamondListing.aggregate({
        where: { scrapedAt: { gte: since } },
        _avg: { price: true },
        _min: { price: true },
        _max: { price: true },
        _count: true,
      }),
      prisma.diamondListing.groupBy({
        by: ["source"],
        where: { scrapedAt: { gte: since } },
        _avg: { price: true },
        _count: true,
      }),
      prisma.diamondListing.findFirst({
        orderBy: { scrapedAt: "desc" },
        select: { scrapedAt: true },
      }),
    ]);

    return {
      totalListings: agg._count,
      averagePrice: Math.round(agg._avg.price ?? 0),
      lowestPrice: Math.round(agg._min.price ?? 0),
      highestPrice: Math.round(agg._max.price ?? 0),
      lastScrapedAt: latest?.scrapedAt.toISOString() ?? null,
      bySource: bySource.map((s) => ({
        source: s.source,
        count: s._count,
        averagePrice: Math.round(s._avg.price ?? 0),
      })),
    };
  }

  async getTrend(days = 30): Promise<MarketTrendPoint[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const listings = await prisma.diamondListing.findMany({
      where: { scrapedAt: { gte: since } },
      select: { price: true, scrapedAt: true },
      orderBy: { scrapedAt: "asc" },
    });

    const daily = new Map<string, number[]>();

    for (const l of listings) {
      const key = l.scrapedAt.toISOString().split("T")[0];
      const prices = daily.get(key) ?? [];
      prices.push(l.price);
      daily.set(key, prices);
    }

    return Array.from(daily.entries()).map(([date, prices]) => ({
      date,
      averagePrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      lowestPrice: Math.round(Math.min(...prices)),
      highestPrice: Math.round(Math.max(...prices)),
      count: prices.length,
    }));
  }

  async getRecentListings(limit = 20) {
    return prisma.diamondListing.findMany({
      orderBy: { scrapedAt: "desc" },
      take: limit,
    });
  }
}

export const listingRepository = new ListingRepository();
