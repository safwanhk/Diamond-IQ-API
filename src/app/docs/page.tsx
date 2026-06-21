"use client";

import { useEffect, useState } from "react";
import "swagger-ui-react/swagger-ui.css";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

const sdkExamples = {
  javascript: `const response = await fetch('https://api.diamondiq.com/api/v1/valuation', {
  method: 'POST',
  headers: {
    'X-API-Key': 'diq_your_api_key',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    carat: 1.2,
    color: 'D',
    clarity: 'VVS1',
    cut: 'Excellent',
    certificate: 'GIA',
  }),
});
const data = await response.json();
console.log(data.estimatedPrice);`,
  typescript: `interface ValuationInput {
  carat: number;
  color: 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M';
  clarity: 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2' | 'I1' | 'I2' | 'I3';
  cut: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  certificate: 'GIA' | 'IGI' | 'HRD' | 'None';
}

const input: ValuationInput = {
  carat: 1.2, color: 'D', clarity: 'VVS1',
  cut: 'Excellent', certificate: 'GIA',
};

const res = await fetch('/api/v1/valuation', {
  method: 'POST',
  headers: { 'X-API-Key': process.env.DIAMONDIQ_API_KEY!, 'Content-Type': 'application/json' },
  body: JSON.stringify(input),
});`,
  python: `import requests

response = requests.post(
    "https://api.diamondiq.com/api/v1/valuation",
    headers={"X-API-Key": "diq_your_api_key"},
    json={
        "carat": 1.2,
        "color": "D",
        "clarity": "VVS1",
        "cut": "Excellent",
        "certificate": "GIA",
    },
)
data = response.json()
print(f"Estimated: \${data['estimatedPrice']:,}")`,
  php: `<?php
$ch = curl_init('https://api.diamondiq.com/api/v1/valuation');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'X-API-Key: diq_your_api_key',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'carat' => 1.2,
        'color' => 'D',
        'clarity' => 'VVS1',
        'cut' => 'Excellent',
        'certificate' => 'GIA',
    ]),
]);
$response = json_decode(curl_exec($ch), true);
echo "Estimated: $" . number_format($response['estimatedPrice']);`,
};

export default function DocsPage() {
  const [spec, setSpec] = useState<object | null>(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((r) => r.json())
      .then(setSpec);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">API Documentation</h1>
        <p className="mt-2 text-slate-600">
          Complete reference for the DiamondIQ REST API
        </p>

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="openapi">OpenAPI</TabsTrigger>
            <TabsTrigger value="sdks">SDK Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-600">
                <p>All API requests require an API key passed via the <code className="rounded bg-slate-100 px-1">X-API-Key</code> header.</p>
                <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-emerald-400">
                  X-API-Key: diq_your_api_key_here
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { method: "POST", path: "/api/v1/valuation", desc: "Get diamond valuation" },
                  { method: "GET", path: "/api/v1/history", desc: "Valuation history" },
                  { method: "GET", path: "/api/v1/trends", desc: "Market trends" },
                  { method: "GET", path: "/api/v1/account/usage", desc: "API usage stats" },
                  { method: "POST", path: "/api/v1/apikeys", desc: "Create API key (JWT)" },
                ].map((ep) => (
                  <div key={ep.path} className="flex items-center gap-4 rounded-lg border p-3">
                    <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                      ep.method === "POST" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {ep.method}
                    </span>
                    <code className="text-sm">{ep.path}</code>
                    <span className="text-sm text-slate-500">{ep.desc}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button asChild>
                <Link href="/playground">Try the Playground</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">Get API Key</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="openapi" className="mt-6">
            {spec && <SwaggerUI url="/api/docs" />}
          </TabsContent>

          <TabsContent value="sdks" className="mt-6 space-y-6">
            {Object.entries(sdkExamples).map(([lang, code]) => (
              <Card key={lang}>
                <CardHeader>
                  <CardTitle className="capitalize">{lang}</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-emerald-400">
                    {code}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
