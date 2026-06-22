"use client";

import { motion } from "framer-motion";
import { Key, Send, LineChart } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Key,
    title: "Get Your API Key",
    description: "Sign up in seconds and generate your production-ready API key from the dashboard.",
  },
  {
    step: "02",
    icon: Send,
    title: "Send Diamond Specs",
    description: "POST carat, color, clarity, cut, and certificate to our valuation endpoint.",
  },
  {
    step: "03",
    icon: LineChart,
    title: "Receive Live Pricing",
    description: "Get instant market value, confidence scores, price ranges, and trend data.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three steps from signup to live valuations in your application.
          </p>
        </motion.div>

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-16 hidden h-px bg-border lg:block" />
          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-card">
                  <step.icon className="h-6 w-6 text-foreground" />
                </div>
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Step {step.step}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
