"use client";

import { motion } from "framer-motion";

const brands = [
  "Tiffany & Co.",
  "Blue Nile",
  "James Allen",
  "Brilliant Earth",
  "Ritani",
  "VRAI",
];

export function TrustedBySection() {
  return (
    <section className="border-y border-border py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground"
        >
          Trusted by Jewelry Businesses
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {brands.map((brand, i) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {brand}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
