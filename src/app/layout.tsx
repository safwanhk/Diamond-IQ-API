import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "DiamondIQ — Real-Time Diamond Valuation API",
  description:
    "Get real-time diamond valuations through one API. Financial-grade pricing for jewelry businesses, marketplaces, and insurers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${inter.variable}`}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              *,*::before,*::after{box-sizing:border-box}
              html{color-scheme:dark}
              body{margin:0;line-height:1.5;background-color:#0b1020;color:#f9fafb;font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif);-webkit-font-smoothing:antialiased}
              a{color:inherit;text-decoration:none}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
