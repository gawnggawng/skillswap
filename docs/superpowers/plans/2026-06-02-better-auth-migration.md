# Better Auth Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace NextAuth.js v5 with Better Auth as the self-hosted (internal, no auth-vendor API key) authentication system for both the Next.js 16 web app and the Expo 54 mobile app, sharing one REST API, with welcome-credits granted atomically on signup.

**Architecture:** Better Auth runs as a library inside `apps/web`, writing sessions/accounts directly into the existing Neon Postgres via the Prisma adapter. Web authenticates via a signed session cookie (sent automatically same-origin); mobile authenticates via the `bearer` plugin sending `Authorization: Bearer <session.token>` from `expo-secure-store` — matching the existing `@skillswap/api` client contract. Social login (Google/GitHub) and email/password are enabled. A `databaseHooks.user.create.after` hook grants the 2 welcome credits with a `CreditTransaction` audit row.

**Tech Stack:** `better-auth` (core + `adapters/prisma`, `plugins` bearer, `react`, `next-js`), `@better-auth/expo` (server `expo()` plugin + client `expoClient`), Prisma/Postgres, Next.js 16 App Router, Expo Router, Vitest.

---

## Architecture Decisions (locked)

1. **Transport:** Web = session cookie (same-origin, automatic). Mobile = `bearer` plugin; the bearer token **is** `session.token`. We capture it from the `set-auth-token` response header on sign-in and persist it in SecureStore under the existing key `"sessionToken"`, so the current `setTokenProvider` in `@skillswap/api/client` keeps working unchanged.
2. **IDs:** Keep the repo's `@default(cuid())` on auth tables and set `advanced.database.generateId: false` so Prisma generates IDs (matches `AGENTS.md`).
3. **User table reuse:** Keep the rich `User` model and its relations. Adapt only what Better Auth requires: `emailVerified` becomes `Boolean`, map Better Auth's `image` field onto the existing `avatar` column via config, add a `role` column. All other columns (`creditBalance`, `trustScore`, `timezone`, `bio`) stay and must keep DB defaults / be nullable so Better Auth inserts succeed.
4. **Credits correctness:** Change `User.creditBalance` default from `2` → `0` and grant the 2 welcome credits in the create-hook via `grantWelcomeCredits`, which we make **idempotent** (per `AGENTS.md`: every credit change is a `CreditTransaction` append + balance update in one `$transaction`; jobs/hooks can fire twice).
5. **Env var names:** Switch to Better Auth conventions: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`.

## File Structure Map

**Create:**
- `apps/web/src/app/api/auth/[...all]/route.ts` — Better Auth catch-all handler
- `apps/web/src/lib/auth-client.ts` — web React client (`createAuthClient`)
- `apps/web/src/lib/session.ts` — `getCurrentUser` / `requireUser` server helpers
- `apps/web/.env.local` — real secrets (gitignored)
- `apps/mobile/lib/auth-client.ts` — Expo auth client
- `packages/core/vitest.config.ts` + `packages/core/src/credits.test.ts` — welcome-credits idempotency test

**Modify:**
- `packages/db/prisma/schema.prisma` — adapt `User`, replace `Account`/`Session`, add `Verification`, drop `VerificationToken`
- `packages/core/src/credits.ts:92-106` — make `grantWelcomeCredits` idempotent
- `apps/web/src/lib/auth.ts` — Better Auth server instance
- `apps/web/src/proxy.ts` — cookie-based route guard
- `apps/web/src/app/(auth)/login/page.tsx` — client component using `authClient`
- `apps/web/src/app/(auth)/signup/page.tsx` — client component using `authClient`
- `apps/web/src/app/(dashboard)/layout.tsx` — real credit balance from session
- `apps/web/package.json` — swap deps
- `apps/mobile/app/_layout.tsx` — keep `setTokenProvider`; no NextAuth
- `apps/mobile/app/(auth)/login.tsx` + `apps/mobile/app/(auth)/signup.tsx` — use `authClient`
- `apps/mobile/package.json` — add deps
- `.env.example` — rename keys
- `turbo.json` — update `globalEnv`

**Delete:**
- `apps/web/src/app/api/auth/[...nextauth]/route.ts`
- `apps/web/src/app/api/auth/session/route.ts`

---

## Task 1: Swap dependencies

**Files:**
- Modify: `apps/web/package.json`
- Modify: `apps/mobile/package.json`

- [ ] **Step 1: Remove NextAuth, add Better Auth in web**

Run:
```bash
pnpm --filter @skillswap/web remove next-auth @auth/prisma-adapter
pnpm --filter @skillswap/web add better-auth @better-auth/expo
```

- [ ] **Step 2: Add Better Auth + required Expo runtime deps in mobile**

Run:
```bash
pnpm --filter @skillswap/mobile add better-auth @better-auth/expo expo-network expo-web-browser expo-linking expo-constants
```
(`expo-secure-store` is already a dependency.)

- [ ] **Step 3: Verify install**

Run: `pnpm install`
Expected: completes with no peer-dependency errors; `better-auth` appears in both app `package.json` files.

- [ ] **Step 4: Commit**

```bash
git add apps/web/package.json apps/mobile/package.json pnpm-lock.yaml
git commit -m "chore(auth): swap next-auth for better-auth dependencies"
```

---

## Task 2: Environment variables

**Files:**
- Modify: `.env.example`
- Modify: `turbo.json:4-25`
- Create: `apps/web/.env.local`

- [ ] **Step 1: Update `.env.example` auth keys**

Replace lines 5-10 of `.env.example`:
```bash
# Auth (Better Auth)
BETTER_AUTH_SECRET="change-me-to-a-random-string"
BETTER_AUTH_URL="http://localhost:4000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

