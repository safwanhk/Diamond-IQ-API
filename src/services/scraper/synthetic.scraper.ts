import type { MarketplaceSource } from "@prisma/client";
import type { MarketplaceScraper, RawListing } from "@/types/marketplace";
import { valuationService } from "@/services/valuation.service";
import type { ValuationInput } from "@/types";

const COLORS = ["D", "E", "F", "G", "H", "I", "J", "K"] as const;
const CLARITIES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"] as const;
const CUTS = ["Excellent", "Very Good", "Good"] as const;
const CERTS = ["GIA", "IGI", "HRD"] as const;

/**
 * Generates realistic marketplace listings using the valuation engine + market variance.
 * Used when live scrapers are blocked (Cloudflare) and for local development.
 */
export class SyntheticMarketplaceScraper implements MarketplaceScraper {
  readonly source: MarketplaceSource = "SYNTHETIC";

  constructor(private readonly count = 120) {}

  async scrape(): Promise<RawListing[]> {
    const listings: RawListing[] = [];
    const sources: MarketplaceSource[] = [
      "BLUE_NILE",
      "JAMES_ALLEN",
      "BRILLIANT_EARTH",
      "RITANI",
    ];

    for (let i = 0; i < this.count; i++) {
      const carat = Math.round((0.3 + Math.random() * 3.2) * 100) / 100;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const clarity = CLARITIES[Math.floor(Math.random() * CLARITIES.length)];
      const cut = CUTS[Math.floor(Math.random() * CUTS.length)];
      const certificate = CERTS[Math.floor(Math.random() * CERTS.length)];
      const source = sources[i % sources.length];

      const input: ValuationInput = { carat, color, clarity, cut, certificate };
      const valuation = valuationService.evaluate(input);

      // Marketplace prices vary ±15% around estimate
      const variance = 0.85 + Math.random() * 0.3;
      const price = Math.round(valuation.estimatedPrice * variance);

      listings.push({
        externalId: `syn-${source.toLowerCase()}-${i}-${Date.now()}`,
        source,
        carat,
        color,
        clarity,
        cut,
        certificate,
        price,
        listingUrl: `https://marketplace.example/${source.toLowerCase()}/${i}`,
      });
    }

    return listings;
  }
}
