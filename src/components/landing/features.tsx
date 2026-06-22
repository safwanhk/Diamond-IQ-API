"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, Shield, Code, BarChart3, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Instant Valuation",
    description: "Sub-100ms market price estimates powered by our proprietary pricing engine trained on millions of transactions.",
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence",
    description: "Confidence scores, price ranges, trend analysis, and investment scoring for every valuation request.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "API key authentication, rate limiting, request logging, and SOC 2 compliance readiness built-in.",
  },
  {
    icon: Code,
    title: "Developer First",
    description: "RESTful API with OpenAPI docs, SDK examples, webhooks, and an interactive playground.",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description: "Real-time dashboards with request metrics, revenue tracking, and diamond search patterns.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Pricing data across GIA, IGI, and AGS certified diamonds with multi-currency support.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything you need to price diamonds at scale
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Financial-grade infrastructure built for jewelry retailers, marketplaces, and insurers.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="group h-full transition-colors duration-150">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted transition-colors duration-150 group-hover:border-muted-foreground/30">
                    <feature.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
