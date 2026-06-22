import Link from "next/link";
import { Gem } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: "h-7 w-7", gem: "h-3.5 w-3.5", text: "text-sm" },
    md: { icon: "h-8 w-8", gem: "h-4 w-4", text: "text-base" },
    lg: { icon: "h-10 w-10", gem: "h-5 w-5", text: "text-lg" },
  };
  const s = sizes[size];

  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-md border border-border bg-foreground text-background",
          s.icon
        )}
      >
        <Gem className={s.gem} />
      </div>
      {showText && (
        <span className={cn("font-semibold tracking-tight text-foreground", s.text)}>
          Diamond<span className="text-muted-foreground">IQ</span>
        </span>
      )}
    </Link>
  );
}
