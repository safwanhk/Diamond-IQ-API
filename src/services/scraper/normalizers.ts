import type {
  Certificate,
  DiamondClarity,
  DiamondColor,
  DiamondCut,
} from "@prisma/client";
import type { RawListing } from "@/types/marketplace";

const COLORS = new Set<string>(["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"]);
const CLARITIES = new Set<string>([
  "FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3",
]);

const CUT_MAP: Record<string, DiamondCut> = {
  ideal: "EXCELLENT",
  excellent: "EXCELLENT",
  "very good": "VERY_GOOD",
  verygood: "VERY_GOOD",
  vg: "VERY_GOOD",
  good: "GOOD",
  fair: "FAIR",
  poor: "POOR",
  ex: "EXCELLENT",
};

const CERT_MAP: Record<string, Certificate> = {
  gia: "GIA",
  igi: "IGI",
  hrd: "HRD",
  ags: "GIA",
  none: "NONE",
  "": "NONE",
};

export function normalizeColor(value: string): DiamondColor | null {
  const c = value.trim().toUpperCase();
  return COLORS.has(c) ? (c as DiamondColor) : null;
}

export function normalizeClarity(value: string): DiamondClarity | null {
  const c = value.trim().toUpperCase().replace(/\s+/g, "");
  return CLARITIES.has(c) ? (c as DiamondClarity) : null;
}

export function normalizeCut(value: string): DiamondCut {
  const key = value.trim().toLowerCase();
  return CUT_MAP[key] ?? "GOOD";
}

export function normalizeCertificate(value: string): Certificate {
  const key = value.trim().toLowerCase();
  if (key.includes("gia")) return "GIA";
  if (key.includes("igi")) return "IGI";
  if (key.includes("hrd")) return "HRD";
  return CERT_MAP[key] ?? "NONE";
}

export function normalizeListing(raw: RawListing): RawListing | null {
  const color = normalizeColor(raw.color);
  const clarity = normalizeClarity(raw.clarity);
  if (!color || !clarity) return null;
  if (raw.carat <= 0 || raw.price <= 0) return null;

  return {
    ...raw,
    color,
    clarity,
    cut: normalizeCut(raw.cut),
    certificate: normalizeCertificate(raw.certificate),
  };
}

export function parsePrice(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return 0;
  const cleaned = value.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
}
