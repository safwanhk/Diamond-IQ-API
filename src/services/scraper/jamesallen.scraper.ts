import type { MarketplaceSource } from "@prisma/client";
import type { MarketplaceScraper, RawListing } from "@/types/marketplace";
import { normalizeListing, parsePrice } from "@/services/scraper/normalizers";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/** James Allen / Signet shared diamond search endpoints */
const JA_ENDPOINTS = [
  "https://www.jamesallen.com/service-api/v1/diamonds/search",
  "https://www.jamesallen.com/api/diamonds/search",
];

export class JamesAllenScraper implements MarketplaceScraper {
  readonly source: MarketplaceSource = "JAMES_ALLEN";

  async scrape(maxPages = 3): Promise<RawListing[]> {
    for (const endpoint of JA_ENDPOINTS) {
      try {
        const results = await this.fetchFromEndpoint(endpoint, maxPages);
        if (results.length > 0) return results;
      } catch {
        // try next
      }
    }
    return [];
  }

  private async fetchFromEndpoint(endpoint: string, maxPages: number): Promise<RawListing[]> {
    const listings: RawListing[] = [];
    const pageSize = 50;

    for (let page = 1; page <= maxPages; page++) {
      const body = {
        page,
        pageSize,
        shape: "Round",
        sort: { field: "price", direction: "asc" },
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) break;

      const text = await res.text();
      if (text.startsWith("<")) break;

      const data = JSON.parse(text) as {
        diamonds?: Array<Record<string, unknown>>;
        results?: Array<Record<string, unknown>>;
        data?: Array<Record<string, unknown>>;
      };

      const rows = data.diamonds ?? data.results ?? data.data ?? [];
      if (rows.length === 0) break;

      for (const row of rows) {
        const listing = this.mapRow(row);
        const normalized = listing ? normalizeListing(listing) : null;
        if (normalized) listings.push(normalized);
      }

      if (rows.length < pageSize) break;
    }

    return listings;
  }

  private mapRow(row: Record<string, unknown>): RawListing | null {
    const carat = Number(row.carat ?? row.size ?? 0);
    const price = parsePrice(row.price ?? row.finalPrice);
    if (!carat || !price) return null;

    return {
      externalId: String(row.id ?? row.diamondId ?? row.sku ?? ""),
      source: this.source,
      carat,
      color: String(row.color ?? ""),
      clarity: String(row.clarity ?? ""),
      cut: String(row.cut ?? row.cutGrade ?? "Excellent"),
      certificate: String(row.lab ?? row.certificate ?? "GIA"),
      price,
      listingUrl: row.url ? String(row.url) : undefined,
    };
  }
}
