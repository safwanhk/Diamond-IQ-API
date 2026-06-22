import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: "h-7 w-7", text: "text-sm" },
    md: { icon: "h-8 w-8", text: "text-base" },
    lg: { icon: "h-10 w-10", text: "text-lg" },
  };
  const s = sizes[size];

  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-md bg-gradient-to-br from-[#C9A227] to-[#8B6914] font-bold text-black shadow-lg shadow-[#C9A227]/20",
          s.icon
        )}
      >
        <span className="text-xs font-black tracking-tighter">LX</span>
      </div>
      {showText && (
        <span className={cn("font-semibold tracking-tight text-foreground", s.text)}>
          Luxora<span className="text-[#C9A227]">API</span>
        </span>
      )}
    </Link>
  );
}
