import { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/api-middleware";
import { apiKeyRepository } from "@/repositories/api-key.repository";
import { createApiKeySchema } from "@/types";

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return errorResponse("Authentication required", "UNAUTHORIZED", 401);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = createApiKeySchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Invalid input", "VALIDATION_ERROR", 400);
    }

    const apiKey = await apiKeyRepository.create(
      session.userId,
      parsed.data.name
    );

    return jsonResponse(
      {
        id: apiKey.id,
        key: apiKey.key,
        name: apiKey.name,
        createdAt: apiKey.createdAt,
      },
      201
    );
  } catch {
    return errorResponse("Failed to create API key", "INTERNAL_ERROR", 500);
  }
}

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return errorResponse("Authentication required", "UNAUTHORIZED", 401);
  }

  const keys = await apiKeyRepository.findByUserId(session.userId);
  return jsonResponse({
    data: keys.map((k) => ({
      id: k.id,
      name: k.name,
      key: `${k.key.slice(0, 8)}...${k.key.slice(-4)}`,
      active: k.active,
      createdAt: k.createdAt,
      lastUsed: k.lastUsed,
    })),
  });
}
