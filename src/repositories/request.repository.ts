import { prisma } from "@/lib/db";

export class RequestRepository {
  async create(data: {
    userId: string;
    apiKeyId?: string;
    endpoint: string;
    creditsUsed?: number;
    statusCode?: number;
  }) {
    return prisma.request.create({ data });
  }

  async findByUserId(userId: string, limit = 20) {
    return prisma.request.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async countAll() {
    return prisma.request.count();
  }

  async countSince(date: Date) {
    return prisma.request.count({
      where: { createdAt: { gte: date } },
    });
  }

  async getTopEndpoints(limit = 5) {
    const results = await prisma.request.groupBy({
      by: ["endpoint"],
      _count: { endpoint: true },
      orderBy: { _count: { endpoint: "desc" } },
      take: limit,
    });
    return results.map((r) => ({
      endpoint: r.endpoint,
      count: r._count.endpoint,
    }));
  }
}

export const requestRepository = new RequestRepository();
