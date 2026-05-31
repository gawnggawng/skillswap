import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ApiProvider } from "@skillswap/api";
import { ThemeProvider } from "@skillswap/ui/components/theme-provider";
import { TooltipProvider } from "@skillswap/ui/components/tooltip";
import "./globals.css";

/* Editorial display serif — feeds --font-display (see globals.css @theme). */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

/* Humanist body sans — feeds --font-sans. */
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkillSwap — Barter your knowledge",
  description:
    "A community marketplace where people exchange knowledge using only time-credits, never money.",
  manifest: "/manifest.webmanifest",
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
      className={`${fraunces.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <ThemeProvider>
          <ApiProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ApiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
