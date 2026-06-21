"use client";

import { useEffect, useState } from "react";
import { CommandMenu } from "@/components/layout/command-menu";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardUser {
  name: string;
  email?: string;
  role: "ADMIN" | "CUSTOMER";
  plan?: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  user?: DashboardUser;
  title?: string;
  description?: string;
}

export function DashboardShell({ children, user: userProp, title, description }: DashboardShellProps) {
  const [user, setUser] = useState<DashboardUser | null>(userProp ?? null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    if (!userProp) {
      fetch("/api/auth/me")
        .then((r) => r.json())
        .then((d) => {
          if (d.user) setUser(d.user);
        });
    }
  }, [userProp]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!user) {
    return (
      <div className="relative flex min-h-screen bg-background">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative flex flex-1">
          <div className="hidden w-64 border-r border-border p-4 lg:block">
            <Skeleton className="mb-6 h-8 w-32" />
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="mb-2 h-9 w-full" />
            ))}
          </div>
          <div className="flex-1 p-8">
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="mb-8 h-4 w-64" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-accent/6 blur-[100px]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <DashboardSidebar
        role={user.role}
        userName={user.name}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          user={user}
          onMenuClick={() => setMobileOpen(true)}
          onSearchClick={() => setCommandOpen(true)}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {(title || description) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
              )}
              {description && (
                <p className="mt-1 text-muted-foreground">{description}</p>
              )}
            </div>
          )}
          {children}
        </main>
      </div>
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} role={user.role} />
    </div>
  );
}
