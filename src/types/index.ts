import { z } from "zod";

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

export const valuationInputSchema = z.object({
  carat: z.number().min(0.1).max(20),
  color: z.enum(DIAMOND_COLORS),
  clarity: z.enum(DIAMOND_CLARITIES),
  cut: z.enum(DIAMOND_CUTS),
  certificate: z.enum(CERTIFICATES),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export const createApiKeySchema = z.object({
  name: z.string().min(1).max(50).optional(),
});

export type ValuationInput = z.infer<typeof valuationInputSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface ValuationResult {
  estimatedPrice: number;
  lowPrice: number;
  highPrice: number;
  confidence: number;
  trend: "UP" | "DOWN" | "STABLE";
  investmentScore: number;
}

export interface ApiError {
  error: string;
  code: string;
  details?: unknown;
}

export interface UsageResponse {
  plan: string;
  limit: number;
  used: number;
  remaining: number;
  percentage: number;
  periodStart: string;
  periodEnd: string;
}
