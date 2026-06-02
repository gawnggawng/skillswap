import * as React from "react"
import { Star } from "lucide-react"

import { cn } from "@skillswap/ui/lib/utils"

/**
 * TrustScore — canonical display of the 1.0–5.0 composite Trust Score.
 * Shows gold stars (with fractional fill) plus the numeric value, per the
 * business spec ("Displayed visually on the profile: stars + numeric").
 *
 *   <TrustScore value={4.7} />
 *   <TrustScore value={4.7} count={23} size="lg" />
 *   <TrustScore value={4.7} showStars={false} />   → compact numeric pill
 */
type TrustScoreProps = React.ComponentProps<"span"> & {
  /** Composite score, 1.0–5.0. */
  value: number
  /** Optional number of reviews, shown as "(23)". */
  count?: number
  size?: "sm" | "md" | "lg"
  /** Hide the star row and show only the numeric badge. */
  showStars?: boolean
}

const sizeMap = {
  sm: { star: "size-3", text: "text-xs", gap: "gap-1" },
  md: { star: "size-3.5", text: "text-sm", gap: "gap-1.5" },
  lg: { star: "size-4", text: "text-base", gap: "gap-1.5" },
} as const

function TrustScore({
  value,
  count,
  size = "md",
  showStars = true,
  className,
  ...props
}: TrustScoreProps) {
  const clamped = Math.max(1, Math.min(5, value))
  const s = sizeMap[size]

  return (
    <span
      data-slot="trust-score"
      className={cn("inline-flex items-center tabular-nums", s.gap, s.text, className)}
      title={`Trust Score ${clamped.toFixed(1)} of 5`}
      {...props}
    >
      {showStars ? (
        <span className="inline-flex shrink-0 items-center gap-0.5" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => {
            const fill = Math.max(0, Math.min(1, clamped - i))
            return (
              <span
                key={i}
                className={cn("relative inline-flex shrink-0", s.star)}
              >
                <Star className={cn("size-full text-trust/25")} strokeWidth={1.5} />
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star
                    className="size-full text-trust"
                    fill="currentColor"
                    strokeWidth={1.5}
                  />
                </span>
              </span>
            )
          })}
        </span>
      ) : null}
      <span className="font-semibold">{clamped.toFixed(1)}</span>
      {typeof count === "number" ? (
        <span className="font-normal text-muted-foreground">({count})</span>
      ) : null}
      <span className="sr-only">Trust Score {clamped.toFixed(1)} out of 5</span>
    </span>
  )
}

export { TrustScore }
