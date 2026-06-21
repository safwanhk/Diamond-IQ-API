"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const requestBody = `{
  "carat": 1.2,
  "color": "D",
  "clarity": "VVS1",
  "cut": "Excellent",
  "certificate": "GIA"
}`;

const responseBody = `{
  "estimatedPrice": 12500,
  "lowPrice": 11800,
  "highPrice": 13200,
  "confidence": 94,
  "trend": "UP",
  "investmentScore": 88,
  "currency": "USD"
}`;

export function ApiExampleSection() {
  const [running, setRunning] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  function runDemo() {
    setRunning(true);
    setShowResponse(false);
    setTimeout(() => {
      setRunning(false);
      setShowResponse(true);
    }, 1200);
  }

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="accent" className="mb-4 border-accent/20 bg-accent/10 text-accent">
              Interactive Demo
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              One endpoint. Complete valuation data.
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Send diamond specifications and receive institutional-grade pricing in milliseconds.
              Try the live demo or explore our interactive playground.
            </p>
            <ul className="mt-6 space-y-3">
              {["RESTful JSON API", "OpenAPI 3.0 specification", "Webhook notifications", "Batch valuation support"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="h-4 w-4 text-success" />
                    {item}
                  </li>
                )
              )}
            </ul>
            <Button
              className="mt-8"
              variant="accent"
              onClick={runDemo}
              disabled={running}
            >
              <Play className="mr-2 h-4 w-4" />
              {running ? "Running..." : "Run Live Demo"}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden">
              <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
                <Badge variant="secondary" className="text-[10px]">REQUEST</Badge>
                <span className="text-xs text-slate-500">POST /api/v1/valuation</span>
              </div>
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
                {requestBody}
              </pre>
            </div>

            <motion.div
              animate={{ opacity: showResponse ? 1 : 0.4 }}
              className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-[10px]">200 OK</Badge>
                  <span className="text-xs text-slate-500">47ms</span>
                </div>
                {showResponse && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xs text-success"
                  >
                    ✓ Success
                  </motion.span>
                )}
              </div>
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-emerald-400 sm:text-sm">
                {showResponse ? responseBody : "// Click 'Run Live Demo' to see response"}
              </pre>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
