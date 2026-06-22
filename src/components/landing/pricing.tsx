"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    requests: "10,000 requests",
    description: "For growing jewelry businesses",
    features: ["Real-time valuations", "API dashboard", "Email support", "99.9% uptime SLA"],
    highlight: false,
  },
  {
    name: "Professional",
    price: "$249",
    period: "/month",
    requests: "100,000 requests",
    description: "For marketplaces and platforms",
    features: [
      "Everything in Starter",
      "Batch valuations",
      "Webhook notifications",
      "Priority support",
      "Custom rate limits",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$499",
    period: "/month",
    requests: "Unlimited requests",
    description: "For large-scale operations",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "On-premise deployment",
      "SLA guarantees",
    ],
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Scale as you grow. No hidden fees.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={`relative h-full ${
                  plan.highlight ? "border-foreground/20" : ""
                }`}
              >
                {plan.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-semibold tracking-tight text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.requests}</p>
                </CardHeader>
                <CardContent>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlight ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/register">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
