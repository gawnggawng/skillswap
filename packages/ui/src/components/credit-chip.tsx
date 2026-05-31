import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@skillswap/ui/lib/utils"

/**
 * CreditChip — the canonical way to display time-credits anywhere in SkillSwap.
 * Credits are the product's currency; they always read as a warm gold "coin",
 * never as money. Use `+1` / `-1` deltas in flows (earn/spend) and a plain
 * balance on profiles.
 *
 *   <CreditChip>2</CreditChip>                 → "◷ 2 credits"
 *   <CreditChip delta="earn">1</CreditChip>    → "◷ +1"
 *   <CreditChip delta="spend">1</CreditChip>   → "◷ −1"
 *   <CreditChip label="frozen" tone="muted">1</CreditChip>
 */
const creditChipVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border font-medium whitespace-nowrap tabular-nums transition-colors",
  {
    variants: {
      tone: {
        gold: "border-credit/25 bg-credit/12 text-credit-foreground dark:text-credit",
        solid: "border-transparent bg-credit text-credit-foreground",
        muted: "border-border bg-muted text-muted-foreground",
      },
      size: {
        sm: "h-5 px-2 text-xs [&_svg]:size-3",
        md: "h-6 px-2.5 text-sm [&_svg]:size-3.5",
        lg: "h-7 px-3 text-base [&_svg]:size-4",
      },
    },
    defaultVariants: { tone: "gold", size: "md" },
  }
)

/** A simple, asset-free "time-credit" coin glyph (clock-in-circle). */
function CoinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 5v3l2 1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type CreditChipProps = React.ComponentProps<"span"> &
  VariantProps<typeof creditChipVariants> & {
    /** Number of credits (children). */
    children: React.ReactNode
    /** Show a signed delta instead of a balance. */
    delta?: "earn" | "spend"
    /** Trailing label, e.g. "credits", "frozen", "available". */
    label?: string
  }

function CreditChip({
  className,
  tone,
  size,
  children,
  delta,
  label,
  ...props
}: CreditChipProps) {
  const sign = delta === "earn" ? "+" : delta === "spend" ? "−" : ""

  return (
    <span
      data-slot="credit"
      data-delta={delta}
      className={cn(creditChipVariants({ tone, size }), className)}
      {...props}
    >
      <CoinIcon />
      <span>
        {sign}
        {children}
      </span>
      {label ? <span className="font-normal opacity-80">{label}</span> : null}
    </span>
  )
}

export { CreditChip, creditChipVariants, CoinIcon }
