"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-[#111827] to-accent/10 px-8 py-16 text-center sm:px-16"
        >
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/20 blur-[80px]" />

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to power your platform with live diamond pricing?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
              Join 500+ jewelry businesses using DiamondIQ. Start with 100 free API calls — no credit card required.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="accent" asChild>
                <Link href="/register">
                  Get Your API Key <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5"
                asChild
              >
                <Link href="/docs">Read the Docs</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
