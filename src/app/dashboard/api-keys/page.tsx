"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Plus, Check, Key } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  active: boolean;
  createdAt: string;
  lastUsed?: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/v1/apikeys")
      .then((r) => r.json())
      .then((keysData) => setKeys(keysData.data || []));
  }, []);

  async function createKey() {
    setLoading(true);
    const res = await fetch("/api/v1/apikeys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName || "Default" }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setCreatedKey(data.key);
      setNewKeyName("");
      const keysRes = await fetch("/api/v1/apikeys");
      const keysData = await keysRes.json();
      setKeys(keysData.data || []);
    }
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <DashboardShell title="API Keys" description="Manage your API authentication keys">
      {createdKey && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-6 border-success/30 bg-success/5">
            <CardContent className="pt-6">
              <p className="mb-2 text-sm font-medium text-success">
                New API key created. Copy it now — you won&apos;t see it again.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm">
                  {createdKey}
                </code>
                <Button size="sm" onClick={() => copyKey(createdKey)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Create New Key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Key name (e.g. Production)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
            <Button onClick={createKey} disabled={loading} className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Create Key
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {keys.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <Key className="mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No API keys yet</p>
              </div>
            ) : (
              keys.map((key, i) => (
                <motion.div
                  key={key.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{key.name}</p>
                    <code className="text-sm text-muted-foreground">{key.key}</code>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Created {formatDate(key.createdAt)}
                      {key.lastUsed && ` · Last used ${formatDate(key.lastUsed)}`}
                    </p>
                  </div>
                  <Badge variant={key.active ? "success" : "secondary"}>
                    {key.active ? "Active" : "Inactive"}
                  </Badge>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
