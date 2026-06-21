import { NextRequest, NextResponse } from "next/server";
import { apiKeyRepository } from "@/repositories/api-key.repository";
import { usageService } from "@/services/usage.service";
import type { User } from "@prisma/client";

export interface AuthenticatedContext {
  user: User;
  apiKeyId?: string;
}

export function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function errorResponse(
  message: string,
  code: string,
  status = 400,
  details?: unknown
) {
  return jsonResponse({ error: message, code, details }, status);
}

export async function authenticateApiRequest(
  request: NextRequest
): Promise<{ context: AuthenticatedContext } | { error: NextResponse }> {
  const apiKey =
    request.headers.get("x-api-key") ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!apiKey) {
    return {
      error: errorResponse(
        "API key required. Pass via X-API-Key header.",
        "MISSING_API_KEY",
        401
      ),
    };
  }

  const keyRecord = await apiKeyRepository.findByKey(apiKey);

  if (!keyRecord || !keyRecord.active) {
    return {
      error: errorResponse("Invalid or inactive API key.", "INVALID_API_KEY", 401),
    };
  }

  const usage = await usageService.checkLimit(
    keyRecord.user.id,
    keyRecord.user.plan
  );

  if (!usage.allowed) {
    return {
      error: errorResponse(
        `Monthly request limit exceeded (${usage.used}/${usage.limit}). Upgrade your plan.`,
        "RATE_LIMIT_EXCEEDED",
        429
      ),
    };
  }

  await apiKeyRepository.updateLastUsed(keyRecord.id);

  return {
    context: {
      user: keyRecord.user,
      apiKeyId: keyRecord.id,
    },
  };
}

export async function logRequest(
  context: AuthenticatedContext,
  endpoint: string,
  statusCode: number
) {
  const { requestRepository } = await import("@/repositories/request.repository");
  await requestRepository.create({
    userId: context.user.id,
    apiKeyId: context.apiKeyId,
    endpoint,
    statusCode,
  });
}
