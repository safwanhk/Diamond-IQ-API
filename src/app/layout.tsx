import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxora API — Luxury Asset Intelligence Platform",
  description:
    "Real-time valuation, pricing intelligence, and market analytics for diamonds, gold, and luxury watches. The Bloomberg for luxury assets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              *,*::before,*::after{box-sizing:border-box}
              html{color-scheme:dark}
              body{margin:0;line-height:1.5;background-color:#000;color:#ededed;font-family:var(--font-geist-sans,ui-sans-serif,system-ui,sans-serif);-webkit-font-smoothing:antialiased}
              a{color:inherit;text-decoration:none}
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background font-sans text-foreground antialiased"
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
