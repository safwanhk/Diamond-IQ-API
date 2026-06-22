import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { scraperService } from "@/services/scraper/scraper.service";

export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await scraperService.runAll();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Scrape failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