- [ ] **Step 2: Update `turbo.json` `globalEnv`**

In `turbo.json`, replace the auth entries (`AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`) with:
```json
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
```

- [ ] **Step 3: Create `apps/web/.env.local` with real values**

Next.js loads env from the app directory, so this MUST live in `apps/web/`, not the repo root.
```bash
DATABASE_URL="<copy from packages/db/.env.local DATABASE_URL>"
BETTER_AUTH_SECRET="<openssl rand -base64 32>"
BETTER_AUTH_URL="http://localhost:4000"
GOOGLE_CLIENT_ID="<from Google Cloud Console>"
GOOGLE_CLIENT_SECRET="<from Google Cloud Console>"
GITHUB_CLIENT_ID="<from GitHub OAuth App>"
GITHUB_CLIENT_SECRET="<from GitHub OAuth App>"
NEXT_PUBLIC_APP_URL="http://localhost:4000"
```
Generate the secret:
```bash
openssl rand -base64 32
```
OAuth redirect URIs to register:
- Google: `http://localhost:4000/api/auth/callback/google`
- GitHub: `http://localhost:4000/api/auth/callback/github`

- [ ] **Step 4: Verify `.env.local` is gitignored**

Run: `git check-ignore apps/web/.env.local`
Expected: prints the path (it is ignored). If it prints nothing, add `**/.env.local` to `.gitignore`.

- [ ] **Step 5: Commit (keys only — never the values)**

```bash
git add .env.example turbo.json
git commit -m "chore(auth): use Better Auth env var names"
```

---

## Task 3: Prisma schema — adapt auth models

**Files:**
- Modify: `packages/db/prisma/schema.prisma:47-113`

- [ ] **Step 1: Update the `User` model**

Replace the head of the `User` model (lines 47-58) so `emailVerified` is a Boolean, `avatar` is the mapped image column, `creditBalance` defaults to 0, and a `role` column exists:
```prisma
model User {
  id                 String    @id @default(cuid())
  email              String    @unique
  emailVerified      Boolean   @default(false)
  name               String?
  avatar             String?                   @db.VarChar(500)
  bio                String?                   @db.VarChar(500)
  timezone           String    @default("UTC")
  creditBalance      Int       @default(0)
  trustScore         Float     @default(3.0)
  role               String    @default("user")
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
```
Leave the relations block (lines 60-76) unchanged, including `accounts Account[]` and `sessions Session[]`.

