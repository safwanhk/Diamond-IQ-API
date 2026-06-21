import Link from "next/link";
import { Check } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLAN_FEATURES } from "@/lib/plans";

const plans = [
  { id: "FREE", name: "Free", price: 0, requests: "100/month", cta: "Get Started" },
  { id: "STARTER", name: "Starter", price: 29, requests: "10,000/month", cta: "Start Trial" },
  { id: "PRO", name: "Pro", price: 99, requests: "100,000/month", cta: "Go Pro", popular: true },
  { id: "ENTERPRISE", name: "Enterprise", price: null, requests: "Unlimited", cta: "Contact Sales" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">Simple Pricing</h1>
          <p className="mt-4 text-lg text-slate-600">
            Start free, scale as you grow. No hidden fees.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={plan.popular ? "border-indigo-600 ring-2 ring-indigo-600" : ""}
            >
              <CardHeader>
                {plan.popular && (
                  <span className="mb-2 w-fit rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                    Most Popular
                  </span>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-4xl font-bold">
                  {plan.price !== null ? `$${plan.price}` : "Custom"}
                  {plan.price !== null && plan.price > 0 && (
                    <span className="text-base font-normal text-slate-500">/mo</span>
                  )}
                </div>
                <CardDescription>{plan.requests}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2">
                  {PLAN_FEATURES[plan.id as keyof typeof PLAN_FEATURES].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href="/register">{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
