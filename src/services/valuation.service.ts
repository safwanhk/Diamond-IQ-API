import type {
  Certificate,
  DiamondClarity,
  DiamondColor,
  DiamondCut,
} from "@prisma/client";
import type { ValuationInput, ValuationResult } from "@/types";
import { trendService } from "@/services/trend.service";

const BASE_PRICE_PER_CARAT = 5000;

const COLOR_MULTIPLIERS: Record<DiamondColor, number> = {
  D: 1.35,
  E: 1.28,
  F: 1.22,
  G: 1.15,
  H: 1.08,
  I: 1.0,
  J: 0.92,
  K: 0.85,
  L: 0.78,
  M: 0.72,
};

const CLARITY_MULTIPLIERS: Record<DiamondClarity, number> = {
  FL: 1.5,
  IF: 1.4,
  VVS1: 1.3,
  VVS2: 1.22,
  VS1: 1.15,
  VS2: 1.08,
  SI1: 1.0,
  SI2: 0.92,
  I1: 0.82,
  I2: 0.72,
  I3: 0.62,
};

const CUT_MULTIPLIERS: Record<string, number> = {
  Excellent: 1.15,
  "Very Good": 1.08,
  Good: 1.0,
  Fair: 0.9,
  Poor: 0.78,
};

const CERTIFICATE_MULTIPLIERS: Record<Certificate, number> = {
  GIA: 1.08,
  IGI: 1.03,
  HRD: 1.05,
  NONE: 0.95,
};

function getCaratMultiplier(carat: number): number {
  if (carat < 0.5) return 0.85;
  if (carat < 1.0) return 1.0;
  if (carat < 1.5) return 1.15;
  if (carat < 2.0) return 1.35;
  if (carat < 3.0) return 1.6;
  if (carat < 5.0) return 2.0;
  return 2.5 + (carat - 5) * 0.15;
}

function normalizeCut(cut: string): DiamondCut {
  const map: Record<string, DiamondCut> = {
    Excellent: "EXCELLENT",
    "Very Good": "VERY_GOOD",
    Good: "GOOD",
    Fair: "FAIR",
    Poor: "POOR",
  };
  return map[cut] || "GOOD";
}

function normalizeCertificate(cert: string): Certificate {
  if (cert === "None") return "NONE";
  return cert as Certificate;
}

function calculateConfidence(input: ValuationInput): number {
  let confidence = 70;

  if (input.certificate === "GIA") confidence += 15;
  else if (input.certificate === "HRD") confidence += 12;
  else if (input.certificate === "IGI") confidence += 10;
  else confidence -= 10;

  if (input.carat >= 0.3 && input.carat <= 5) confidence += 8;
  if (["D", "E", "F", "G"].includes(input.color)) confidence += 5;
  if (["FL", "IF", "VVS1", "VVS2"].includes(input.clarity)) confidence += 5;
  if (input.cut === "Excellent") confidence += 5;

  return Math.min(99, Math.max(50, confidence));
}

function calculateTrend(input: ValuationInput) {
  return trendService.calculateSpecTrend(
    input.color as DiamondColor,
    input.clarity as DiamondClarity
  );
}

function calculateInvestmentScore(
  input: ValuationInput,
  estimatedPrice: number
): number {
  let score = 50;

  if (input.carat >= 1 && input.carat <= 3) score += 15;
  if (["D", "E", "F"].includes(input.color)) score += 12;
  if (["FL", "IF", "VVS1", "VVS2"].includes(input.clarity)) score += 10;
  if (input.cut === "Excellent") score += 8;
  if (input.certificate === "GIA") score += 10;
  if (estimatedPrice >= 10000) score += 5;

  return Math.min(99, Math.max(20, score));
}

function calculateMarketDemand(input: ValuationInput): number {
  let score = 65;
  if (["D", "E", "F"].includes(input.color)) score += 15;
  if (input.carat >= 1 && input.carat <= 2) score += 12;
  if (input.certificate === "GIA") score += 8;
  return Math.min(99, score);
}

function calculateLiquidity(input: ValuationInput): number {
  let score = 70;
  if (input.carat >= 0.5 && input.carat <= 3) score += 15;
  if (["VS1", "VS2", "SI1", "VVS1", "VVS2"].includes(input.clarity)) score += 10;
  if (input.cut === "Excellent") score += 5;
  return Math.min(99, score);
}

export class ValuationService {
  evaluate(input: ValuationInput): ValuationResult {
    const caratMultiplier = getCaratMultiplier(input.carat);
    const colorMultiplier = COLOR_MULTIPLIERS[input.color as DiamondColor];
    const clarityMultiplier =
      CLARITY_MULTIPLIERS[input.clarity as DiamondClarity];
    const cutMultiplier = CUT_MULTIPLIERS[input.cut] || 1.0;
    const certMultiplier =
      CERTIFICATE_MULTIPLIERS[normalizeCertificate(input.certificate)];

    const baseValue = BASE_PRICE_PER_CARAT * input.carat;
    const estimatedPrice = Math.round(
      baseValue *
        caratMultiplier *
        colorMultiplier *
        clarityMultiplier *
        cutMultiplier *
        certMultiplier
    );

    const variance = estimatedPrice * 0.06;
    const lowPrice = Math.round(estimatedPrice - variance);
    const highPrice = Math.round(estimatedPrice + variance);

    const confidence = calculateConfidence(input);
    const trend = calculateTrend(input);
    const investmentScore = calculateInvestmentScore(input, estimatedPrice);
    const marketDemandScore = calculateMarketDemand(input);
    const liquidityScore = calculateLiquidity(input);

    return {
      estimatedPrice,
      lowPrice,
      highPrice,
      confidence,
      trend,
      investmentScore,
      marketDemandScore,
      liquidityScore,
    };
  }

  toAssetResult(result: ValuationResult): import("@/types/assets").AssetValuationResult {
    return {
      estimatedValue: result.estimatedPrice,
      lowPrice: result.lowPrice,
      highPrice: result.highPrice,
      confidence: result.confidence,
      trend: result.trend,
      investmentScore: result.investmentScore,
      marketDemandScore: result.marketDemandScore ?? 70,
      liquidityScore: result.liquidityScore ?? 75,
    };
  }

  toPrismaEnums(input: ValuationInput) {
    return {
      color: input.color as DiamondColor,
      clarity: input.clarity as DiamondClarity,
      cut: normalizeCut(input.cut),
      certificate: normalizeCertificate(input.certificate),
    };
  }
}

export const valuationService = new ValuationService();
