import { NextRequest } from "next/server";
import {
  authenticateApiRequest,
  jsonResponse,
  logRequest,
} from "@/lib/api-middleware";
import { usageService } from "@/services/usage.service";

export async function GET(request: NextRequest) {
  const auth = await authenticateApiRequest(request);
  if ("error" in auth) return auth.error;

  const usage = await usageService.getUsageStats(
    auth.context.user.id,
    auth.context.user.plan
  );

  await logRequest(auth.context, "/api/v1/account/usage", 200);
  return jsonResponse(usage);
}
