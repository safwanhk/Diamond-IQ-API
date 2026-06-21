"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Key,
  BarChart3,
  Gem,
  CreditCard,
  BookOpen,
  Settings,
  Users,
  LogOut,
  X,
  FileCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

const customerLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "Usage Analytics", icon: BarChart3 },
  { href: "/dashboard/valuations", label: "Valuations", icon: Gem },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/docs", label: "Documentation", icon: BookOpen },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const adminLinks = [
  { href: "/admin", label: "Admin Analytics", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/pricing", label: "Pricing Rules", icon: Settings },
  { href: "/playground", label: "Playground", icon: FileCode },
];

interface DashboardSidebarProps {
  role: "ADMIN" | "CUSTOMER";
  userName: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function DashboardSidebar({
  role,
  userName,
  mobileOpen,
  onMobileClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const links = role === "ADMIN" ? [...customerLinks, ...adminLinks] : customerLinks;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
        <Logo size="sm" />
        {onMobileClose && (
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMobileClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Platform
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onMobileClose}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "text-primary"
                  : "text-sidebar-foreground hover:bg-white/[0.04] hover:text-foreground"
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg border border-primary/20 bg-sidebar-active"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              {active && (
                <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
              )}
              <Icon className={cn("relative h-4 w-4", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="relative">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-4">
        <div className="mb-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
          <p className="truncate text-sm font-medium text-foreground">{userName}</p>
          <p className="text-xs text-muted-foreground">
            {role === "ADMIN" ? "Administrator" : "Customer"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </>
  );

  return (
    <>
      <aside className="relative z-10 hidden h-screen w-64 shrink-0 flex-col border-r border-white/[0.06] bg-sidebar lg:flex">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.06] bg-sidebar lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
