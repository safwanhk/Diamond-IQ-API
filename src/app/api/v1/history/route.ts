import { NextRequest } from "next/server";
import {
  authenticateApiRequest,
  jsonResponse,
  logRequest,
} from "@/lib/api-middleware";
import { valuationRepository } from "@/repositories/valuation.repository";
import { goldRepository } from "@/repositories/gold.repository";
import { watchRepository } from "@/repositories/watch.repository";

export async function GET(request: NextRequest) {
  const auth = await authenticateApiRequest(request);
  if ("error" in auth) return auth.error;

  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "20"), 100);
  const assetType = request.nextUrl.searchParams.get("assetType");

  const userId = auth.context.user.id;

  if (assetType === "gold") {
    const data = await goldRepository.findByUserId(userId, limit);
    await logRequest(auth.context, "/api/v1/history", 200);
    return jsonResponse({ assetType: "gold", data, count: data.length });
  }

  if (assetType === "watch") {
    const data = await watchRepository.findByUserId(userId, limit);
    await logRequest(auth.context, "/api/v1/history", 200);
    return jsonResponse({ assetType: "watch", data, count: data.length });
  }

  if (assetType === "diamond") {
    const data = await valuationRepository.findByUserId(userId, limit);
    await logRequest(auth.context, "/api/v1/history", 200);
    return jsonResponse({ assetType: "diamond", data, count: data.length });
  }

  const [diamonds, gold, watches] = await Promise.all([
    valuationRepository.findByUserId(userId, limit),
    goldRepository.findByUserId(userId, limit),
    watchRepository.findByUserId(userId, limit),
  ]);

  await logRequest(auth.context, "/api/v1/history", 200);
  return jsonResponse({
    diamonds: { data: diamonds, count: diamonds.length },
    gold: { data: gold, count: gold.length },
    watches: { data: watches, count: watches.length },
  });
}
