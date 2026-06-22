"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { useDashboardUser } from "@/components/providers/dashboard-user-provider";

const CommandMenu = dynamic(
  () => import("@/components/layout/command-menu").then((m) => m.CommandMenu),
  { ssr: false }
);

interface ShellUser {
  name: string;
  email?: string;
  role: "ADMIN" | "CUSTOMER";
  plan?: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  user?: ShellUser;
  title?: string;
  description?: string;
}

export function DashboardShell({
  children,
  user: userProp,
  title,
  description,
}: DashboardShellProps) {
  const contextUser = useDashboardUser();
  const user: ShellUser | null = userProp ?? contextUser;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!user) return null;

  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

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
      {commandOpen && (
        <CommandMenu
          open={commandOpen}
          onOpenChange={setCommandOpen}
          role={user.role}
        />
      )}
    </div>
  );
}
