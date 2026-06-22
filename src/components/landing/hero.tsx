"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const liveResponse = {
  estimatedPrice: 12500,
  lowPrice: 11800,
  highPrice: 13200,
  confidence: 94,
  trend: "UP",
};

export function HeroSection() {
  const [price, setPrice] = useState(0);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const target = liveResponse.estimatedPrice;
    const duration = 1500;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setPrice(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => requestAnimationFrame(tick), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTyping((t) => !t), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="absolute inset-0 grid-bg" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="mr-1.5 h-3 w-3" />
              Trusted by 500+ jewelry businesses
            </Badge>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Get Real-Time Diamond Valuations Through{" "}
              <span className="text-muted-foreground">One API</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Power your jewelry store, marketplace, or e-commerce platform with
              institutional-grade diamond pricing, confidence scores, and market trends.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Start Free Trial <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">View API Docs</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" /> SOC 2 Ready
              </span>
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> 99.9% Uptime
              </span>
              <span>&lt;100ms response</span>
            </div>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-lg border border-border bg-card p-1">
              <div className="rounded-md bg-background p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 font-mono text-xs text-muted-foreground">api.diamondiq.com</span>
                </div>
                <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-foreground/80 sm:text-sm">
                  <span className="text-muted-foreground">POST</span>{" "}
                  <span className="text-accent">/api/v1/valuation</span>
                  {"\n\n"}
                  <span className="text-foreground/60">{"{"}</span>
                  {"\n  "}
                  <span className="text-accent">&quot;carat&quot;</span>:{" "}
                  <span className="text-foreground">1.2</span>,
                  {"\n  "}
                  <span className="text-accent">&quot;color&quot;</span>:{" "}
                  <span className="text-foreground">&quot;D&quot;</span>,
                  {"\n  "}
                  <span className="text-accent">&quot;clarity&quot;</span>:{" "}
                  <span className="text-foreground">&quot;VVS1&quot;</span>
                  {typing ? "|" : ""}
                  {"\n"}
                  <span className="text-foreground/60">{"}"}</span>
                </pre>
              </div>
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-4 rounded-lg border border-border bg-card p-4 sm:-left-8"
            >
              <p className="text-xs text-muted-foreground">Live Valuation</p>
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                ${price.toLocaleString()}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="success" className="text-[10px]">
                  {liveResponse.confidence}% confidence
                </Badge>
                <span className="text-xs text-success">↑ Trending up</span>
              </div>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -right-2 -top-4 rounded-lg border border-border bg-card p-3 sm:-right-6"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
                <span className="text-xs text-muted-foreground">API Online</span>
              </div>
              <p className="mt-1 text-lg font-semibold text-foreground">47ms</p>
              <p className="text-[10px] text-muted-foreground">avg response</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
