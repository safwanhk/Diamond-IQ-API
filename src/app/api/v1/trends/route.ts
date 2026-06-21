import { NextRequest } from "next/server";
import {
  authenticateApiRequest,
  jsonResponse,
  logRequest,
} from "@/lib/api-middleware";
import { valuationRepository } from "@/repositories/valuation.repository";

export async function GET(request: NextRequest) {
  const auth = await authenticateApiRequest(request);
  if ("error" in auth) return auth.error;

  const trends = await valuationRepository.getTrends();
  await logRequest(auth.context, "/api/v1/trends", 200);
  return jsonResponse(trends);
}
