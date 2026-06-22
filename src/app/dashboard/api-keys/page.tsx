"use client";

import { useEffect, useState } from "react";
import { Copy, Plus, Check, Key, Trash2, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
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

  async function loadKeys() {
    const keysRes = await fetch("/api/v1/apikeys");
    const keysData = await keysRes.json();
    setKeys(keysData.data || []);
  }

  useEffect(() => {
    loadKeys();
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
      await loadKeys();
    }
  }

  async function deleteKey(id: string) {
    if (!confirm("Delete this API key? This cannot be undone.")) return;
    const res = await fetch(`/api/v1/apikeys/${id}`, { method: "DELETE" });
    if (res.ok) await loadKeys();
  }

  async function rotateKey(id: string) {
    const res = await fetch(`/api/v1/apikeys/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rotate" }),
    });
    const data = await res.json();
    if (res.ok) {
      setCreatedKey(data.key);
      await loadKeys();
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
              <EmptyState
                icon={Key}
                title="No API keys yet"
                description="Create your first key to start making authenticated API requests."
              />
            ) : (
              keys.map((key) => (
                <div
                  key={key.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{key.name}</p>
                    <code className="text-sm text-muted-foreground">{key.key}</code>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Created {formatDate(key.createdAt)}
                      {key.lastUsed && ` · Last used ${formatDate(key.lastUsed)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={key.active ? "success" : "secondary"}>
                      {key.active ? "Active" : "Inactive"}
                    </Badge>
                    {key.active && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => rotateKey(key.id)} title="Rotate key">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteKey(key.id)} title="Delete key">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
