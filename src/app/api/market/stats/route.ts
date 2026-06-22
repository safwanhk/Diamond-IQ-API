import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listingRepository } from "@/repositories/listing.repository";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [stats, trend, recent] = await Promise.all([
    listingRepository.getStats(30),
    listingRepository.getTrend(30),
    listingRepository.getRecentListings(10),
  ]);

  return NextResponse.json({ stats, trend, recent });
}
