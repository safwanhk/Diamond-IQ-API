import { AssetValuationPage } from "@/components/dashboard/asset-valuation-page";

export default function DiamondsPage() {
  return (
    <AssetValuationPage
      assetType="diamond"
      title="Diamond Valuation"
      description="GIA-grade pricing intelligence for loose diamonds"
      endpoint="/api/playground"
    />
  );
}
