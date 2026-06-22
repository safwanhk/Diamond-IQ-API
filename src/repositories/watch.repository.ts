import { prisma } from "@/lib/db";
import type { WatchBrand, WatchCondition, Trend } from "@prisma/client";

export class WatchRepository {
  async create(data: {
    userId?: string;
    brand: WatchBrand;
    model: string;
    referenceNumber?: string;
    condition: WatchCondition;
    year?: number;
    boxAndPapers: boolean;
    estimatedValue: number;
    resaleValue: number;
    lowPrice: number;
    highPrice: number;
    confidence: number;
    trend: Trend;
    investmentScore: number;
    marketDemandScore: number;
    liquidityScore: number;
  }) {
    return prisma.watchValuation.create({ data });
  }

  async findByUserId(userId: string, limit = 20) {
    return prisma.watchValuation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async countAll() {
    return prisma.watchValuation.count();
  }

  async avgPrice() {
    return prisma.watchValuation.aggregate({ _avg: { estimatedValue: true } });
  }
}

export const watchRepository = new WatchRepository();
