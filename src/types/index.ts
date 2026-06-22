import { z } from "zod";

export * from "./assets";

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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

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
