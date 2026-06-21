import Stripe from "stripe";
import { Plan } from "@prisma/client";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeClient = new Stripe(key, {
      apiVersion: "2025-08-27.basil",
      typescript: true,
    });
  }
  return stripeClient;
}

export const STRIPE_PRICE_IDS: Record<Exclude<Plan, "FREE">, string> = {
  STARTER: process.env.STRIPE_STARTER_PRICE_ID || "",
  PRO: process.env.STRIPE_PRO_PRICE_ID || "",
  ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID || "",
};

export function planFromPriceId(priceId: string): Plan | null {
  if (priceId === STRIPE_PRICE_IDS.STARTER) return "STARTER";
  if (priceId === STRIPE_PRICE_IDS.PRO) return "PRO";
  if (priceId === STRIPE_PRICE_IDS.ENTERPRISE) return "ENTERPRISE";
  return null;
}
