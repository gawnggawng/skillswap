# SkillSwap Development Guide

## Quick Commands

```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps
pnpm lint         # Run linting across all packages
pnpm typecheck    # Run TypeScript type checking
pnpm test         # Run tests
pnpm clean        # Clean all build outputs
```

## Project Structure

```
skillswap/
├── apps/web/        # Next.js 16 (App Router) - Web app + API + PWA
├── apps/mobile/     # Expo 54 (Expo Router) - iOS + Android
├── packages/types/  # Shared TypeScript interfaces
├── packages/api/    # Shared API client + React Query hooks
├── packages/db/     # Prisma schema, migrations, client
├── packages/ui/     # Design tokens
└── trigger/         # Trigger.dev background jobs
```

## Tech Stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Language:** TypeScript 5.9
- **Web:** Next.js 16, React 19, Tailwind CSS 4, shadcn/ui
- **Mobile:** Expo 54, Expo Router, NativeWind 4
- **Database:** PostgreSQL (Neon) + Prisma 6
- **Cache:** Upstash Redis
- **Auth:** NextAuth.js v5
- **Video:** LiveKit
- **AI:** DeepSeek API
- **Jobs:** Trigger.dev

## Development Workflow

1. `pnpm install` — Install all dependencies
2. Copy `.env.example` to `.env` and fill in values
3. `pnpm --filter @skillswap/db exec prisma db push` — Set up local database
4. `pnpm dev` — Start web + mobile + trigger dev servers
5. Visit http://localhost:3000 for the web app

## Testing

```bash
pnpm test          # Unit tests (Vitest)
pnpm test:e2e      # E2E tests (Playwright)
```

## Type Checking

```bash
pnpm typecheck     # Runs across all packages via Turborepo
```

## Linting

```bash
pnpm lint          # Runs across all packages via Turborepo
```
