import { NextRequest } from "next/server";
import {
  authenticateApiRequest,
  errorResponse,
  jsonResponse,
  logRequest,
} from "@/lib/api-middleware";
import { valuationService } from "@/services/valuation.service";
import { valuationRepository } from "@/repositories/valuation.repository";
import { valuationInputSchema } from "@/types";

export async function POST(request: NextRequest) {
  const auth = await authenticateApiRequest(request);
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    const parsed = valuationInputSchema.safeParse(body);

    if (!parsed.success) {
      await logRequest(auth.context, "/api/v1/valuation", 400);
      return errorResponse(
        "Invalid input",
        "VALIDATION_ERROR",
        400,
        parsed.error.flatten()
      );
    }

    const result = valuationService.evaluate(parsed.data);
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
    });

    await logRequest(auth.context, "/api/v1/valuation", 200);
    return jsonResponse(result);
  } catch (err) {
    const { logError } = await import("@/lib/error-monitor");
    logError("Valuation request failed", { error: String(err) });
    await logRequest(auth.context, "/api/v1/valuation", 500);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
