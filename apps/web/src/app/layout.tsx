import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ApiProvider } from "@skillswap/api";
import { TooltipProvider } from "@skillswap/ui/components/tooltip";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={`${inter.className} bg-neutral-50 text-neutral-900 antialiased`}>
        <ApiProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ApiProvider>
      </body>
    </html>
  );
}
