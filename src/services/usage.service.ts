import { prisma } from "@/lib/db";
import { getPlanLimit, getRemainingRequests, getUsagePercentage } from "@/lib/plans";
import type { Plan } from "@prisma/client";
import type { UsageResponse } from "@/types";

function getMonthBounds(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
}

export class UsageService {
  async getMonthlyUsage(userId: string): Promise<number> {
    const { start } = getMonthBounds();
    return prisma.request.count({
      where: {
        userId,
        createdAt: { gte: start },
      },
    });
  }

  async checkLimit(userId: string, plan: Plan): Promise<{
    allowed: boolean;
    used: number;
    limit: number;
    remaining: number;
  }> {
    const used = await this.getMonthlyUsage(userId);
    const limit = getPlanLimit(plan);
    const remaining = getRemainingRequests(used, plan);

    return {
      allowed: used < limit,
      used,
      limit,
      remaining,
    };
  }

  async getUsageStats(userId: string, plan: Plan): Promise<UsageResponse> {
    const { start, end } = getMonthBounds();
    const used = await this.getMonthlyUsage(userId);
    const limit = getPlanLimit(plan);
    const remaining = getRemainingRequests(used, plan);

    return {
      plan,
      limit: limit === Infinity ? -1 : limit,
      used,
      remaining: remaining === Infinity ? -1 : remaining,
      percentage: getUsagePercentage(used, plan),
      periodStart: start.toISOString(),
      periodEnd: end.toISOString(),
    };
  }

  async getDailyUsage(userId: string, days = 30) {
    const start = new Date();
    start.setDate(start.getDate() - days);

    const requests = await prisma.request.findMany({
      where: {
        userId,
        createdAt: { gte: start },
      },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const dailyMap = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      dailyMap.set(d.toISOString().split("T")[0], 0);
    }

    for (const req of requests) {
      const key = req.createdAt.toISOString().split("T")[0];
      dailyMap.set(key, (dailyMap.get(key) || 0) + 1);
    }

    return Array.from(dailyMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }
}

export const usageService = new UsageService();
