import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: { value: string; positive?: boolean };
  className?: string;
  index?: number;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("group overflow-hidden", className)}>
      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted">
            <Icon className="h-4 w-4 text-foreground" />
          </div>
        )}
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-semibold tracking-tight text-foreground">{value}</div>
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
  );
}
