"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, Shield, Code, BarChart3, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Instant Valuation",
    description: "Sub-100ms market price estimates powered by our proprietary pricing engine trained on millions of transactions.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence",
    description: "Confidence scores, price ranges, trend analysis, and investment scoring for every valuation request.",
    gradient: "from-cyan-500/20 to-teal-500/20",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "API key authentication, rate limiting, request logging, and SOC 2 compliance readiness built-in.",
    gradient: "from-emerald-500/20 to-green-500/20",
  },
  {
    icon: Code,
    title: "Developer First",
    description: "RESTful API with OpenAPI docs, SDK examples, webhooks, and an interactive playground.",
    gradient: "from-violet-500/20 to-purple-500/20",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description: "Real-time dashboards with request metrics, revenue tracking, and diamond search patterns.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Pricing data across GIA, IGI, and AGS certified diamonds with multi-currency support.",
    gradient: "from-rose-500/20 to-pink-500/20",
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
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to price diamonds at scale
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Financial-grade infrastructure built for jewelry retailers, marketplaces, and insurers.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="group h-full border-white/10 bg-[#111827]/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <div
                    className={`mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {feature.description}
                  </CardDescription>
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
