import { NextRequest } from "next/server";
import {
  authenticateApiRequest,
  errorResponse,
  jsonResponse,
  logRequest,
} from "@/lib/api-middleware";
import { valuationService } from "@/services/valuation.service";
import { valuationRepository } from "@/repositories/valuation.repository";
import { diamondInputSchema } from "@/types/assets";

export async function POST(request: NextRequest) {
  const auth = await authenticateApiRequest(request);
  if ("error" in auth) return auth.error;

  const endpoint = "/api/v1/diamonds/valuation";

  try {
    const body = await request.json();
    const parsed = diamondInputSchema.safeParse(body);

    if (!parsed.success) {
      await logRequest(auth.context, endpoint, 400);
      return errorResponse("Invalid input", "VALIDATION_ERROR", 400, parsed.error.flatten());
    }

    const result = valuationService.evaluate(parsed.data);
    const asset = valuationService.toAssetResult(result);
    const enums = valuationService.toPrismaEnums(parsed.data);

    await valuationRepository.create({
      userId: auth.context.user.id,
      carat: parsed.data.carat,
      ...enums,
      estimatedPrice: result.estimatedPrice,
      lowPrice: result.lowPrice,
      highPrice: result.highPrice,
      confidence: result.confidence,
      trend: result.trend,
      investmentScore: result.investmentScore,
      marketDemandScore: result.marketDemandScore ?? 70,
      liquidityScore: result.liquidityScore ?? 75,
    });

    await logRequest(auth.context, endpoint, 200);
    return jsonResponse({ assetType: "diamond", ...asset });
  } catch {
    await logRequest(auth.context, endpoint, 500);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
