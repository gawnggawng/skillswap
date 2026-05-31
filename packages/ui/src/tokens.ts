/**
 * SkillSwap design tokens — "Warm Craft / Editorial".
 *
 * Single source of truth for React Native / Expo, where the web's OKLCH CSS
 * variables don't cascade. These hex values mirror packages/ui/styles/globals.css
 * and apps/mobile/global.css — if you change a brand color, change all three.
 *
 * In product code prefer the semantic `theme.light` / `theme.dark` maps over raw
 * scales, exactly like you'd prefer `bg-primary` over `bg-clay-600` on the web.
 */

/* ── Brand scales (mode-independent) ──────────────────────────────────────── */
export const palette = {
  /** Clay / terracotta — action, "skills I can teach". */
  clay: {
    50: "#FAEEE8", 100: "#F2D9CD", 200: "#E6B8A4", 300: "#D8927A",
    400: "#CB7253", 500: "#C25A3C", 600: "#AC4F35", 700: "#8F4530",
    800: "#733A2B", 900: "#5F3326", 950: "#3B2018",
  },
  /** Sage — learning, growth, "skills I want to learn". */
  sage: {
    50: "#EDF2EC", 100: "#D9E3D7", 200: "#BACBB7", 300: "#97AF93",
    400: "#76926F", 500: "#5B7A5A", 600: "#4F6B4E", 700: "#425843",
    800: "#364738", 900: "#2D3B2F", 950: "#1C261E",
  },
  /** Gold — the time-credit currency. Use sparingly, like a coin. */
  gold: {
    50: "#FBF3DF", 100: "#F6E6BC", 200: "#EFD08A", 300: "#E7BB5E",
    400: "#DEAC4C", 500: "#D9A441", 600: "#C08C30", 700: "#9E7128",
    800: "#7C5822", 900: "#66481F", 950: "#3F2C12",
  },
  /** Sand — warm neutral ramp (paper → ink). Replaces cold gray. */
  sand: {
    50: "#FBF8F3", 100: "#FBF7F0", 200: "#ECE6DC", 300: "#DDD5C8",
    400: "#B4A99A", 500: "#8C8275", 600: "#6E6559", 700: "#574F46",
    800: "#3E382F", 900: "#2B2620", 950: "#1A1712",
  },
} as const;

/* ── Semantic tokens (mode-aware) — match globals.css names ───────────────── */
export const theme = {
  light: {
    background: palette.sand[100],
    foreground: "#21201C",
    card: "#FFFDFA",
    cardForeground: "#21201C",
    primary: palette.clay[500],
    primaryForeground: "#FFFDFA",
    secondary: palette.sand[200],
    secondaryForeground: palette.sand[800],
    muted: "#F4EFE7",
    mutedForeground: palette.sand[600],
    accent: "#EFEAE0",
    accentForeground: palette.sand[800],
    border: "#E7E0D4",
    input: "#E7E0D4",
    ring: palette.clay[500],
    destructive: "#C2473A",
    destructiveForeground: "#FFFDFA",
    // brand concepts
    credit: palette.gold[600],
    creditForeground: palette.gold[950],
    learn: palette.sage[600],
    learnForeground: "#FFFDFA",
    teach: palette.clay[500],
    teachForeground: "#FFFDFA",
    trust: palette.gold[600],
    online: "#5C9A5E",
    success: "#4F8A5A",
    warning: palette.gold[500],
    info: "#5B7FB8",
  },
  dark: {
    background: "#16140F",
    foreground: "#EDE8DE",
    card: "#211E18",
    cardForeground: "#EDE8DE",
    primary: palette.clay[400],
    primaryForeground: "#1A1712",
    secondary: "#2C2820",
    secondaryForeground: "#EDE8DE",
    muted: "#272320",
    mutedForeground: "#A89E8E",
    accent: "#322D26",
    accentForeground: "#EDE8DE",
    border: "rgba(255,255,255,0.10)",
    input: "rgba(255,255,255,0.14)",
    ring: palette.clay[400],
    destructive: "#D85A4B",
    destructiveForeground: "#FFFDFA",
    credit: palette.gold[300],
    creditForeground: "#1A1712",
    learn: palette.sage[300],
    learnForeground: "#16140F",
    teach: palette.clay[400],
    teachForeground: "#1A1712",
    trust: palette.gold[300],
    online: "#7BB87D",
    success: "#6FB073",
    warning: palette.gold[400],
    info: "#7B9FD8",
  },
} as const;

/* ── Shape, space, type — shared by both platforms ────────────────────────── */
export const spacing = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24,
  8: 32, 10: 40, 12: 48, 16: 64, 20: 80, 24: 96,
} as const;

export const radii = {
  none: 0, sm: 8, md: 10, lg: 12, xl: 16, "2xl": 20, full: 9999,
} as const;

export const shadows = {
  // Warm-tinted elevation — brown, never neutral black.
  sm: "0 1px 3px rgba(28,22,14,0.10)",
  md: "0 6px 12px rgba(28,22,14,0.12)",
  lg: "0 16px 28px rgba(28,22,14,0.16)",
} as const;

export const typography = {
  fontFamily: {
    /** Fraunces — editorial display serif (load via expo-font on mobile). */
    display: "Fraunces",
    /** Plus Jakarta Sans — humanist body sans. */
    sans: "PlusJakartaSans",
    mono: "JetBrainsMono",
  },
  fontSize: {
    xs: 12, sm: 14, base: 16, lg: 18, xl: 20,
    "2xl": 24, "3xl": 30, "4xl": 36, "5xl": 48,
  },
  lineHeight: { tight: 1.15, snug: 1.3, normal: 1.5, relaxed: 1.65 },
  letterSpacing: { tight: -0.4, normal: 0, wide: 0.4 },
} as const;

export type ThemeMode = keyof typeof theme;
/** Widened so both `theme.light` and `theme.dark` are assignable (the `as const`
 *  literal hex types differ between modes). */
export type SemanticTokens = Record<keyof typeof theme.light, string>;

/** Back-compat alias: existing imports of `colors` still resolve. */
export const colors = {
  primary: palette.clay,
  neutral: palette.sand,
  success: theme.light.success,
  warning: theme.light.warning,
  danger: theme.light.destructive,
  info: theme.light.info,
} as const;