- [ ] **Step 2: Replace the `Account` model (lines 79-95) with Better Auth's shape**

```prisma
model Account {
  id                    String    @id @default(cuid())
  userId                String
  accountId             String
  providerId            String
  accessToken           String?   @db.Text
  refreshToken          String?   @db.Text
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  idToken               String?   @db.Text
  password              String?   @db.Text
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
  @@index([userId])
}
```

- [ ] **Step 3: Replace the `Session` model (lines 97-105) with Better Auth's shape**

```prisma
model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?  @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

- [ ] **Step 4: Replace `VerificationToken` (lines 107-113) with `Verification`**

```prisma
model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String   @db.Text
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
}
```

- [ ] **Step 5: Validate the schema**

Run: `pnpm --filter @skillswap/db exec prisma validate`
Expected: `The schema at packages/db/prisma/schema.prisma is valid 🚀`

- [ ] **Step 6: Generate the migration and client**

Run:
```bash
cp .env apps/web/.env.local 2>/dev/null; cp packages/db/.env.local packages/db/.env 2>/dev/null
pnpm --filter @skillswap/db exec prisma migrate dev --name better-auth
```
Expected: a new migration is created under `packages/db/prisma/migrations/` and applied; Prisma Client regenerates. (Dev DB data in the old auth tables is dropped — acceptable pre-MVP.)

- [ ] **Step 7: Commit**

```bash
git add packages/db/prisma/schema.prisma packages/db/prisma/migrations
git commit -m "feat(db): adapt auth models to Better Auth schema"
```

---

## Task 4: Make `grantWelcomeCredits` idempotent (TDD)

**Files:**
- Create: `packages/core/vitest.config.ts`
- Create: `packages/core/src/credits.test.ts`
- Modify: `packages/core/src/credits.ts:92-106`
- Modify: `packages/core/package.json`

- [ ] **Step 1: Add Vitest to `@skillswap/core`**

Run:
```bash
pnpm --filter @skillswap/core add -D vitest
```
Then add a `test` script to `packages/core/package.json` `scripts`:
```json
    "test": "vitest run"
```

- [ ] **Step 2: Create the Vitest config**

Create `packages/core/vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
});
```

- [ ] **Step 3: Write the failing test**

Create `packages/core/src/credits.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const transaction = vi.fn();
const findFirst = vi.fn();

vi.mock("@skillswap/db", () => ({
  db: {
    $transaction: (...args: unknown[]) => transaction(...args),
    creditTransaction: { findFirst: (...args: unknown[]) => findFirst(...args) },
    user: { update: vi.fn() },
  },
  Prisma: {},
}));

import { grantWelcomeCredits } from "./credits";

