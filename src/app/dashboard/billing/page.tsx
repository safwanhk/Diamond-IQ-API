"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useDashboardUser } from "@/components/providers/dashboard-user-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLAN_FEATURES } from "@/lib/plans";
import type { Plan } from "@prisma/client";

const plans: Array<{
  id: Plan;
  name: string;
  price: string;
  requests: string;
  popular?: boolean;
}> = [
  { id: "FREE", name: "Free", price: "$0", requests: "100/mo" },
  { id: "STARTER", name: "Starter", price: "$29", requests: "10,000/mo" },
  { id: "PRO", name: "Pro", price: "$99", requests: "100,000/mo", popular: true },
  { id: "ENTERPRISE", name: "Enterprise", price: "Custom", requests: "Unlimited" },
];

export default function BillingPage() {
  const contextUser = useDashboardUser();
  const [loading, setLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const user = contextUser
    ? { plan: contextUser.plan as Plan, stripeCustomerId: contextUser.stripeCustomerId }
    : null;

  async function upgrade(plan: Plan) {
    if (plan === "FREE" || plan === "ENTERPRISE") return;
    setLoading(plan);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    setLoading(null);
    if (data.url) window.location.href = data.url;
  }

  async function openPortal() {
    setPortalLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    setPortalLoading(false);
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Unable to open billing portal");
  }

  return (
    <DashboardShell
      title="Billing & Plans"
      description={
        user
          ? `Current plan: ${user.plan}`
          : "Choose the plan that fits your business"
      }
    >
      {user && user.plan !== "FREE" && (
        <div className="mb-6">
          <Button variant="outline" onClick={openPortal} disabled={portalLoading}>
            {portalLoading ? "Opening..." : "Manage Subscription"}
          </Button>
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative h-full ${
              plan.popular
                ? "border-primary/50 shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                : ""
            }`}
          >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="accent">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-3xl font-bold">{plan.price}</div>
                <CardDescription>{plan.requests}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2">
                  {PLAN_FEATURES[plan.id].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {user?.plan === plan.id ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                ) : plan.id === "FREE" || plan.id === "ENTERPRISE" ? (
                  <Button className="w-full" variant="outline" disabled>
                    {plan.id === "ENTERPRISE" ? "Contact Sales" : "Downgrade"}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => upgrade(plan.id)}
                    disabled={loading === plan.id}
                  >
                    {loading === plan.id ? "Redirecting..." : "Upgrade"}
                  </Button>
                )}
              </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
