import { AssetValuationPage } from "@/components/dashboard/asset-valuation-page";

export default function WatchesPage() {
  return (
    <AssetValuationPage
      assetType="watch"
      title="Watch Valuation"
      description="Market value and resale estimates for luxury timepieces"
      endpoint="/api/playground/watches"
    />
  );
}
