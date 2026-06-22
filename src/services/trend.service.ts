import type { DiamondClarity, DiamondColor, Trend } from "@prisma/client";
import { valuationRepository } from "@/repositories/valuation.repository";

const COLOR_MULTIPLIERS: Record<DiamondColor, number> = {
  D: 1.35, E: 1.28, F: 1.22, G: 1.15, H: 1.08,
  I: 1.0, J: 0.92, K: 0.85, L: 0.78, M: 0.72,
};

const CLARITY_MULTIPLIERS: Record<DiamondClarity, number> = {
  FL: 1.5, IF: 1.4, VVS1: 1.3, VVS2: 1.22, VS1: 1.15,
  VS2: 1.08, SI1: 1.0, SI2: 0.92, I1: 0.82, I2: 0.72, I3: 0.62,
};

export class TrendService {
  /** Per-spec trend based on color/clarity quality score */
  calculateSpecTrend(color: DiamondColor, clarity: DiamondClarity): Trend {
    const score =
      (COLOR_MULTIPLIERS[color] || 1) * (CLARITY_MULTIPLIERS[clarity] || 1);
    if (score >= 1.4) return "UP";
    if (score <= 0.9) return "DOWN";
    return "STABLE";
  }

  /** Market-wide trend from historical valuations */
  async getMarketTrends(periodDays = 30) {
    const data = await valuationRepository.getTrends();
    return {
      period: data.period,
      sentiment: data.marketSentiment,
      totalValuations: data.totalValuations,
      averagePrice: data.averagePrice,
      distribution: data.trends,
      periodDays,
    };
  }

  trendLabel(trend: Trend): string {
    const labels: Record<Trend, string> = {
      UP: "Trending Up",
      DOWN: "Trending Down",
      STABLE: "Stable",
    };
    return labels[trend];
  }
}

export const trendService = new TrendService();
