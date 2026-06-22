import { NextRequest } from "next/server";
import {
  authenticateApiRequest,
  errorResponse,
  jsonResponse,
  logRequest,
} from "@/lib/api-middleware";
import { goldValuationService } from "@/services/gold.service";
import { goldRepository } from "@/repositories/gold.repository";
import { goldInputSchema } from "@/types/assets";

export async function POST(request: NextRequest) {
  const auth = await authenticateApiRequest(request);
  if ("error" in auth) return auth.error;

  const endpoint = "/api/v1/gold/valuation";

  try {
    const body = await request.json();
    const parsed = goldInputSchema.safeParse(body);

    if (!parsed.success) {
      await logRequest(auth.context, endpoint, 400);
      return errorResponse("Invalid input", "VALIDATION_ERROR", 400, parsed.error.flatten());
    }

    const result = goldValuationService.evaluate(parsed.data);
    const enums = goldValuationService.toPrismaEnums(parsed.data);

    await goldRepository.create({
      userId: auth.context.user.id,
      weight: parsed.data.weight,
      ...enums,
      spotValue: result.spotValue!,
      retailValue: result.retailValue!,
      lowPrice: result.lowPrice,
      highPrice: result.highPrice,
      confidence: result.confidence,
      trend: result.trend,
      investmentScore: result.investmentScore,
      marketDemandScore: result.marketDemandScore,
      liquidityScore: result.liquidityScore,
    });

    await logRequest(auth.context, endpoint, 200);
    return jsonResponse({ assetType: "gold", ...result });
  } catch {
    await logRequest(auth.context, endpoint, 500);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