describe("grantWelcomeCredits", () => {
  beforeEach(() => {
    transaction.mockReset();
    findFirst.mockReset();
  });

  it("grants credits the first time", async () => {
    findFirst.mockResolvedValue(null);
    await grantWelcomeCredits("user-1");
    expect(transaction).toHaveBeenCalledTimes(1);
  });

  it("is a no-op if a WELCOME transaction already exists", async () => {
    findFirst.mockResolvedValue({ id: "txn-1" });
    await grantWelcomeCredits("user-1");
    expect(transaction).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `pnpm --filter @skillswap/core test`
Expected: FAIL — the second test fails because the current implementation always calls `$transaction`.

- [ ] **Step 5: Make `grantWelcomeCredits` idempotent**

Replace lines 92-106 of `packages/core/src/credits.ts`:
```ts
export const grantWelcomeCredits = async (userId: string): Promise<void> => {
  const existing = await db.creditTransaction.findFirst({
    where: { userId, type: "WELCOME" },
    select: { id: true },
  });
  if (existing) return;

  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { creditBalance: { increment: WELCOME_CREDITS } },
    }),
    db.creditTransaction.create({
      data: {
        userId,
        amount: WELCOME_CREDITS,
        type: "WELCOME",
      },
    }),
  ]);
};
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `pnpm --filter @skillswap/core test`
Expected: PASS (2 passing).

- [ ] **Step 7: Commit**

```bash
git add packages/core/package.json packages/core/vitest.config.ts packages/core/src/credits.ts packages/core/src/credits.test.ts pnpm-lock.yaml
git commit -m "feat(core): make grantWelcomeCredits idempotent with tests"
```

---

## Task 5: Better Auth server instance

**Files:**
- Modify: `apps/web/src/lib/auth.ts` (full rewrite)

- [ ] **Step 1: Rewrite `apps/web/src/lib/auth.ts`**

```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { expo } from "@better-auth/expo";
import { db } from "@skillswap/db";
import { grantWelcomeCredits } from "@skillswap/core/credits";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  advanced: {
    database: { generateId: false },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  user: {
    fields: { image: "avatar" },
    additionalFields: {
      role: { type: "string", input: false, defaultValue: "user" },
    },
  },
  trustedOrigins: [
    "skillswap://",
    "skillswap://*",
    ...(process.env.NODE_ENV === "development"
      ? ["exp://", "exp://*"]
      : []),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await grantWelcomeCredits(user.id);
        },
      },
    },
  },
  plugins: [expo(), bearer(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
```
Notes for the engineer: `nextCookies()` **must be last** in `plugins`. `@skillswap/core/credits` is the package subpath that exports `grantWelcomeCredits` (the web `@/lib/credits` re-exports the same). `image → avatar` mapping reuses the existing column.

- [ ] **Step 2: Typecheck the web app**

Run: `pnpm --filter @skillswap/web typecheck`
Expected: no errors referencing `auth.ts`. (Errors will remain in files that still import the old `handlers`/`signIn`/`auth()` — fixed in Tasks 6-9.)

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/lib/auth.ts
git commit -m "feat(auth): add Better Auth server instance with welcome-credit hook"
```

---

## Task 6: Route handler + delete NextAuth routes

**Files:**
- Create: `apps/web/src/app/api/auth/[...all]/route.ts`
- Delete: `apps/web/src/app/api/auth/[...nextauth]/route.ts`
- Delete: `apps/web/src/app/api/auth/session/route.ts`

- [ ] **Step 1: Create the catch-all handler**

`apps/web/src/app/api/auth/[...all]/route.ts`:
```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

- [ ] **Step 2: Delete the old routes**

Run:
```bash
rm apps/web/src/app/api/auth/[...nextauth]/route.ts
rm apps/web/src/app/api/auth/session/route.ts
rmdir "apps/web/src/app/api/auth/[...nextauth]"
```

- [ ] **Step 3: Verify no stale imports remain**

Run: `git grep -n "nextauth\|from \"@/lib/auth\"" -- apps/web/src`
Expected: remaining hits are only `proxy.ts`, `login/page.tsx` (fixed in Task 7-8), and `auth.ts` itself. No reference to a deleted `session/route.ts` or `[...nextauth]`.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/api/auth
git commit -m "feat(auth): mount Better Auth handler, remove NextAuth routes"
```

---

## Task 7: Route protection (`proxy.ts`)

**Files:**
- Modify: `apps/web/src/proxy.ts` (full rewrite)

- [ ] **Step 1: Rewrite `apps/web/src/proxy.ts`**

Better Auth doesn't wrap the proxy; use an optimistic cookie check for the redirect (real validation happens server-side in route handlers via `getSession`).
```ts
import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    const sessionCookie = getSessionCookie(req);
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
```
Note: file stays named `proxy.ts` (the Next.js 16 convention) with a default export, which the runtime accepts.

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @skillswap/web typecheck`
Expected: no errors in `proxy.ts`.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/proxy.ts
git commit -m "feat(auth): guard dashboard/admin via Better Auth session cookie"
```

---

## Task 8: Web auth client + login/signup pages

**Files:**
- Create: `apps/web/src/lib/auth-client.ts`
- Modify: `apps/web/src/app/(auth)/login/page.tsx` (full rewrite)
- Modify: `apps/web/src/app/(auth)/signup/page.tsx` (full rewrite)

- [ ] **Step 1: Create the web auth client**

`apps/web/src/lib/auth-client.ts`:
```ts
"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
```

- [ ] **Step 2: Rewrite the login page as a client component**

`apps/web/src/app/(auth)/login/page.tsx`:
```tsx
"use client";

import Link from "next/link";
import { Button } from "@skillswap/ui/components/button";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-muted-foreground">
          Sign in to your SkillSwap account
        </p>
      </div>
      <div className="space-y-3">
        <Button
          variant="outline"
          size="lg"
          className="h-11 w-full"
          onClick={() =>
            authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })
          }
        >
          Continue with Google
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-11 w-full"
          onClick={() =>
            authClient.signIn.social({ provider: "github", callbackURL: "/dashboard" })
          }
        >
          Continue with GitHub
        </Button>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        No account yet?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Rewrite the signup page as a client component**

`apps/web/src/app/(auth)/signup/page.tsx`:
```tsx
"use client";

import Link from "next/link";
import { Button } from "@skillswap/ui/components/button";
import { CreditChip } from "@skillswap/ui/components/credit-chip";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-muted-foreground">
          Start with <CreditChip delta="earn" size="sm">2</CreditChip> free
          credits. Teach a session to earn more.
        </p>
      </div>
      <div className="space-y-3">
        <Button
          variant="outline"
          size="lg"
          className="h-11 w-full"
          onClick={() =>
            authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })
          }
        >
          Continue with Google
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-11 w-full"
          onClick={() =>
            authClient.signIn.social({ provider: "github", callbackURL: "/dashboard" })
          }
        >
          Continue with GitHub
        </Button>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
```
Note: social sign-in creates the user on first login, which fires the welcome-credit hook — so OAuth signup and login share one path.

- [ ] **Step 4: Typecheck**

Run: `pnpm --filter @skillswap/web typecheck`
Expected: no errors in the `(auth)` pages or `auth-client.ts`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/auth-client.ts "apps/web/src/app/(auth)"
git commit -m "feat(auth): wire web login/signup to Better Auth client"
```

---

## Task 9: Server session helpers + real credit balance

**Files:**
- Create: `apps/web/src/lib/session.ts`
- Modify: `apps/web/src/app/(dashboard)/layout.tsx`

- [ ] **Step 1: Create server session helpers**

`apps/web/src/lib/session.ts`:
```ts
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
};

export const requireUser = async (req: Request) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    throw new Response(
      JSON.stringify({ error: { code: "UNAUTHENTICATED", message: "Sign in required" } }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  return session.user;
};
```
Note: `requireUser` works for both web (cookie in `req.headers`) and mobile (`Authorization: Bearer <token>` via the bearer plugin). Future protected `/api/*` route handlers should call it.

- [ ] **Step 2: Wire the dashboard sidebar credit chip to the real balance**

Replace `apps/web/src/app/(dashboard)/layout.tsx` lines 1-17 head with imports + data fetch, and the hardcoded chip on line 44. Full file:
```tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Sparkles, Video, UserRound } from "lucide-react";
import { CreditChip } from "@skillswap/ui/components/credit-chip";
import { ModeToggle } from "@skillswap/ui/components/mode-toggle";
import { db } from "@skillswap/db";
import { getCurrentUser } from "@/lib/session";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/matches", label: "Find matches", icon: Sparkles },
  { href: "/sessions", label: "My sessions", icon: Video },
  { href: "/profile", label: "Profile & skills", icon: UserRound },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const dbUser = await db.user.findUniqueOrThrow({
    where: { id: user.id },
    select: { creditBalance: true },
  });

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col border-r border-sidebar-border bg-sidebar p-5 text-sidebar-foreground">
        <Link
          href="/dashboard"
          className="px-2 font-display text-xl font-semibold tracking-tight"
        >
          Skill<span className="text-primary">Swap</span>
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Icon className="size-4.5" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 flex items-center justify-between rounded-xl border bg-card p-3">
          <div>
            <p className="text-xs text-muted-foreground">Your balance</p>
            <CreditChip label="credits" className="mt-1">
              {dbUser.creditBalance}
            </CreditChip>
          </div>
          <ModeToggle />
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-10">{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter @skillswap/web typecheck`
Expected: clean (the whole web app now typechecks against Better Auth).

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/lib/session.ts "apps/web/src/app/(dashboard)/layout.tsx"
git commit -m "feat(auth): add server session helpers and live credit balance"
```

---

## Task 10: Mobile auth client + screens

**Files:**
- Create: `apps/mobile/lib/auth-client.ts`
- Modify: `apps/mobile/app/(auth)/login.tsx` (full rewrite)
- Modify: `apps/mobile/app/(auth)/signup.tsx` (full rewrite)
- Modify: `apps/mobile/app/_layout.tsx` (no change needed if `setTokenProvider` already reads `"sessionToken"`; verify)

- [ ] **Step 1: Create the Expo auth client**

`apps/mobile/lib/auth-client.ts`. It uses the `expoClient` for deep-link OAuth + secure storage, and captures the bearer `set-auth-token` header into SecureStore key `"sessionToken"` so the shared `@skillswap/api` client (which sends `Authorization: Bearer`) keeps working.
```ts
import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { saveToken } from "./secure-store";

const API_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ||
  process.env.EXPO_PUBLIC_API_URL ||
  "http://localhost:4000";

export const authClient = createAuthClient({
  baseURL: API_URL,
  fetchOptions: {
    onSuccess: async (ctx) => {
      const token = ctx.response.headers.get("set-auth-token");
      if (token) {
        await saveToken(token);
      }
    },
  },
  plugins: [
    expoClient({
      scheme: "skillswap",
      storagePrefix: "skillswap",
      storage: SecureStore,
    }),
  ],
});
```

- [ ] **Step 2: Rewrite the mobile login screen**

`apps/mobile/app/(auth)/login.tsx`:
```tsx
import { View, Text, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import { authClient } from "../../lib/auth-client";

export default function LoginScreen() {
  const router = useRouter();

  const signInWith = async (provider: "google" | "github") => {
    await authClient.signIn.social({ provider, callbackURL: "/dashboard" });
    router.replace("/(tabs)/dashboard");
  };

  return (
    <View className="flex-1 justify-center bg-paper px-8">
      <Text className="font-display text-2xl font-bold text-ink">
        Welcome back
      </Text>
      <Text className="mt-1 text-sand-600">
        Sign in to your SkillSwap account
      </Text>
      <View className="mt-8 gap-3">
        <Pressable
          onPress={() => signInWith("google")}
          className="w-full rounded-xl border border-sand-300 py-4 active:bg-sand-200"
        >
          <Text className="text-center font-semibold text-sand-700">
            Continue with Google
          </Text>
        </Pressable>
        <Pressable
          onPress={() => signInWith("github")}
          className="w-full rounded-xl border border-sand-300 py-4 active:bg-sand-200"
        >
          <Text className="text-center font-semibold text-sand-700">
            Continue with GitHub
          </Text>
        </Pressable>
      </View>
      <Text className="mt-6 text-center text-sm text-sand-500">
        No account yet?{" "}
        <Link href="/signup">
          <Text className="font-semibold text-clay-600">Sign up</Text>
        </Link>
      </Text>
    </View>
  );
}
```

- [ ] **Step 3: Rewrite the mobile signup screen to mirror login**

Open `apps/mobile/app/(auth)/signup.tsx` and apply the same pattern: import `authClient` from `../../lib/auth-client` and a `useRouter`, define `signInWith(provider)` calling `authClient.signIn.social({ provider, callbackURL: "/dashboard" })` then `router.replace("/(tabs)/dashboard")`, and wire the existing Google/GitHub `Pressable`s' `onPress` to it. Keep the existing copy and styling; only replace the inert handlers and the bottom link target (`/login`).

- [ ] **Step 4: Verify `_layout.tsx` token provider**

Confirm `apps/mobile/app/_layout.tsx` still contains:
```ts
setTokenProvider(async () => {
  return await SecureStore.getItemAsync("sessionToken");
});
```
This is unchanged and correct — it reads the bearer token persisted by `auth-client.ts`. No edit needed.

- [ ] **Step 5: Typecheck the mobile app**

Run: `pnpm --filter @skillswap/mobile exec tsc --noEmit`
Expected: no errors in the auth client or screens.

- [ ] **Step 6: Commit**

```bash
git add apps/mobile/lib/auth-client.ts "apps/mobile/app/(auth)" apps/mobile/package.json
git commit -m "feat(auth): wire mobile auth to Better Auth (bearer + secure store)"
```

---

## Task 11: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Lint, typecheck, test across the monorepo**

Run: `pnpm lint && pnpm typecheck && pnpm test`
Expected: all pass. Investigate and fix any failure before proceeding.

- [ ] **Step 2: Build the web app**

Run: `pnpm --filter @skillswap/web build`
Expected: build succeeds with no missing-module errors for `next-auth`/`@auth/prisma-adapter`.

- [ ] **Step 3: Manual web OAuth round-trip**

Run: `pnpm --filter @skillswap/web dev`, open `http://localhost:4000/login`, click **Continue with Google**.
Expected: Google consent → redirect back → land on `/dashboard`. Verify in Prisma Studio (`pnpm --filter @skillswap/db exec prisma studio`) that a `User` row exists with `creditBalance = 2` and exactly one `CreditTransaction` of type `WELCOME`. Re-loading does not add a second WELCOME row.

- [ ] **Step 4: Verify route protection**

Visit `http://localhost:4000/dashboard` in a private window (logged out).
Expected: redirected to `/login`.

- [ ] **Step 5: Manual mobile sign-in (simulator)**

Run: `pnpm --filter @skillswap/mobile dev`, sign in with Google.
Expected: returns to the app via the `skillswap://` deep link, lands on the dashboard tab. The bearer token is stored; a subsequent authenticated API call (once profile routes exist) carries `Authorization: Bearer <token>` and resolves via `requireUser`.

- [ ] **Step 6: Final commit (if any verification fixes were made)**

```bash
git add -A
git commit -m "test(auth): verify Better Auth migration end-to-end"
```

---

## Self-Review Notes

- **Spec coverage:** Server instance (T5), Prisma adapter + schema (T3), env/secret + trustedOrigins (T2/T5), Next handler (T6), `getSession` server helper (T9), bearer plugin (T5/T10), Expo plugin + SecureStore (T10), React client (T8), `databaseHooks.user.create.after` welcome credits (T4/T5), DB-session strategy + bearer mapping (decisions §1). All covered.
- **NextAuth removal:** deps (T1), routes (T6), `auth.ts` (T5), login page (T8), proxy (T7). `git grep -n next-auth` after T6/T8 must return zero hits in `apps/web/src`; add a cleanup step if any module augmentation file (`next-auth.d.ts`) is found.
- **Type consistency:** `auth` (server, from `@/lib/auth`) vs `authClient` (client, from `@/lib/auth-client`) are intentionally distinct names; `requireUser`/`getCurrentUser` both return the Better Auth user (`{ id, email, name, image, role, ... }`). `grantWelcomeCredits(userId: string)` signature unchanged.
- **Open risk:** if `emailVerified DateTime?` is referenced anywhere (none found in app code), the Boolean change would surface in typecheck at T5/T11 — fix at that point.
```
