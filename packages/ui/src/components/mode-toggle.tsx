"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@skillswap/ui/components/button"

/**
 * Light/dark toggle. Crossfades a sun/moon with the brand's soft easing.
 * Renders a stable placeholder until mounted to avoid a hydration mismatch.
 */
function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? (
        isDark ? <Moon /> : <Sun />
      ) : (
        <Sun className="opacity-0" />
      )}
    </Button>
  )
}

export { ModeToggle }
