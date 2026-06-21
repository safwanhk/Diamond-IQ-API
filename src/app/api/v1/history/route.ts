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

  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
  const history = await valuationRepository.findByUserId(
    auth.context.user.id,
    Math.min(limit, 100)
  );

  await logRequest(auth.context, "/api/v1/history", 200);
  return jsonResponse({ data: history, count: history.length });
}
