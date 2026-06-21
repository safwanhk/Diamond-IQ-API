"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How accurate are DiamondIQ valuations?",
    a: "Our pricing engine is trained on millions of real transactions and achieves 94%+ confidence scores on GIA-certified diamonds. Each valuation includes a price range and confidence metric.",
  },
  {
    q: "What diamond specifications do you support?",
    a: "We support carat weight, color (D-Z), clarity (FL-I3), cut grade, polish, symmetry, fluorescence, and certificate type (GIA, IGI, AGS, HRD).",
  },
  {
    q: "How fast is the API?",
    a: "Average response time is under 100ms globally. Our infrastructure is deployed across multiple regions with 99.9% uptime SLA on Professional and Enterprise plans.",
  },
  {
    q: "Can I try before I buy?",
    a: "Yes. Every account includes 100 free API requests per month. No credit card required to start.",
  },
  {
    q: "Do you offer custom enterprise plans?",
    a: "Absolutely. Enterprise plans include dedicated support, custom rate limits, on-premise deployment options, and SLA guarantees. Contact our sales team for a custom quote.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-white/5 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frequently asked questions
          </h2>
        </motion.div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-white/10 bg-[#111827]/50 overflow-hidden"
            >
              <button
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-white">{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="border-t border-white/5 px-5 py-4 text-sm text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
