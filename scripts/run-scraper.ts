#!/usr/bin/env tsx
import { scraperService } from "../src/services/scraper/scraper.service";

async function main() {
  console.log("[scraper] Running marketplace scrape...");
  const result = await scraperService.runAll();
  console.log(
    `[scraper] Saved ${result.totalSaved}/${result.totalFound} listings (run ${result.runId})`
  );
  console.log(`[scraper] Sources: ${result.sources.join(", ")}`);
}

main().catch((err) => {
  console.error("[scraper] Failed:", err);
  process.exit(1);
});
