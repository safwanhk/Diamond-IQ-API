import { NextRequest, NextResponse } from "next/server";
import { scraperService } from "@/services/scraper/scraper.service";

export async function GET(request: NextRequest) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || secret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await scraperService.runAll();
    return NextResponse.json({
      success: true,
      ...result,
      ranAt: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Scraper failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
