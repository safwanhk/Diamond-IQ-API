"use client";

import { useState } from "react";
import { Play, Loader2, Copy, Check } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  DIAMOND_COLORS,
  DIAMOND_CLARITIES,
  DIAMOND_CUTS,
  CERTIFICATES,
  GOLD_PURITIES,
  GOLD_UNITS,
  WATCH_BRANDS,
  WATCH_CONDITIONS,
} from "@/types/assets";

const selectClass =
  "flex h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

interface AssetPageProps {
  assetType: "diamond" | "gold" | "watch";
  title: string;
  description: string;
  endpoint: string;
}

export function AssetValuationPage({ assetType, title, description, endpoint }: AssetPageProps) {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Diamond
  const [carat, setCarat] = useState("1.2");
  const [color, setColor] = useState("D");
  const [clarity, setClarity] = useState("VVS1");
  const [cut, setCut] = useState("Excellent");
  const [certificate, setCertificate] = useState("GIA");

  // Gold
  const [weight, setWeight] = useState("10");
  const [purity, setPurity] = useState("24K");
  const [unit, setUnit] = useState("gram");

  // Watch
  const [brand, setBrand] = useState("Rolex");
  const [model, setModel] = useState("Submariner Date");
  const [referenceNumber, setReferenceNumber] = useState("126610LN");
  const [condition, setCondition] = useState("Excellent");
  const [year, setYear] = useState("2022");
  const [boxAndPapers, setBoxAndPapers] = useState(true);

  function buildBody() {
    if (assetType === "diamond") {
      return {
        carat: parseFloat(carat),
        color,
        clarity,
        cut,
        certificate,
      };
    }
    if (assetType === "gold") {
      return { weight: parseFloat(weight), purity, unit };
    }
    return {
      brand,
      model,
      referenceNumber: referenceNumber || undefined,
      condition,
      year: year ? parseInt(year) : undefined,
      boxAndPapers,
    };
  }

  async function runValuation() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildBody()),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Request failed");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  function copyJson() {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const estimated =
    (result?.estimatedValue as number) ?? (result?.estimatedPrice as number);

  return (
    <DashboardShell title={title} description={description}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Valuation Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assetType === "diamond" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Carat</Label>
                  <Input type="number" step="0.01" value={carat} onChange={(e) => setCarat(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <select className={selectClass} value={color} onChange={(e) => setColor(e.target.value)}>
                    {DIAMOND_COLORS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Clarity</Label>
                  <select className={selectClass} value={clarity} onChange={(e) => setClarity(e.target.value)}>
                    {DIAMOND_CLARITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Cut</Label>
                  <select className={selectClass} value={cut} onChange={(e) => setCut(e.target.value)}>
                    {DIAMOND_CUTS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Certificate</Label>
                  <select className={selectClass} value={certificate} onChange={(e) => setCertificate(e.target.value)}>
                    {CERTIFICATES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {assetType === "gold" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Weight</Label>
                  <Input type="number" step="0.01" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Purity</Label>
                    <select className={selectClass} value={purity} onChange={(e) => setPurity(e.target.value)}>
                      {GOLD_PURITIES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <select className={selectClass} value={unit} onChange={(e) => setUnit(e.target.value)}>
                      {GOLD_UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {assetType === "watch" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Brand</Label>
                    <select className={selectClass} value={brand} onChange={(e) => setBrand(e.target.value)}>
                      {WATCH_BRANDS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <select className={selectClass} value={condition} onChange={(e) => setCondition(e.target.value)}>
                      {WATCH_CONDITIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input value={model} onChange={(e) => setModel(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Reference</Label>
                    <Input value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={boxAndPapers}
                    onChange={(e) => setBoxAndPapers(e.target.checked)}
                    className="rounded border-border"
                  />
                  Box & Papers included
                </label>
              </div>
            )}

            <Button onClick={runValuation} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              Run Valuation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Result</CardTitle>
            {result && (
              <Button variant="outline" size="sm" onClick={copyJson}>
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {result && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Estimated Value</p>
                  <p className="text-4xl font-bold text-[#C9A227]">{formatCurrency(estimated)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(result.lowPrice as number)} – {formatCurrency(result.highPrice as number)}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  {(
                    [
                      { label: "Confidence", value: `${result.confidence}%` },
                      { label: "Investment", value: String(result.investmentScore) },
                      { label: "Demand", value: String(result.marketDemandScore) },
                      { label: "Liquidity", value: String(result.liquidityScore) },
                      { label: "Trend", value: String(result.trend) },
                      ...(result.spotValue
                        ? [{ label: "Spot", value: formatCurrency(result.spotValue as number) }]
                        : result.resaleValue
                          ? [{ label: "Resale", value: formatCurrency(result.resaleValue as number) }]
                          : []),
                    ] as { label: string; value: string }[]
                  ).map((item) => (
                    <div key={item.label} className="rounded-lg border border-border p-2">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
                <pre className="overflow-x-auto rounded-lg border border-border bg-background p-3 text-xs text-accent">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
            {!result && !error && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Configure inputs and run a valuation
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
