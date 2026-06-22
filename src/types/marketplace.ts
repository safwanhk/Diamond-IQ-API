import type { MarketplaceSource } from "@prisma/client";

export interface RawListing {
  externalId?: string;
  source: MarketplaceSource;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  certificate: string;
  price: number;
  currency?: string;
  listingUrl?: string;
}

export interface MarketplaceScraper {
  readonly source: MarketplaceSource;
  scrape(maxPages?: number): Promise<RawListing[]>;
}

export interface MarketStats {
  totalListings: number;
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
  lastScrapedAt: string | null;
  bySource: Array<{
    source: MarketplaceSource;
    count: number;
    averagePrice: number;
  }>;
}

export interface MarketTrendPoint {
  date: string;
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
  count: number;
}

export interface MarketTrendResponse {
  trend: MarketTrendPoint[];
  stats: MarketStats;
}
