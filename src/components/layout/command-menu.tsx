"use client";

import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  LayoutDashboard,
  Key,
  BarChart3,
  Gem,
  CreditCard,
  BookOpen,
  Settings,
  FileCode,
  Search,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const commands = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, group: "Navigation" },
  { label: "Usage Analytics", href: "/dashboard/analytics", icon: BarChart3, group: "Navigation" },
  { label: "Valuations", href: "/dashboard/valuations", icon: Gem, group: "Navigation" },
  { label: "API Keys", href: "/dashboard/api-keys", icon: Key, group: "Navigation" },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard, group: "Navigation" },
  { label: "Documentation", href: "/dashboard/docs", icon: BookOpen, group: "Navigation" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, group: "Navigation" },
  { label: "API Playground", href: "/playground", icon: FileCode, group: "Tools" },
  { label: "Public Docs", href: "/docs", icon: BookOpen, group: "Tools" },
];

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: "ADMIN" | "CUSTOMER";
}

export function CommandMenu({ open, onOpenChange, role }: CommandMenuProps) {
  const router = useRouter();
  const allCommands =
    role === "ADMIN"
      ? [...commands, { label: "Admin Analytics", href: "/admin", icon: BarChart3, group: "Admin" }]
      : commands;

  const groups = [...new Set(allCommands.map((c) => c.group))];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl max-w-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              placeholder="Search pages, actions..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            {groups.map((group) => (
              <Command.Group key={group} heading={group}>
                {allCommands
                  .filter((c) => c.group === group)
                  .map((cmd) => {
                    const Icon = cmd.icon;
                    return (
                      <Command.Item
                        key={cmd.href}
                        value={cmd.label}
                        onSelect={() => {
                          onOpenChange(false);
                          router.push(cmd.href);
                        }}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-muted"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {cmd.label}
                      </Command.Item>
                    );
                  })}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
