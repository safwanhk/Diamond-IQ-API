import { NextRequest } from "next/server";
import {
  authenticateApiRequest,
  errorResponse,
  jsonResponse,
  logRequest,
} from "@/lib/api-middleware";
import { watchValuationService } from "@/services/watch.service";
import { watchRepository } from "@/repositories/watch.repository";
import { watchInputSchema } from "@/types/assets";

export async function POST(request: NextRequest) {
  const auth = await authenticateApiRequest(request);
  if ("error" in auth) return auth.error;

  const endpoint = "/api/v1/watches/valuation";

  try {
    const body = await request.json();
    const parsed = watchInputSchema.safeParse(body);

    if (!parsed.success) {
      await logRequest(auth.context, endpoint, 400);
      return errorResponse("Invalid input", "VALIDATION_ERROR", 400, parsed.error.flatten());
    }

    const result = watchValuationService.evaluate(parsed.data);
    const enums = watchValuationService.toPrismaEnums(parsed.data);

    await watchRepository.create({
      userId: auth.context.user.id,
      model: parsed.data.model,
      referenceNumber: parsed.data.referenceNumber,
      year: parsed.data.year,
      boxAndPapers: parsed.data.boxAndPapers,
      ...enums,
      estimatedValue: result.estimatedValue,
      resaleValue: result.resaleValue!,
      lowPrice: result.lowPrice,
      highPrice: result.highPrice,
      confidence: result.confidence,
      trend: result.trend,
      investmentScore: result.investmentScore,
      marketDemandScore: result.marketDemandScore,
      liquidityScore: result.liquidityScore,
    });

    await logRequest(auth.context, endpoint, 200);
    return jsonResponse({ assetType: "watch", ...result });
  } catch {
    await logRequest(auth.context, endpoint, 500);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
