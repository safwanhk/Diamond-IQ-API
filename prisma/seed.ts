import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin", 12);
  const customerPassword = await bcrypt.hash("customer123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {
      password: adminPassword,
      name: "admin",
      role: "ADMIN",
      plan: "ENTERPRISE",
    },
    create: {
      name: "admin",
      email: "admin@admin.com",
      password: adminPassword,
      role: "ADMIN",
      plan: "ENTERPRISE",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "demo@diamondiq.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "demo@diamondiq.com",
      password: customerPassword,
      role: "CUSTOMER",
      plan: "STARTER",
    },
  });

  const apiKey = await prisma.apiKey.upsert({
    where: { key: "diq_demo_key_for_testing_purposes_only" },
    update: {},
    create: {
      key: "diq_demo_key_for_testing_purposes_only",
      name: "Demo Key",
      userId: customer.id,
      active: true,
    },
  });

  const pricingRules = [
    { name: "Color D", category: "color", key: "D", multiplier: 1.35 },
    { name: "Color E", category: "color", key: "E", multiplier: 1.28 },
    { name: "Clarity FL", category: "clarity", key: "FL", multiplier: 1.5 },
    { name: "Cut Excellent", category: "cut", key: "EXCELLENT", multiplier: 1.15 },
    { name: "Certificate GIA", category: "certificate", key: "GIA", multiplier: 1.08 },
  ];

  for (const rule of pricingRules) {
    await prisma.pricingRule.upsert({
      where: { category_key: { category: rule.category, key: rule.key } },
      update: { multiplier: rule.multiplier },
      create: rule,
    });
  }

  const valuationCount = await prisma.diamondValuation.count({
    where: { userId: customer.id },
  });

  if (valuationCount === 0) {
    const samples = [
      { carat: 1.2, color: "D" as const, clarity: "VVS1" as const, cut: "EXCELLENT" as const, certificate: "GIA" as const, estimatedPrice: 12500, lowPrice: 11800, highPrice: 13200, confidence: 94, trend: "UP" as const, investmentScore: 88 },
      { carat: 0.75, color: "G" as const, clarity: "VS2" as const, cut: "VERY_GOOD" as const, certificate: "IGI" as const, estimatedPrice: 4200, lowPrice: 3900, highPrice: 4500, confidence: 82, trend: "STABLE" as const, investmentScore: 65 },
      { carat: 2.0, color: "E" as const, clarity: "IF" as const, cut: "EXCELLENT" as const, certificate: "GIA" as const, estimatedPrice: 35000, lowPrice: 33000, highPrice: 37000, confidence: 96, trend: "UP" as const, investmentScore: 92 },
    ];

    for (const sample of samples) {
      await prisma.diamondValuation.create({
        data: { ...sample, userId: customer.id },
      });
    }
  }

  console.log("Seed complete!");
  console.log("Admin login — email: admin (or admin@admin.com) / password: admin");
  console.log("Customer: demo@diamondiq.com / customer123!");
  console.log("API Key:", apiKey.key);

  // Seed market listings if empty
  const listingCount = await prisma.diamondListing.count();
  if (listingCount === 0) {
    const { scraperService } = await import("../src/services/scraper/scraper.service");
    const result = await scraperService.runAll();
    console.log(`Market seed: ${result.totalSaved} listings from ${result.sources.join(", ")}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
