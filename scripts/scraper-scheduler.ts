#!/usr/bin/env tsx
/**
 * Local 24-hour scraper scheduler.
 * Run: npm run scraper:scheduler
 */
import cron from "node-cron";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const CRON_SECRET = process.env.CRON_SECRET || "dev-cron-secret";

async function runScraper() {
  const started = new Date().toISOString();
  console.log(`[scheduler] Starting scrape at ${started}`);

  try {
    const res = await fetch(`${APP_URL}/api/cron/scrape`, {
      headers: { Authorization: `Bearer ${CRON_SECRET}` },
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("[scheduler] Scrape failed:", data);
      return;
    }
    console.log(
      `[scheduler] Done — saved ${data.totalSaved}/${data.totalFound} listings from ${data.sources?.join(", ")}`
    );
  } catch (err) {
    console.error("[scheduler] Error:", err);
  }
}

// Run immediately on start, then every 24 hours at 2:00 AM
runScraper();
cron.schedule("0 2 * * *", runScraper);

console.log("[scheduler] DiamondIQ scraper scheduled every 24 hours (2:00 AM)");
console.log(`[scheduler] Target: ${APP_URL}/api/cron/scrape`);
