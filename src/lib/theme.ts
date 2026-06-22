/**
 * DiamondIQ Design System
 * Dark-first premium SaaS tokens — inspired by Stripe, Linear, Vercel, Mercury
 */

export const colors = {
  background: "#0B1020",
  foreground: "#F9FAFB",
  card: "#111827",
  cardForeground: "#F9FAFB",
  primary: "#2563EB",
  primaryForeground: "#FFFFFF",
  accent: "#06B6D4",
  accentForeground: "#FFFFFF",
  success: "#22C55E",
  warning: "#F59E0B",
  destructive: "#EF4444",
  muted: "#1A2332",
  mutedForeground: "#94A3B8",
  border: "#1E293B",
  sidebar: "#0A0F1A",
  sidebarForeground: "#94A3B8",
  sidebarActive: "rgba(37, 99, 235, 0.12)",
  chart: {
    primary: "#2563EB",
    accent: "#06B6D4",
    success: "#22C55E",
    grid: "#1E293B",
  },
} as const;

export const spacing = {
  xs: "0.25rem",   // 4px
  sm: "0.5rem",    // 8px
  md: "1rem",      // 16px
  lg: "1.5rem",    // 24px
  xl: "2rem",      // 32px
  "2xl": "3rem",   // 48px
  "3xl": "4rem",   // 64px
} as const;

export const radius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.25rem",
  full: "9999px",
} as const;

export const typography = {
  fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
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
  sm: "0 1px 2px rgba(0, 0, 0, 0.2)",
  md: "0 4px 24px rgba(0, 0, 0, 0.25)",
  lg: "0 8px 40px rgba(0, 0, 0, 0.35)",
  glow: "0 0 40px rgba(37, 99, 235, 0.15)",
  glowAccent: "0 0 60px rgba(6, 182, 212, 0.12)",
} as const;

export const animation = {
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
  spring: { type: "spring" as const, bounce: 0.2, duration: 0.4 },
} as const;

/** CSS custom property map for injection */
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
  "--radius-lg": radius.lg,
  "--radius-xl": radius.xl,
};
