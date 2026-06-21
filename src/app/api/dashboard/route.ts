import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { userRepository } from "@/repositories/user.repository";
import { requestRepository } from "@/repositories/request.repository";
import { usageService } from "@/services/usage.service";
import { apiKeyRepository } from "@/repositories/api-key.repository";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await userRepository.findById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const [usage, apiKeys, recentRequests, dailyUsage] = await Promise.all([
    usageService.getUsageStats(user.id, user.plan),
    apiKeyRepository.findByUserId(user.id),
    requestRepository.findByUserId(user.id, 10),
    usageService.getDailyUsage(user.id),
  ]);

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      role: user.role,
    },
    usage,
    apiKeys: apiKeys.map((k) => ({
      id: k.id,
      name: k.name,
      key: `${k.key.slice(0, 8)}...${k.key.slice(-4)}`,
      active: k.active,
      createdAt: k.createdAt,
      lastUsed: k.lastUsed,
    })),
    recentRequests,
    dailyUsage,
  });
}
