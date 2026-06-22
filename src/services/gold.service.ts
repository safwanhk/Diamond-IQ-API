import type { GoldInput, AssetValuationResult } from "@/types/assets";

/** Spot price per troy ounce (USD) — update via market feed in production */
const GOLD_SPOT_PER_OZ = 2350;

const OZ_TO_GRAM = 31.1035;
const KG_TO_GRAM = 1000;

const PURITY_FACTORS: Record<GoldInput["purity"], number> = {
  "24K": 1.0,
  "22K": 0.917,
  "18K": 0.75,
  "14K": 0.585,
  "10K": 0.417,
};

function toGrams(weight: number, unit: GoldInput["unit"]): number {
  if (unit === "gram") return weight;
  if (unit === "ounce") return weight * OZ_TO_GRAM;
  return weight * KG_TO_GRAM;
}

export class GoldValuationService {
  evaluate(input: GoldInput): AssetValuationResult {
    const grams = toGrams(input.weight, input.unit);
    const purityFactor = PURITY_FACTORS[input.purity];
    const pricePerGram = (GOLD_SPOT_PER_OZ / OZ_TO_GRAM) * purityFactor;

    const spotValue = Math.round(grams * pricePerGram);
    const retailMarkup = input.purity === "24K" ? 1.18 : 1.25;
    const retailValue = Math.round(spotValue * retailMarkup);

    const variance = spotValue * 0.04;
    const lowPrice = Math.round(spotValue - variance);
    const highPrice = Math.round(retailValue + variance);

    let confidence = 88;
    if (input.unit === "gram") confidence += 5;
    if (input.purity === "24K" || input.purity === "22K") confidence += 4;
    confidence = Math.min(99, confidence);

    const investmentScore = Math.min(
      95,
      55 + (input.purity === "24K" ? 25 : input.purity === "22K" ? 18 : 10)
    );
    const marketDemandScore = input.purity === "24K" ? 92 : 78;
    const liquidityScore = 96;

    const trend =
      GOLD_SPOT_PER_OZ > 2300 ? "UP" : GOLD_SPOT_PER_OZ < 2200 ? "DOWN" : "STABLE";

    return {
      estimatedValue: retailValue,
      spotValue,
      retailValue,
      lowPrice,
      highPrice,
      confidence,
      trend,
      investmentScore,
      marketDemandScore,
      liquidityScore,
    };
  }

  toPrismaEnums(input: GoldInput) {
    const purityMap = {
      "24K": "K24" as const,
      "22K": "K22" as const,
      "18K": "K18" as const,
      "14K": "K14" as const,
      "10K": "K10" as const,
    };
    const unitMap = {
      gram: "GRAM" as const,
      ounce: "OUNCE" as const,
      kilogram: "KILOGRAM" as const,
    };
    return { purity: purityMap[input.purity], unit: unitMap[input.unit] };
  }
}

export const goldValuationService = new GoldValuationService();

// Watch service in same file would be long - separate file
