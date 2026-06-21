import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { userRepository } from "@/repositories/user.repository";
import { requestRepository } from "@/repositories/request.repository";
import { valuationRepository } from "@/repositories/valuation.repository";
import { PLAN_PRICES } from "@/lib/plans";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalUsers,
    totalRequests,
    requestsLast30d,
    planBreakdown,
    topEndpoints,
    mostRequested,
    recentUsers,
  ] = await Promise.all([
    userRepository.countAll(),
    requestRepository.countAll(),
    requestRepository.countSince(thirtyDaysAgo),
    userRepository.countByPlan(),
    requestRepository.getTopEndpoints(),
    valuationRepository.getMostRequested(),
    userRepository.findAll(0, 10),
  ]);

  const activeSubscriptions = planBreakdown
    .filter((p) => p.plan !== "FREE")
    .reduce((sum, p) => sum + p._count.plan, 0);

  const monthlyRevenue = planBreakdown.reduce((sum, p) => {
    return sum + p._count.plan * PLAN_PRICES[p.plan];
  }, 0);

  return NextResponse.json({
    stats: {
      totalUsers,
      totalRequests,
      requestsLast30d,
      activeSubscriptions,
      monthlyRevenue,
      systemHealth: "healthy",
    },
    planBreakdown: planBreakdown.map((p) => ({
      plan: p.plan,
      count: p._count.plan,
    })),
    topEndpoints,
    mostRequested,
    recentUsers,
  });
}
