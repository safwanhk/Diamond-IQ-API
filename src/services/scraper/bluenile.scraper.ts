import type { MarketplaceSource } from "@prisma/client";
import type { MarketplaceScraper, RawListing } from "@/types/marketplace";
import { normalizeListing, parsePrice } from "@/services/scraper/normalizers";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const BN_ENDPOINTS = [
  "https://www.bluenile.com/api/public/diamond-search-grid/v2",
  "https://www.bluenile.com/api/public/tps-search/product",
];

export class BlueNileScraper implements MarketplaceScraper {
  readonly source: MarketplaceSource = "BLUE_NILE";

  async scrape(maxPages = 3): Promise<RawListing[]> {
    const listings: RawListing[] = [];

    for (const endpoint of BN_ENDPOINTS) {
      try {
        const pageListings = await this.fetchFromEndpoint(endpoint, maxPages);
        if (pageListings.length > 0) {
          return pageListings;
        }
      } catch {
        // try next endpoint
      }
    }

    return listings;
  }

  private async fetchFromEndpoint(endpoint: string, maxPages: number): Promise<RawListing[]> {
    const listings: RawListing[] = [];
    const pageSize = 50;

    const landing = await fetch("https://www.bluenile.com/", {
      headers: { "User-Agent": USER_AGENT },
    });
    const cookie = landing.headers.get("set-cookie") ?? "";

    for (let page = 0; page < maxPages; page++) {
      const params = new URLSearchParams({
        startIndex: String(page * pageSize),
        pageSize: String(pageSize),
        country: "USA",
        language: "en-us",
        currency: "USD",
        sortColumn: "price",
        sortDirection: "asc",
        shape: "RD",
      });

      const res = await fetch(`${endpoint}?${params}`, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json",
          Cookie: cookie,
          Referer: "https://www.bluenile.com/diamond-search",
        },
      });

      if (!res.ok) continue;

      const text = await res.text();
      if (text.startsWith("<") || text === "Not Found") continue;

      const data = JSON.parse(text) as {
        results?: Array<Record<string, unknown>>;
        items?: Array<Record<string, unknown>>;
      };

      const rows = data.results ?? data.items ?? [];
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
    const carat = Number(row.carat ?? row.caratWeight ?? 0);
    const price = parsePrice(row.price ?? row.totalPrice ?? row.finalPrice);
    const color = String(row.color ?? row.colorName ?? "");
    const clarity = String(row.clarity ?? row.clarityName ?? "");
    const cut = String(row.cut ?? row.cutGrade ?? row.cutName ?? "Good");
    const cert = String(row.lab ?? row.certificate ?? row.certLab ?? "GIA");

    if (!carat || !price) return null;

    return {
      externalId: String(row.sku ?? row.id ?? row.diamondId ?? ""),
      source: this.source,
      carat,
      color,
      clarity,
      cut,
      certificate: cert,
      price,
      listingUrl: row.productUrl
        ? String(row.productUrl)
        : row.url
          ? String(row.url)
          : undefined,
    };
  }
}
