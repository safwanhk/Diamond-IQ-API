/**
 * DiamondIQ Design System
 * Vercel-inspired tokens — monochrome, Geist, subtle borders
 */

export const colors = {
  background: "#000000",
  foreground: "#EDEDED",
  card: "#0A0A0A",
  cardForeground: "#EDEDED",
  primary: "#EDEDED",
  primaryForeground: "#000000",
  accent: "#0070F3",
  accentForeground: "#FFFFFF",
  success: "#50E3C2",
  warning: "#F5A623",
  destructive: "#EE0000",
  muted: "#171717",
  mutedForeground: "#888888",
  border: "#333333",
  sidebar: "#000000",
  sidebarForeground: "#888888",
  sidebarActive: "#171717",
  chart: {
    primary: "#0070F3",
    accent: "#50E3C2",
    success: "#50E3C2",
    grid: "#333333",
  },
} as const;

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
} as const;

export const radius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.625rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px",
} as const;

export const typography = {
  fontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
  fontMono: 'var(--font-geist-mono), ui-monospace, monospace',
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.1",
    normal: "1.5",
    relaxed: "1.625",
  },
} as const;

export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.4)",
  md: "0 4px 12px rgba(0, 0, 0, 0.5)",
  lg: "0 8px 24px rgba(0, 0, 0, 0.6)",
  glow: "0 0 0 1px #333333",
  glowAccent: "0 0 0 1px rgba(0, 112, 243, 0.4)",
} as const;

export const animation = {
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
  spring: { type: "spring" as const, bounce: 0.2, duration: 0.4 },
} as const;

export const cssVariables: Record<string, string> = {
  "--color-background": colors.background,
  "--color-foreground": colors.foreground,
  "--color-card": colors.card,
  "--color-card-foreground": colors.cardForeground,
  "--color-primary": colors.primary,
  "--color-primary-foreground": colors.primaryForeground,
  "--color-accent": colors.accent,
  "--color-accent-foreground": colors.accentForeground,
  "--color-success": colors.success,
  "--color-muted": colors.muted,
  "--color-muted-foreground": colors.mutedForeground,
  "--color-border": colors.border,
  "--color-sidebar": colors.sidebar,
  "--color-sidebar-foreground": colors.sidebarForeground,
  "--color-sidebar-active": colors.sidebarActive,
  "--color-destructive": colors.destructive,
  "--font-sans": typography.fontFamily,
  "--font-mono": typography.fontMono,
  "--radius-lg": radius.lg,
  "--radius-xl": radius.xl,
};
