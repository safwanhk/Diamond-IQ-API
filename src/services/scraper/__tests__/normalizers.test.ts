import { describe, it, expect } from "vitest";
import {
  normalizeColor,
  normalizeClarity,
  normalizeCut,
  normalizeCertificate,
  parsePrice,
} from "@/services/scraper/normalizers";

describe("scraper normalizers", () => {
  it("normalizes color grades", () => {
    expect(normalizeColor("d")).toBe("D");
    expect(normalizeColor("invalid")).toBeNull();
  });

  it("normalizes clarity grades", () => {
    expect(normalizeClarity("vvs1")).toBe("VVS1");
    expect(normalizeClarity("VS 1")).toBe("VS1");
    expect(normalizeClarity("invalid")).toBeNull();
  });

  it("normalizes cut grades", () => {
    expect(normalizeCut("Ideal")).toBe("EXCELLENT");
    expect(normalizeCut("Very Good")).toBe("VERY_GOOD");
  });

  it("normalizes certificates", () => {
    expect(normalizeCertificate("GIA")).toBe("GIA");
    expect(normalizeCertificate("")).toBe("NONE");
  });

  it("parses price strings", () => {
    expect(parsePrice("$12,450")).toBe(12450);
    expect(parsePrice(5000)).toBe(5000);
  });
});
