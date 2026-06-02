# SkillSwap Design System — "Warm Craft / Editorial"

> Barter your knowledge. No money.
> The interface should feel **human, generous, and crafted** — the opposite of a
> cold fintech dashboard. We trade *time*, not cash, so the visual language is
> warm paper, characterful type, and a single confident accent.

**Version:** 1.0 · **Default mode:** Light (dark fully supported) · **Platforms:** Web (Next.js + Tailwind v4) and Mobile (Expo + NativeWind)

---

## 1. Principles

1. **Warm, never clinical.** Backgrounds are warm paper, not stark white; neutrals are *sand*, never cold gray; shadows are brown-tinted, never pure black.
2. **One action color.** Clay/terracotta carries every primary action. If everything is highlighted, nothing is. Gold and sage are reserved for *meaning* (credits, learning), not decoration.
3. **Time is the currency.** Credits always read as a warm gold "coin" via `CreditChip` — never styled like money (no `$`, no green "cash" semantics).
4. **Editorial type.** Headings are Fraunces (a characterful serif with optical sizing); body is Plus Jakarta Sans. We never ship Inter/Roboto/system as a brand face.
5. **Calm motion.** One orchestrated entrance per view (staggered rise-in) beats scattered micro-animations. Always honor `prefers-reduced-motion`.
6. **Accessible by default.** Target WCAG AA: ≥4.5:1 for text, visible brand-tinted focus rings, never color-only state.

---

## 2. Source-of-truth files

A token lives in **three** places that must agree. Change one, change all three.

| File | Platform | Holds |
|---|---|---|
| `packages/ui/src/styles/globals.css` | Web | OKLCH scales + semantic/brand CSS vars (light & dark), fonts, motion, base layer |
| `apps/mobile/global.css` | Mobile | NativeWind `@theme` mirror (hex) for utility generation |
| `packages/ui/src/tokens.ts` | Mobile (JS) | Hex palette + `theme.light`/`theme.dark` semantic maps for React Native styles |

**Rule of thumb:** in product code, always use **semantic** tokens (`bg-background`, `text-foreground`, `bg-primary`, `bg-credit`) — not raw scales (`bg-clay-600`). Raw scales exist only for one-off decorative accents.

---

## 3. Color

### 3.1 Brand scales (mode-independent)

| Scale | Meaning | Web utility | Anchor |
|---|---|---|---|
| **clay** | Action / "skills I can teach" | `bg-clay-*` | `clay-500` `#C25A3C` |
| **sage** | Learning / growth / "want to learn" | `bg-sage-*` | `sage-600` `#5B7A5A` |
| **gold** | Time-credit currency | `bg-gold-*` | `gold-500` `#D9A441` |
| **sand** | Warm neutral (paper → ink) | `bg-sand-*` | `sand-100` `#FBF7F0` |

### 3.2 Semantic tokens (use these)

Surfaces & text: `background` `foreground` · `card` / `card-foreground` · `popover` · `muted` / `muted-foreground` · `secondary` · `accent` · `border` · `input` · `ring`.

Actions & status: `primary` (=clay) · `destructive` · `success` · `warning` · `info`.

**Brand semantics (SkillSwap-specific):**

| Token | Use for | Example |
|---|---|---|
| `credit` / `credit-foreground` | Time-credits, balances, costs | `<CreditChip>` |
| `learn` / `learn-foreground` | "Skills I want to learn" tags | learner-side badges |
| `teach` / `teach-foreground` | "Skills I can teach" tags (aliases primary) | teacher-side badges |
| `trust` | Trust Score stars | `<TrustScore>` |
| `online` | "Live now" / available indicator | pulsing dot |

Every token has light + dark values defined; components reference the token and get both modes for free.

### 3.3 Do / Don't

- ✅ `className="bg-primary text-primary-foreground"` for the main CTA.
- ✅ `bg-learn/15 text-learn` for a "want to learn" tag (tint + readable text).
- ❌ Don't hardcode hex or use `bg-blue-600`, `text-neutral-900` — those bypass the theme (and the cold gray fights the brand).
- ❌ Don't use `success`/green for credits — credits are **gold**, deliberately not money-green.
- ❌ Don't paint large fills in gold; it's a coin accent, not a surface.

---

## 4. Typography

| Role | Family | Tailwind | Notes |
|---|---|---|---|
| Display / headings | **Fraunces** | `font-display` | Applied to `h1–h4` automatically; use `italic` for emotional emphasis ("knowledge.") |
| Body / UI | **Plus Jakarta Sans** | `font-sans` | Default on `body` |
| Numeric / code | **JetBrains Mono** | `font-mono` | Credits/scores use `tabular-nums`, not mono |

**Fluid display sizes** (clamp-based, set in `@theme inline`): `text-display-sm`, `text-display`, `text-display-lg` — use for hero/section headlines so they scale without breakpoints.

Conventions: headings `tracking-tight`; long lines `text-balance` (headings) / `text-pretty` (paragraphs); body copy on muted surfaces uses `text-muted-foreground`.

---

## 5. Shape, space, elevation

