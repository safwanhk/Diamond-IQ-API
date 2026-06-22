import type { WatchInput, AssetValuationResult } from "@/types/assets";

const BRAND_BASE: Record<WatchInput["brand"], number> = {
  Rolex: 12000,
  "Patek Philippe": 45000,
  "Audemars Piguet": 28000,
  Omega: 4500,
  Cartier: 8000,
  "Richard Mille": 120000,
  Other: 3000,
};

const CONDITION_MULT: Record<WatchInput["condition"], number> = {
  New: 1.15,
  Excellent: 1.05,
  "Very Good": 0.95,
  Good: 0.82,
  Fair: 0.68,
};

const BRAND_DEMAND: Record<WatchInput["brand"], number> = {
  Rolex: 98,
  "Patek Philippe": 95,
  "Audemars Piguet": 93,
  Omega: 82,
  Cartier: 85,
  "Richard Mille": 88,
  Other: 60,
};

const BRAND_LIQUIDITY: Record<WatchInput["brand"], number> = {
  Rolex: 97,
  "Patek Philippe": 85,
  "Audemars Piguet": 88,
  Omega: 90,
  Cartier: 86,
  "Richard Mille": 72,
  Other: 55,
};

export class WatchValuationService {
  evaluate(input: WatchInput): AssetValuationResult {
    const base = BRAND_BASE[input.brand];
    const conditionMult = CONDITION_MULT[input.condition];

    let ageMult = 1.0;
    if (input.year) {
      const age = new Date().getFullYear() - input.year;
      if (age > 30) ageMult = 0.85;
      else if (age > 15) ageMult = 0.92;
      else if (age < 3) ageMult = 1.08;
    }

    const papersMult = input.boxAndPapers ? 1.12 : 0.94;
    const modelPremium = input.model.length > 3 ? 1.05 : 1.0;

    const estimatedValue = Math.round(
      base * conditionMult * ageMult * papersMult * modelPremium
    );
    const resaleValue = Math.round(estimatedValue * (input.boxAndPapers ? 0.88 : 0.78));

    const variance = estimatedValue * 0.08;
    const lowPrice = Math.round(resaleValue - variance * 0.5);
    const highPrice = Math.round(estimatedValue + variance);

    let confidence = 72;
    if (input.referenceNumber) confidence += 10;
    if (input.boxAndPapers) confidence += 8;
    if (input.year) confidence += 5;
    if (input.brand === "Rolex" || input.brand === "Omega") confidence += 5;
    confidence = Math.min(99, confidence);

    const investmentScore = Math.min(
      99,
      Math.round(
        40 +
          BRAND_DEMAND[input.brand] * 0.35 +
          (input.boxAndPapers ? 12 : 0) +
          (input.condition === "New" || input.condition === "Excellent" ? 10 : 0)
      )
    );

    const marketDemandScore = BRAND_DEMAND[input.brand];
    const liquidityScore = BRAND_LIQUIDITY[input.brand];

    const trend =
      investmentScore >= 80 ? "UP" : investmentScore <= 55 ? "DOWN" : "STABLE";

    return {
      estimatedValue,
      resaleValue,
      lowPrice,
      highPrice,
      confidence,
      trend,
      investmentScore,
      marketDemandScore,
      liquidityScore,
    };
  }

  toPrismaEnums(input: WatchInput) {
    const brandMap = {
      Rolex: "ROLEX" as const,
      "Patek Philippe": "PATEK_PHILIPPE" as const,
      "Audemars Piguet": "AUDEMARS_PIGUET" as const,
      Omega: "OMEGA" as const,
      Cartier: "CARTIER" as const,
      "Richard Mille": "RICHARD_MILLE" as const,
      Other: "OTHER" as const,
    };
    const conditionMap = {
      New: "NEW" as const,
      Excellent: "EXCELLENT" as const,
      "Very Good": "VERY_GOOD" as const,
      Good: "GOOD" as const,
      Fair: "FAIR" as const,
    };
    return {
      brand: brandMap[input.brand],
      condition: conditionMap[input.condition],
    };
  }
}

export const watchValuationService = new WatchValuationService();
