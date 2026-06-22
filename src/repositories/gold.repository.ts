import { prisma } from "@/lib/db";
import type { GoldPurity, GoldUnit, Trend } from "@prisma/client";

export class GoldRepository {
  async create(data: {
    userId?: string;
    weight: number;
    purity: GoldPurity;
    unit: GoldUnit;
    spotValue: number;
    retailValue: number;
    lowPrice: number;
    highPrice: number;
    confidence: number;
    trend: Trend;
    investmentScore: number;
    marketDemandScore: number;
    liquidityScore: number;
  }) {
    return prisma.goldValuation.create({ data });
  }

  async findByUserId(userId: string, limit = 20) {
    return prisma.goldValuation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async countAll() {
    return prisma.goldValuation.count();
  }

  async avgPrice() {
    return prisma.goldValuation.aggregate({ _avg: { retailValue: true } });
  }
}

export const goldRepository = new GoldRepository();
