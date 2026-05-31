import { useColorScheme } from "react-native";
import { theme, type SemanticTokens } from "@skillswap/ui/tokens";

/**
 * Mobile theme hook. Mirrors the web's semantic tokens (bg-background,
 * text-foreground, primary, credit, …) for the cases where NativeWind utility
 * classes aren't enough — inline styles, SVG fills, navigation chrome.
 *
 * Follows the OS color scheme, defaulting to light (the brand default) when the
 * scheme is unknown. NativeWind utilities (bg-paper, text-ink, bg-clay-500…)
 * remain the primary styling path; reach for this hook for dynamic values.
 */
export function useTheme(): { mode: "light" | "dark"; colors: SemanticTokens } {
  const scheme = useColorScheme();
  const mode = scheme === "dark" ? "dark" : "light";
  return { mode, colors: theme[mode] };
}
