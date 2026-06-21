"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "DiamondIQ transformed how we price inventory. What used to take our gemologists hours now happens in milliseconds.",
    author: "Sarah Chen",
    role: "CTO, LuxeGems Marketplace",
    rating: 5,
  },
  {
    quote:
      "The confidence scores and price ranges give our customers the transparency they expect. API integration took less than a day.",
    author: "Marcus Williams",
    role: "Head of Product, RingCraft",
    rating: 5,
  },
  {
    quote:
      "We evaluated five valuation APIs. DiamondIQ was the only one with financial-grade accuracy and enterprise SLAs.",
    author: "Elena Rodriguez",
    role: "VP Engineering, DiamondDirect",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Loved by industry leaders
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            See why jewelry businesses trust DiamondIQ for their pricing infrastructure.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-white/10 bg-[#111827]/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 border-t border-white/5 pt-4">
                    <p className="font-medium text-white">{t.author}</p>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
