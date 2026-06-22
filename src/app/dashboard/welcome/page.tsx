"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, Check, Key, Gem, ArrowRight, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const key = sessionStorage.getItem("onboarding_api_key");
    if (key) setApiKey(key);
  }, []);

  function copyKey() {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const steps = [
    {
      icon: Key,
      title: "Your API key is ready",
      description: apiKey
        ? "Copy and store it securely — you won't see the full key again."
        : "Check API Keys in your dashboard to manage keys.",
      done: true,
    },
    {
      icon: Gem,
      title: "Run your first valuation",
      description: "Use the playground to test a diamond valuation instantly.",
      done: false,
    },
    {
      icon: Sparkles,
      title: "Upgrade when you're ready",
      description: "Free plan includes 100 requests/month. Scale as you grow.",
      done: false,
    },
  ];

  return (
    <DashboardShell
      title="Welcome to DiamondIQ"
      description="You're all set. Here's how to get started."
    >
      {apiKey && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-8 border-success/30 bg-success/5">
            <CardContent className="pt-6">
              <p className="mb-3 text-sm font-medium text-success">
                Your API key — copy it now
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 overflow-x-auto rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm">
                  {apiKey}
                </code>
                <Button size="sm" onClick={copyKey}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/playground">
            Try the Playground
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/api-keys">Manage API Keys</Link>
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            sessionStorage.removeItem("onboarding_api_key");
            router.push("/dashboard");
          }}
        >
          Skip to Dashboard
        </Button>
      </div>
    </DashboardShell>
  );
}
