import Link from "next/link";
import { Gem } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Gem className="h-4 w-4" />
          </div>
          DiamondIQ
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/docs" className="text-sm text-slate-600 hover:text-slate-900">
            Documentation
          </Link>
          <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900">
            Pricing
          </Link>
          <Link href="/playground" className="text-sm text-slate-600 hover:text-slate-900">
            Playground
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get API Key</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
