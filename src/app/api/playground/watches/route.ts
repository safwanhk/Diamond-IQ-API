import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { watchValuationService } from "@/services/watch.service";
import { watchInputSchema } from "@/types/assets";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = watchInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const result = watchValuationService.evaluate(parsed.data);
    return NextResponse.json({ assetType: "watch", ...result });
  } catch {
    return NextResponse.json({ error: "Valuation failed" }, { status: 500 });
  }
}
