import { prisma } from "@/lib/db";
import type { Plan, Role } from "@prisma/client";

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: Role;
    plan?: Plan;
  }) {
    return prisma.user.create({ data });
  }

  async updatePlan(userId: string, plan: Plan, stripeSubId?: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { plan, stripeSubId },
    });
  }

  async updateStripeCustomer(userId: string, stripeCustomerId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId },
    });
  }

  async countAll() {
    return prisma.user.count();
  }

  async findAll(skip = 0, take = 50) {
    return prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        createdAt: true,
        _count: { select: { requests: true } },
      },
    });
  }

  async countByPlan() {
    return prisma.user.groupBy({
      by: ["plan"],
      _count: { plan: true },
    });
  }
}

export const userRepository = new UserRepository();
