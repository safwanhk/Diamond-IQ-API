"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const iconGradients = [
  "from-primary/20 to-primary/5",
  "from-accent/20 to-accent/5",
  "from-success/20 to-success/5",
  "from-violet-500/20 to-violet-500/5",
];

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: { value: string; positive?: boolean };
  className?: string;
  delay?: number;
  index?: number;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  delay = 0,
  index = 0,
}: StatCardProps) {
  const gradient = iconGradients[index % iconGradients.length];

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className={cn("group overflow-hidden", className)}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <CardHeader className="relative flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {Icon && (
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br",
                gradient
              )}
            >
              <Icon className="h-4 w-4 text-primary" />
            </div>
          )}
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "mt-1.5 text-xs font-medium",
                trend.positive ? "text-success" : "text-destructive"
              )}
            >
              {trend.value}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
