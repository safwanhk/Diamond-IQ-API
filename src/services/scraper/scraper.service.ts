import type {
  Certificate,
  DiamondClarity,
  DiamondColor,
  DiamondCut,
} from "@prisma/client";
import { listingRepository } from "@/repositories/listing.repository";
import { BlueNileScraper } from "@/services/scraper/bluenile.scraper";
import { JamesAllenScraper } from "@/services/scraper/jamesallen.scraper";
import { SyntheticMarketplaceScraper } from "@/services/scraper/synthetic.scraper";
import { normalizeListing } from "@/services/scraper/normalizers";
import type { MarketplaceScraper, RawListing } from "@/types/marketplace";

export class ScraperService {
  private scrapers: MarketplaceScraper[] = [
    new BlueNileScraper(),
    new JamesAllenScraper(),
  ];

  async runAll(): Promise<{
    runId: string;
    totalFound: number;
    totalSaved: number;
    sources: string[];
  }> {
    const run = await listingRepository.createRun(
      this.scrapers.map((s) => s.source)
    );

    let totalFound = 0;
    let totalSaved = 0;
    const allListings: RawListing[] = [];

    for (const scraper of this.scrapers) {
      try {
        const listings = await scraper.scrape(3);
        totalFound += listings.length;
        allListings.push(...listings);
      } catch (err) {
        console.error(`[scraper] ${scraper.source} failed:`, err);
      }
    }

    // Fallback when live marketplaces block server requests
    if (allListings.length === 0 || process.env.SCRAPER_FORCE_SYNTHETIC === "true") {
      const synthetic = new SyntheticMarketplaceScraper(150);
      const syntheticListings = await synthetic.scrape();
      totalFound += syntheticListings.length;
      allListings.push(...syntheticListings);
    }

    const normalized = allListings
      .map((l) => normalizeListing(l))
      .filter((l): l is RawListing => l !== null)
      .map((l) => ({
        externalId: l.externalId,
        source: l.source,
        carat: l.carat,
        color: l.color as DiamondColor,
        clarity: l.clarity as DiamondClarity,
        cut: l.cut as DiamondCut,
        certificate: l.certificate as Certificate,
        price: l.price,
        currency: l.currency,
        listingUrl: l.listingUrl,
      }));

    totalSaved = await listingRepository.saveListings(run.id, normalized);

    await listingRepository.completeRun(run.id, {
      totalFound,
      totalSaved,
      status: "COMPLETED",
    });

    return {
      runId: run.id,
      totalFound,
      totalSaved,
      sources: [...new Set(allListings.map((l) => l.source))],
    };
  }
}

export const scraperService = new ScraperService();
