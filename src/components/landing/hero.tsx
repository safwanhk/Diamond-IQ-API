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
      <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="accent" className="mb-6 border-accent/20 bg-accent/10 text-accent">
              <Sparkles className="mr-1.5 h-3 w-3" />
              Trusted by 500+ jewelry businesses
            </Badge>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Get Real-Time Diamond Valuations Through{" "}
              <span className="gradient-text">One API</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-400">
              Power your jewelry store, marketplace, or e-commerce platform with
              institutional-grade diamond pricing, confidence scores, and market trends.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" variant="accent" asChild>
                <Link href="/register">
                  Start Free Trial <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5" asChild>
                <Link href="/docs">View API Docs</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" /> SOC 2 Ready
              </span>
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" /> 99.9% Uptime
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
            <div className="glow-primary rounded-2xl border border-white/10 bg-[#111827]/80 p-1 backdrop-blur-xl">
              <div className="rounded-xl bg-[#0B1020] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-slate-500">api.diamondiq.com</span>
                </div>
                <pre className="overflow-x-auto text-xs leading-relaxed text-slate-300 sm:text-sm">
                  <span className="text-slate-500">POST</span>{" "}
                  <span className="text-accent">/api/v1/valuation</span>
                  {"\n\n"}
                  <span className="text-purple-400">{"{"}</span>
                  {"\n  "}
                  <span className="text-cyan-400">&quot;carat&quot;</span>:{" "}
                  <span className="text-amber-400">1.2</span>,
                  {"\n  "}
                  <span className="text-cyan-400">&quot;color&quot;</span>:{" "}
                  <span className="text-green-400">&quot;D&quot;</span>,
                  {"\n  "}
                  <span className="text-cyan-400">&quot;clarity&quot;</span>:{" "}
                  <span className="text-green-400">&quot;VVS1&quot;</span>
                  {typing ? "|" : ""}
                  {"\n"}
                  <span className="text-purple-400">{"}"}</span>
                </pre>
              </div>
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-4 rounded-xl border border-white/10 bg-[#111827] p-4 shadow-2xl sm:-left-8"
            >
              <p className="text-xs text-slate-500">Live Valuation</p>
              <p className="text-2xl font-bold text-white">
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
              className="absolute -right-2 -top-4 rounded-xl border border-white/10 bg-[#111827] p-3 shadow-xl sm:-right-6"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
                <span className="text-xs text-slate-400">API Online</span>
              </div>
              <p className="mt-1 text-lg font-semibold text-white">47ms</p>
              <p className="text-[10px] text-slate-500">avg response</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
