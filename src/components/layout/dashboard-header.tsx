"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface DashboardHeaderProps {
  user: { name: string; email?: string; role: string };
  onMenuClick: () => void;
  onSearchClick: () => void;
}

const notifications = [
  { id: 1, title: "API usage at 80%", time: "2m ago", unread: true },
  { id: 2, title: "New valuation endpoint available", time: "1h ago", unread: true },
  { id: 3, title: "Monthly report ready", time: "3h ago", unread: false },
];

export function DashboardHeader({ user, onMenuClick, onSearchClick }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => setMounted(true), []);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/[0.06] bg-background/70 px-4 backdrop-blur-xl sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <button
        onClick={onSearchClick}
        className="flex max-w-md flex-1 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/20 hover:bg-white/[0.05]"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="ml-auto hidden rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-1">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 border-white/[0.08] bg-card">
            <div className="px-3 py-2 text-sm font-semibold">Notifications</div>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2.5">
                <div className="flex w-full items-center gap-2">
                  {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                  <span className="text-sm font-medium">{n.title}</span>
                </div>
                <span className="pl-3.5 text-xs text-muted-foreground">{n.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
              <Avatar className="h-8 w-8 ring-2 ring-border">
                <AvatarFallback className="bg-foreground text-xs text-background">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-white/[0.08] bg-card">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user.name}</p>
              {user.email && (
                <p className="text-xs text-muted-foreground">{user.email}</p>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/login";
              }}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
