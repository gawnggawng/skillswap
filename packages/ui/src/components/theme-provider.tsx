"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * App-wide theme provider. Light is the default (per brand decision); users can
 * switch to dark or follow the system. Wrap the app once, high in the tree.
 *
 * Requires `suppressHydrationWarning` on <html> because next-themes sets the
 * class before React hydrates.
 */
function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

export { ThemeProvider }
