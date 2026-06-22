import { prisma } from "@/lib/db";
import { generateApiKey } from "@/lib/auth";

export class ApiKeyRepository {
  async findByKey(key: string) {
    return prisma.apiKey.findUnique({
      where: { key },
      include: { user: true },
    });
  }

  async findByUserId(userId: string) {
    return prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(userId: string, name = "Default") {
    return prisma.apiKey.create({
      data: {
        userId,
        key: generateApiKey(),
        name,
      },
    });
  }

  async deactivate(id: string, userId: string) {
    return prisma.apiKey.updateMany({
      where: { id, userId },
      data: { active: false },
    });
  }

  async delete(id: string, userId: string) {
    return prisma.apiKey.deleteMany({
      where: { id, userId },
    });
  }

  async rotate(id: string, userId: string) {
    const existing = await prisma.apiKey.findFirst({
      where: { id, userId, active: true },
    });
    if (!existing) return null;

    await prisma.apiKey.update({
      where: { id },
      data: { active: false },
    });

    return prisma.apiKey.create({
      data: {
        userId,
        key: generateApiKey(),
        name: existing.name,
      },
    });
  }

  async updateLastUsed(id: string) {
    return prisma.apiKey.update({
      where: { id },
      data: { lastUsed: new Date() },
    });
  }
}

export const apiKeyRepository = new ApiKeyRepository();
