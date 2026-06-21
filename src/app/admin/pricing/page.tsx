"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const defaultRules = [
  { category: "color", key: "D", multiplier: 1.35, description: "Colorless - highest grade" },
  { category: "color", key: "E", multiplier: 1.28, description: "Colorless" },
  { category: "clarity", key: "FL", multiplier: 1.5, description: "Flawless" },
  { category: "clarity", key: "IF", multiplier: 1.4, description: "Internally Flawless" },
  { category: "cut", key: "EXCELLENT", multiplier: 1.15, description: "Excellent cut grade" },
  { category: "certificate", key: "GIA", multiplier: 1.08, description: "GIA certified premium" },
];

export default function AdminPricingPage() {
  return (
    <DashboardShell
      title="Pricing Rules"
      description="Valuation multipliers used by the pricing engine"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Multipliers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Category</th>
                  <th className="pb-3 pr-4 font-medium">Key</th>
                  <th className="pb-3 pr-4 font-medium">Multiplier</th>
                  <th className="pb-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {defaultRules.map((rule) => (
                  <tr
                    key={`${rule.category}-${rule.key}`}
                    className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="py-3 pr-4 capitalize">{rule.category}</td>
                    <td className="py-3 pr-4 font-mono text-accent">{rule.key}</td>
                    <td className="py-3 pr-4">
                      <Badge variant="default">{rule.multiplier}x</Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{rule.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
