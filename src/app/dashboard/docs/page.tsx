"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ExternalLink, Code, Zap } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const quickLinks = [
  {
    title: "Getting Started",
    description: "Authenticate and make your first valuation request",
    href: "/docs",
    icon: Zap,
  },
  {
    title: "API Reference",
    description: "Complete endpoint documentation with examples",
    href: "/docs",
    icon: Code,
  },
  {
    title: "Interactive Playground",
    description: "Test API calls without writing code",
    href: "/playground",
    icon: BookOpen,
  },
];

const endpoints = [
  { method: "POST", path: "/api/v1/valuation", description: "Get diamond valuation" },
  { method: "GET", path: "/api/v1/history", description: "Valuation history" },
  { method: "GET", path: "/api/v1/trends", description: "Market trends" },
  { method: "GET", path: "/api/v1/account/usage", description: "Account usage stats" },
];

export default function DashboardDocsPage() {
  const [openApiUrl, setOpenApiUrl] = useState("/api/docs");

  useEffect(() => {
    setOpenApiUrl(`${window.location.origin}/api/docs`);
  }, []);

  return (
    <DashboardShell
      title="Documentation"
      description="Everything you need to integrate DiamondIQ"
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {quickLinks.map((link) => (
          <Card key={link.title} className="group transition-all hover:border-primary/20 hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-transform group-hover:scale-110">
                <link.icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">{link.title}</CardTitle>
              <CardDescription>{link.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <Link href={link.href}>
                  View <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Endpoints</CardTitle>
          <CardDescription>Core endpoints for diamond valuation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {endpoints.map((ep) => (
              <div
                key={ep.path}
                className="flex flex-col gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant={ep.method === "POST" ? "default" : "secondary"}
                    className="font-mono text-[10px]"
                  >
                    {ep.method}
                  </Badge>
                  <code className="text-sm">{ep.path}</code>
                </div>
                <span className="text-sm text-muted-foreground">{ep.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">OpenAPI Specification</CardTitle>
          <CardDescription>Machine-readable API definition</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <a href={openApiUrl} target="_blank" rel="noopener noreferrer">
              View OpenAPI Spec <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
