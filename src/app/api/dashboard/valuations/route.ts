import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { valuationRepository } from "@/repositories/valuation.repository";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const valuations = await valuationRepository.findByUserId(session.userId, 50);

  return NextResponse.json({ data: valuations, count: valuations.length });
}
