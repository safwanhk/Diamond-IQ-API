import { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/api-middleware";
import { apiKeyRepository } from "@/repositories/api-key.repository";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return errorResponse("Authentication required", "UNAUTHORIZED", 401);
  }

  const { id } = await params;
  const result = await apiKeyRepository.delete(id, session.userId);

  if (result.count === 0) {
    return errorResponse("API key not found", "NOT_FOUND", 404);
  }

  return jsonResponse({ success: true });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return errorResponse("Authentication required", "UNAUTHORIZED", 401);
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  if (body.action !== "rotate") {
    return errorResponse("Invalid action", "VALIDATION_ERROR", 400);
  }

  const newKey = await apiKeyRepository.rotate(id, session.userId);

  if (!newKey) {
    return errorResponse("API key not found or inactive", "NOT_FOUND", 404);
  }

  return jsonResponse({
    id: newKey.id,
    key: newKey.key,
    name: newKey.name,
    createdAt: newKey.createdAt,
  });
}
