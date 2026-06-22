import { NextRequest } from "next/server";
import {
  authenticateApiRequest,
  jsonResponse,
  logRequest,
} from "@/lib/api-middleware";
import { marketIndexService } from "@/services/market-index.service";

export async function GET(request: NextRequest) {
  const auth = await authenticateApiRequest(request);
  if ("error" in auth) return auth.error;

  const index = await marketIndexService.getIndex();
  await logRequest(auth.context, "/api/v1/market-index", 200);
  return jsonResponse(index);
}