- **Radius:** base `--radius: 0.75rem`. Tailwind `rounded-md/lg/xl` derive from it; chips and avatars use `rounded-full`.
- **Spacing:** 4px grid (`spacing` token in `tokens.ts`; Tailwind default scale on web). Page padding `p-8`/`lg:p-10`; card gaps `gap-4`–`gap-6`.
- **Elevation:** warm brown-tinted shadows (`--shadow-sm/md/lg`). Cards rest flat or `shadow-sm`; only floating/hero elements use `shadow-lg`. Never `shadow-black`.

---

## 6. Motion

Defined in `globals.css @layer utilities`, all gated by `prefers-reduced-motion`.

| Utility | Use |
|---|---|
| `.animate-rise-in` | A single element entering (e.g. a card) |
| `.stagger` (on a parent) | Sequenced reveal of children — one orchestrated page-load moment |
| `.animate-pulse-ring` | "Online / live now" indicator |
| `.animate-coin-spin` | Credit earned/spent confirmation flourish |

Easing tokens: `--ease-out-soft` (entrances), `--ease-in-out-soft` (loops). Keep durations 0.2–0.6s. No bouncy springs in a trust-sensitive, learning context.

---

## 7. Canonical components

Import from `@skillswap/ui/components/*`. Base set is shadcn/Radix ("radix-nova" style) re-themed by the tokens above. SkillSwap adds:

### `<CreditChip>` — the time-credit currency
```tsx
<CreditChip>2</CreditChip>                 // ◷ 2 credits
<CreditChip delta="earn">1</CreditChip>    // ◷ +1   (teaching)
<CreditChip delta="spend">1</CreditChip>   // ◷ −1   (learning)
<CreditChip label="frozen" tone="muted">1</CreditChip> // reserved on accept
```
Use **everywhere** a credit appears: balances, session costs, transaction history, the welcome bonus. Never render a bare number for credits.

### `<TrustScore>` — the 1.0–5.0 composite
```tsx
<TrustScore value={4.7} count={23} />      // gold stars + "4.7 (23)"
<TrustScore value={4.7} showStars={false} /> // compact numeric
```
Always gold stars with fractional fill; always exposes an accessible label.

### `<ThemeProvider>` / `<ModeToggle>`
Wrap the app once in `ThemeProvider` (light default, system enabled). Drop `ModeToggle` in headers/sidebars.

### Mobile: `useTheme()` + NativeWind utilities
On mobile, style with NativeWind utility classes (`bg-paper`, `text-ink`, `bg-clay-500`, `text-sand-600`, `font-display`…). For dynamic values that can't be a class (SVG fills, navigation chrome, inline styles), use `useTheme()` from `apps/mobile/lib/theme` — it returns `{ mode, colors }` where `colors` is the semantic token map (`primary`, `credit`, `learn`…) for the current OS color scheme. Fonts are loaded in `app/_layout.tsx` via `expo-font` and registered under the `Fraunces` / `PlusJakartaSans` family names the `@theme` tokens expect.

---

## 8. Brand UI patterns (recipes)

**Skill tags** — distinguish the two sides of a swap by color:
- *Teach:* `bg-teach/10 border-teach/15 text-foreground`
- *Learn:* `bg-learn/15 text-learn dark:text-learn-foreground`

**Match score** — lead with the number in `text-foreground font-medium`, follow with the DeepSeek explanation in `text-muted-foreground` on a `bg-muted/60` panel.

**Session lifecycle states** — map states to status tokens (never color-only; pair with a label/icon):

| State | Token | Cue |
|---|---|---|
| Requested / pending | `warning` | "Awaiting teacher" |
| Accepted (credits frozen) | `credit` + `tone="muted"` | `CreditChip` "frozen" |
| Live now | `online` | pulsing dot + "live" |
| Completed / confirmed | `success` | check |
| Cancelled / no-show | `destructive` | penalty flag |
| Disputed | `destructive` (outline) | "under review" |

**Availability / timezone overlap** — sage highlights on a neutral week grid; the mutual window is `bg-sage/20`.

**Empty states** — warm and encouraging (Fraunces line + one `primary` CTA), reflecting the "teach first" nudge of the credit economy.

---

## 9. Accessibility checklist

- Text contrast ≥ 4.5:1 (≥3:1 for large display). The clay/sage/gold `*-foreground` pairs are tuned for this in both modes.
- Focus: rely on the brand-tinted `ring` (`focus-visible:ring-ring`) baked into base components — don't remove outlines.
- State is never color-only: pair every status color with an icon or text label.
- `CreditChip`/`TrustScore` carry `sr-only` / `title` text — keep it when composing.
- Respect `prefers-reduced-motion` (all motion utilities already do).

---

## 10. Adding a token (checklist)

1. Add the OKLCH var to **both** `:root` and `.dark` in `globals.css`, and expose it under `@theme inline` as `--color-<name>`.
2. Add the hex equivalent to `theme.light` **and** `theme.dark` in `tokens.ts` (plus a scale entry if it's a new ramp).
3. If mobile needs a utility class, mirror it in `apps/mobile/global.css`.
4. Document it in §3.2 here.
5. Run `pnpm typecheck` and a web build to confirm utilities resolve.
