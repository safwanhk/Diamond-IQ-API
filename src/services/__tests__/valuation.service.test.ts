import { describe, it, expect } from "vitest";
import { valuationService } from "@/services/valuation.service";
import { trendService } from "@/services/trend.service";

describe("ValuationService", () => {
  const baseInput = {
    carat: 1.2,
    color: "D" as const,
    clarity: "VVS1" as const,
    cut: "Excellent" as const,
    certificate: "GIA" as const,
  };

  it("returns all required output fields", () => {
    const result = valuationService.evaluate(baseInput);
    expect(result).toHaveProperty("estimatedPrice");
    expect(result).toHaveProperty("lowPrice");
    expect(result).toHaveProperty("highPrice");
    expect(result).toHaveProperty("confidence");
    expect(result).toHaveProperty("trend");
    expect(typeof result.estimatedPrice).toBe("number");
    expect(result.lowPrice).toBeLessThan(result.estimatedPrice);
    expect(result.highPrice).toBeGreaterThan(result.estimatedPrice);
  });

  it("applies carat multiplier — larger stones cost more per carat", () => {
    const small = valuationService.evaluate({ ...baseInput, carat: 0.5 });
    const large = valuationService.evaluate({ ...baseInput, carat: 2.0 });
    expect(large.estimatedPrice / 2.0).toBeGreaterThan(small.estimatedPrice / 0.5);
  });

  it("applies color multiplier — D color is more valuable than M", () => {
    const premium = valuationService.evaluate({ ...baseInput, color: "D" });
    const budget = valuationService.evaluate({ ...baseInput, color: "M" });
    expect(premium.estimatedPrice).toBeGreaterThan(budget.estimatedPrice);
  });

  it("applies clarity multiplier — FL is more valuable than I3", () => {
    const premium = valuationService.evaluate({ ...baseInput, clarity: "FL" });
    const budget = valuationService.evaluate({ ...baseInput, clarity: "I3" });
    expect(premium.estimatedPrice).toBeGreaterThan(budget.estimatedPrice);
  });

  it("applies cut multiplier — Excellent beats Poor", () => {
    const excellent = valuationService.evaluate({ ...baseInput, cut: "Excellent" });
    const poor = valuationService.evaluate({ ...baseInput, cut: "Poor" });
    expect(excellent.estimatedPrice).toBeGreaterThan(poor.estimatedPrice);
  });

  it("applies certificate multiplier — GIA beats None", () => {
    const gia = valuationService.evaluate({ ...baseInput, certificate: "GIA" });
    const none = valuationService.evaluate({ ...baseInput, certificate: "None" });
    expect(gia.estimatedPrice).toBeGreaterThan(none.estimatedPrice);
  });

  it("confidence is between 50 and 99", () => {
    const result = valuationService.evaluate(baseInput);
    expect(result.confidence).toBeGreaterThanOrEqual(50);
    expect(result.confidence).toBeLessThanOrEqual(99);
  });
});

describe("TrendService", () => {
  it("returns UP for premium specs", () => {
    expect(trendService.calculateSpecTrend("D", "FL")).toBe("UP");
  });

  it("returns DOWN for lower specs", () => {
    expect(trendService.calculateSpecTrend("M", "I3")).toBe("DOWN");
  });

  it("returns STABLE for mid-range specs", () => {
    expect(trendService.calculateSpecTrend("I", "SI1")).toBe("STABLE");
  });

  it("provides human-readable trend labels", () => {
    expect(trendService.trendLabel("UP")).toBe("Trending Up");
    expect(trendService.trendLabel("DOWN")).toBe("Trending Down");
    expect(trendService.trendLabel("STABLE")).toBe("Stable");
  });
});
