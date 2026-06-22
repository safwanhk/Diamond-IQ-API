"use client";

import { useEffect, useState } from "react";
import { Play, Loader2, Copy, Check } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  DIAMOND_COLORS,
  DIAMOND_CLARITIES,
  DIAMOND_CUTS,
  CERTIFICATES,
} from "@/types";
import { formatCurrency } from "@/lib/utils";

const selectClass =
  "flex h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

function PlaygroundContent() {
  const [apiKey, setApiKey] = useState("");
  const [carat, setCarat] = useState("1.2");
  const [color, setColor] = useState("D");
  const [clarity, setClarity] = useState("VVS1");
  const [cut, setCut] = useState("Excellent");
  const [certificate, setCertificate] = useState("GIA");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function runValuation() {
    setLoading(true);
    setError("");
    setResult(null);

    const endpoint = apiKey ? "/api/v1/valuation" : "/api/playground";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) headers["X-API-Key"] = apiKey;

    try {
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
      if (!res.ok) {
        setError(data.error || "Request failed");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error. Please try again.");
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

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key (optional)</Label>
            <Input
              placeholder="sk_live_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for demo mode — no credits used
            </p>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Response</CardTitle>
          {result && (
            <Button variant="outline" size="sm" onClick={copyJson}>
              {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
              Copy JSON
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {error && <ErrorState message={error} onRetry={runValuation} className="py-6" />}
          {result && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Estimated Price</p>
                <p className="text-4xl font-bold text-primary">
                  {formatCurrency(result.estimatedPrice as number)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatCurrency(result.lowPrice as number)} –{" "}
                  {formatCurrency(result.highPrice as number)}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Confidence", value: `${result.confidence}%` },
                  { label: "Trend", value: result.trend as string },
                  { label: "Investment", value: result.investmentScore as number },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
              <pre className="overflow-x-auto rounded-lg border border-border bg-background p-4 text-sm text-accent">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          {!result && !error && (
            <EmptyState
              icon={Play}
              title="No response yet"
              description="Configure your diamond specs and run a valuation to see results."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PlaygroundPage() {
  const [authUser, setAuthUser] = useState<{
    name: string;
    email: string;
    role: "ADMIN" | "CUSTOMER";
    plan?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setAuthUser(d.user);
      })
      .catch(() => {});
  }, []);

  const content = <PlaygroundContent />;

  if (authUser) {
    return (
      <DashboardShell
        user={authUser}
        title="API Playground"
        description="Test diamond valuations interactively with your API key or in demo mode."
      >
        {content}
      </DashboardShell>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
      <Navbar />
      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">API Playground</h1>
        <p className="mt-2 text-muted-foreground">
          Test diamond valuations interactively. Leave API key empty to use demo mode.
        </p>
        <div className="mt-8">{content}</div>
      </div>
    </div>
  );
}
