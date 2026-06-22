import { AssetValuationPage } from "@/components/dashboard/asset-valuation-page";

export default function GoldPage() {
  return (
    <AssetValuationPage
      assetType="gold"
      title="Gold Valuation"
      description="Spot and retail value for bullion and jewelry gold"
      endpoint="/api/playground/gold"
    />
  );
}
