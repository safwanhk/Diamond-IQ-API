import { Plan } from "@prisma/client";

export const PLAN_LIMITS: Record<Plan, number> = {
  FREE: 100,
  STARTER: 10_000,
  PRO: 100_000,
  ENTERPRISE: Infinity,
};

export const PLAN_PRICES: Record<Plan, number> = {
  FREE: 0,
  STARTER: 29,
  PRO: 99,
  ENTERPRISE: 0,
};

export const PLAN_FEATURES: Record<Plan, string[]> = {
  FREE: ["100 requests/month", "Basic valuation API", "Community support"],
  STARTER: [
    "10,000 requests/month",
    "Full valuation API",
    "History & trends",
    "Email support",
  ],
  PRO: [
    "100,000 requests/month",
    "Full valuation API",
    "History & trends",
    "Priority support",
    "Advanced analytics",
  ],
  ENTERPRISE: [
    "Unlimited requests",
    "Full valuation API",
    "Dedicated support",
    "Custom integrations",
    "SLA guarantee",
  ],
};

export function getPlanLimit(plan: Plan): number {
  return PLAN_LIMITS[plan];
}

export function getRemainingRequests(used: number, plan: Plan): number {
  const limit = getPlanLimit(plan);
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - used);
}

export function getUsagePercentage(used: number, plan: Plan): number {
  const limit = getPlanLimit(plan);
  if (limit === Infinity) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}
