"use client";

import { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DIAMOND_COLORS,
  DIAMOND_CLARITIES,
  DIAMOND_CUTS,
  CERTIFICATES,
} from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState("");
  const [carat, setCarat] = useState("1.2");
  const [color, setColor] = useState("D");
  const [clarity, setClarity] = useState("VVS1");
  const [cut, setCut] = useState("Excellent");
  const [certificate, setCertificate] = useState("GIA");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function runValuation() {
    setLoading(true);
    setError("");
    setResult(null);

    const endpoint = apiKey ? "/api/v1/valuation" : "/api/playground";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) headers["X-API-Key"] = apiKey;

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        carat: parseFloat(carat),
        color,
        clarity,
        cut,
        certificate,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Request failed");
      return;
    }
    setResult(data);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">API Playground</h1>
        <p className="mt-2 text-slate-600">
          Test diamond valuations interactively. Leave API key empty to use demo mode.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key (optional)</Label>
                <Input
                  placeholder="diq_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Carat</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="20"
                    value={carat}
                    onChange={(e) => setCarat(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  >
                    {DIAMOND_COLORS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Clarity</Label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                    value={clarity}
                    onChange={(e) => setClarity(e.target.value)}
                  >
                    {DIAMOND_CLARITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Cut</Label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                    value={cut}
                    onChange={(e) => setCut(e.target.value)}
                  >
                    {DIAMOND_CUTS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Certificate</Label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                    value={certificate}
                    onChange={(e) => setCertificate(e.target.value)}
                  >
                    {CERTIFICATES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button onClick={runValuation} disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                Run Valuation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
              )}
              {result && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Estimated Price</p>
                    <p className="text-4xl font-bold text-indigo-600">
                      {formatCurrency(result.estimatedPrice as number)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatCurrency(result.lowPrice as number)} –{" "}
                      {formatCurrency(result.highPrice as number)}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Confidence</p>
                      <p className="text-lg font-bold">{result.confidence as number}%</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Trend</p>
                      <p className="text-lg font-bold">{result.trend as string}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Investment</p>
                      <p className="text-lg font-bold">{result.investmentScore as number}</p>
                    </div>
                  </div>
                  <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-emerald-400">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
              {!result && !error && (
                <p className="text-center text-sm text-slate-400 py-12">
                  Run a valuation to see results
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
