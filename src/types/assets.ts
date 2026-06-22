import { z } from "zod";

// ─── Diamonds ───────────────────────────────────────────────
export const DIAMOND_COLORS = [
  "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
] as const;

export const DIAMOND_CLARITIES = [
  "FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3",
] as const;

export const DIAMOND_CUTS = [
  "Excellent", "Very Good", "Good", "Fair", "Poor",
] as const;

export const CERTIFICATES = ["GIA", "IGI", "HRD", "None"] as const;

export const diamondInputSchema = z.object({
  carat: z.number().min(0.1).max(20),
  color: z.enum(DIAMOND_COLORS),
  clarity: z.enum(DIAMOND_CLARITIES),
  cut: z.enum(DIAMOND_CUTS),
  certificate: z.enum(CERTIFICATES),
});

// ─── Gold ───────────────────────────────────────────────────
export const GOLD_PURITIES = ["24K", "22K", "18K", "14K", "10K"] as const;
export const GOLD_UNITS = ["gram", "ounce", "kilogram"] as const;

export const goldInputSchema = z.object({
  weight: z.number().min(0.01).max(10000),
  purity: z.enum(GOLD_PURITIES),
  unit: z.enum(GOLD_UNITS),
});

// ─── Watches ────────────────────────────────────────────────
export const WATCH_BRANDS = [
  "Rolex",
  "Patek Philippe",
  "Audemars Piguet",
  "Omega",
  "Cartier",
  "Richard Mille",
  "Other",
] as const;

export const WATCH_CONDITIONS = [
  "New",
  "Excellent",
  "Very Good",
  "Good",
  "Fair",
] as const;

export const watchInputSchema = z.object({
  brand: z.enum(WATCH_BRANDS),
  model: z.string().min(1).max(120),
  referenceNumber: z.string().max(60).optional(),
  condition: z.enum(WATCH_CONDITIONS),
  year: z.number().int().min(1900).max(2030).optional(),
  boxAndPapers: z.boolean().default(false),
});

// Backward compat alias
export const valuationInputSchema = diamondInputSchema;

export type DiamondInput = z.infer<typeof diamondInputSchema>;
export type GoldInput = z.infer<typeof goldInputSchema>;
export type WatchInput = z.infer<typeof watchInputSchema>;
export type ValuationInput = DiamondInput;

export interface AssetValuationResult {
  estimatedValue: number;
  lowPrice: number;
  highPrice: number;
  confidence: number;
  trend: "UP" | "DOWN" | "STABLE";
  investmentScore: number;
  marketDemandScore: number;
  liquidityScore: number;
  spotValue?: number;
  retailValue?: number;
  resaleValue?: number;
}

/** @deprecated use AssetValuationResult */
export interface ValuationResult {
  estimatedPrice: number;
  lowPrice: number;
  highPrice: number;
  confidence: number;
  trend: "UP" | "DOWN" | "STABLE";
  investmentScore: number;
  marketDemandScore?: number;
  liquidityScore?: number;
}

export function toLegacyDiamondResult(r: AssetValuationResult): ValuationResult {
  return {
    estimatedPrice: r.estimatedValue,
    lowPrice: r.lowPrice,
    highPrice: r.highPrice,
    confidence: r.confidence,
    trend: r.trend,
    investmentScore: r.investmentScore,
    marketDemandScore: r.marketDemandScore,
    liquidityScore: r.liquidityScore,
  };
}
