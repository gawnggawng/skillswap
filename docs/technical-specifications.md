# SkillSwap — Technical Specifications

**Version:** 1.0  
**Date:** May 2026  
**Status:** Pre-MVP

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Data Model](#4-data-model)
5. [API Design](#5-api-design)
6. [Key Flows](#6-key-flows)
7. [Scheduled Jobs](#7-scheduled-jobs)
8. [AI Integration](#8-ai-integration)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Video Integration (LiveKit)](#10-video-integration-livekit)
11. [Real-time & Notifications](#11-real-time--notifications)
12. [Time Zone Handling](#12-time-zone-handling)
13. [Security](#13-security)
14. [Testing Strategy](#14-testing-strategy)
15. [Infrastructure & Deployment](#15-infrastructure--deployment)
16. [Environment Variables](#16-environment-variables)
17. [Development Setup](#17-development-setup)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                    Clients                       │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │  Next.js 16  │  │  Expo 54 (React Native)   │ │
│  │  (Web + PWA) │  │  (iOS + Android)          │ │
│  └──────┬───────┘  └────────────┬─────────────┘ │
│         │                       │                │
│         │    React Query hooks  │                │
│         │    (packages/api)     │                │
│         └───────────┬───────────┘                │
└─────────────────────┼────────────────────────────┘
                      │ HTTPS + JWT
┌─────────────────────┼────────────────────────────┐
│              Next.js API Routes (apps/web)        │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │  Auth    │ │ Sessions │ │  Profiles/Skills │ │
│  │  Router  │ │  Router  │ │  Router          │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Credits  │ │  Reviews │ │  LiveKit Token   │ │
│  │  Router  │ │  Router  │ │  Router          │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
│  ┌──────────┐ ┌──────────┐                       │
│  │ Matches  │ │ Reports  │                       │
│  │  Router  │ │  Router  │                       │
│  └──────────┘ └──────────┘                       │
└─────────────────────┬────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼──────┐ ┌────▼────┐ ┌─────▼──────┐
│  PostgreSQL  │ │  Redis  │ │  DeepSeek  │
│  (Neon)      │ │ (Upstash)│ │  API       │
└──────────────┘ └─────────┘ └────────────┘

┌─────────────────────────────────────────────────┐
│               Trigger.dev Jobs                   │
│  ┌──────────────┐ ┌────────────┐ ┌────────────┐│
│  │ Daily Match  │ │Credit Exp.│ │Auto-Confirm ││
│  │ Generation   │ │ Scanner    │ │24h Timer    ││
│  └──────────────┘ └────────────┘ └────────────┘│
│  ┌──────────────┐ ┌────────────┐                │
│  │ Room Cleanup│ │Fraud Detect │               │
│  └──────────────┘ └────────────┘                │
└─────────────────────────────────────────────────┘
```

### Key architectural decisions

- **Monorepo (Turborepo):** Single repo with `apps/web`, `apps/mobile`, and `packages/*`. Shared types and API client eliminate drift between clients.
- **API as Next.js Route Handlers:** No separate backend server. API routes live inside `apps/web`. Both web and mobile clients hit the same endpoints.
- **Server-only AI calls:** All DeepSeek requests originate from the server (API routes or Trigger.dev jobs). API keys never reach the client.
- **Stateless API:** Sessions backed by JWT (NextAuth.js). Server scales horizontally. No sticky sessions needed (LiveKit handles WebRTC state externally).
- **Jobs on Trigger.dev:** Not Vercel cron (limits). Trigger.dev handles delayed jobs (auto-confirm after 24h), recurring jobs (daily matching), and provides a dashboard.

---

## 2. Technology Stack

### Monorepo

| Tool | Version | Purpose |
|---|---|---|
| Turborepo | 2.x | Monorepo orchestration, build caching |
| pnpm | 9+ | Package manager (workspace protocol) |
| TypeScript | 5.9 | Language |

### Web App (`apps/web`)

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.6 | React framework, SSR, API routes |
| React | 19 | UI library |
| Tailwind CSS | 4.x | Utility-first styling |
| shadcn/ui | 2.x | Accessible component primitives |
| NextAuth.js | 5 (beta) | Authentication |
| React Query | 5.x | Server-state management |
| @serwist/next | latest | PWA support |
| LiveKit Client SDK | latest | Video call UI |
| Zustand | 5.x | Client-side state (UI state only) |

### Mobile App (`apps/mobile`)

| Technology | Version | Purpose |
|---|---|---|
| Expo | 54 | Managed React Native |
| React Native | 0.79+ | Native UI |
| Expo Router | 4.x | File-based routing |
| NativeWind | 4.x | Tailwind in React Native |
| React Query | 5.x | Server-state management |
| LiveKit React Native SDK | latest | Video call UI |
| expo-secure-store | latest | JWT storage |
| expo-av | latest | Audio recording (voice notes) |
| expo-notifications | latest | Push notifications |
| Zustand | 5.x | Client-side state |

### Shared Packages (`packages/*`)

| Package | Purpose |
|---|---|
| `packages/types` | TypeScript interfaces shared by all apps |
| `packages/api` | React Query hooks, API client, DTOs |
| `packages/db` | Prisma schema, migrations, client singleton |
| `packages/ui` | Design tokens (colors, spacing, radii, shadows) |

### Infrastructure

| Service | Purpose | Plan |
|---|---|---|
| Vercel | Web hosting (Pro) | Free tier for MVP |
| EAS Build | Mobile CI/CD | Free tier |
| Neon | PostgreSQL database | Free tier (0.5 GB) |
| Upstash | Redis cache | Free tier |
| Trigger.dev | Scheduled + delayed jobs | Free tier |
| LiveKit Cloud | WebRTC video | Free tier (50 GB/mo) |
| DeepSeek API | AI inference | Pay-as-you-go |
| UploadThing | File uploads (avatars, voice notes) | Free tier |
| Sentry | Error monitoring | Free tier |
| GitHub Actions | CI/CD | Free for public repos |

---

## 3. Project Structure

```
skillswap/
├── apps/
│   ├── web/                          # Next.js 16 app
│   │   ├── src/
│   │   │   ├── app/                  # App Router pages + API
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx          # Landing page
│   │   │   │   ├── (auth)/           # Auth route group
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── signup/
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── (dashboard)/      # Authenticated route group
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── profile/
│   │   │   │   │   ├── matches/
│   │   │   │   │   ├── sessions/
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       ├── page.tsx
│   │   │   │   │   │       └── room/
│   │   │   │   │   │           └── page.tsx  # LiveKit room
│   │   │   │   │   ├── admin/
│   │   │   │   │   └── layout.tsx
│   │   │   │   └── api/
│   │   │   │       ├── auth/[...nextauth]/
│   │   │   │       ├── sessions/
│   │   │   │       ├── matches/
│   │   │   │       ├── profiles/
│   │   │   │       ├── credits/
│   │   │   │       ├── reviews/
│   │   │   │       ├── livekit/
│   │   │   │       └── reports/
│   │   │   ├── components/
│   │   │   │   ├── ui/               # shadcn/ui components
│   │   │   │   ├── session/
│   │   │   │   ├── profile/
│   │   │   │   ├── match/
│   │   │   │   └── layout/
│   │   │   ├── lib/
│   │   │   │   ├── auth.ts           # NextAuth.js config
│   │   │   │   ├── deepseek.ts       # AI client
│   │   │   │   ├── livekit.ts        # LiveKit server SDK
│   │   │   │   ├── credits.ts        # Credit business logic
│   │   │   │   ├── matching.ts       # Matching algorithm
│   │   │   │   └── utils.ts
│   │   │   └── middleware.ts
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── mobile/                       # Expo app
│       ├── app/                      # Expo Router pages
│       │   ├── _layout.tsx
│       │   ├── index.tsx
│       │   ├── (auth)/
│       │   ├── (tabs)/
│       │   │   ├── _layout.tsx
│       │   │   ├── dashboard.tsx
│       │   │   ├── matches.tsx
│       │   │   ├── sessions.tsx
│       │   │   └── profile.tsx
│       │   └── session/
│       │       └── [id]/
│       │           ├── index.tsx
│       │           └── room.tsx       # LiveKit room
│       ├── components/
│       ├── lib/
│       │   ├── auth.ts
│       │   ├── notifications.ts
│       │   └── secure-store.ts
│       ├── app.config.ts
│       └── package.json
│
├── packages/
│   ├── types/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── user.ts
│   │   │   ├── session.ts
│   │   │   ├── credit.ts
│   │   │   ├── review.ts
│   │   │   ├── match.ts
│   │   │   ├── report.ts
│   │   │   └── api.ts                 # API request/response DTOs
│   │   └── package.json
│   │
│   ├── api/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── client.ts              # Fetch wrapper with auth
│   │   │   ├── hooks/
│   │   │   │   ├── useProfile.ts
│   │   │   │   ├── useSessions.ts
│   │   │   │   ├── useMatches.ts
│   │   │   │   ├── useCredits.ts
│   │   │   │   └── useReviews.ts
│   │   │   └── providers.tsx           # React Query provider
│   │   └── package.json
│   │
│   ├── db/
│   │   ├── src/
│   │   │   ├── index.ts               # Prisma client singleton
│   │   │   └── seed.ts                # Seed data
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── package.json
│   │
│   └── ui/
│       ├── src/
│       │   ├── tokens.ts              # Colors, spacing, radii
│       │   └── index.ts
│       └── package.json
│
├── trigger/                           # Trigger.dev jobs
│   ├── jobs/
│   │   ├── daily-matching.ts
│   │   ├── credit-expiry.ts
│   │   ├── auto-confirm-session.ts
│   │   ├── room-cleanup.ts
│   │   └── fraud-detection.ts
│   ├── trigger.config.ts
│   └── package.json
│
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .env.example
├── .gitignore
├── AGENTS.md
└── package.json
```

---

## 4. Data Model

### Entity Relationship Diagram (text)

```
User 1──┬──N Skill (type: teach | learn)
        ├──N AvailabilitySlot
        ├──N Session (as learner)
        ├──N Session (as teacher)
        ├──N CreditTransaction
        ├──N Review (as reviewer)
        ├──N Review (as reviewee)
        ├──N Report (as reporter)
        ├──N Report (as reportedUser)
        ├──N Block
        └──N DeviceToken

Session 1──N CreditTransaction
        1──2 Review
        1──N Report

Skill 1──N Session
```

### Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ── Enums ──────────────────────────────────────────────

enum SkillType {
  TEACH
  LEARN
}

enum SessionStatus {
  REQUESTED
  ACCEPTED
  REJECTED
  CANCELLED
  COMPLETED
  DISPUTED
  NO_SHOW
}

enum CreditTransactionType {
  WELCOME
  EARN
  SPEND
  REFUND
  EXPIRY
  ADMIN_GRANT
}

enum ReportStatus {
  PENDING
  RESOLVED_APPROVED
  RESOLVED_DISMISSED
}

enum ReportReason {
  INAPPROPRIATE
  SPAM
  NO_SHOW
  OTHER
}

// ── Models ─────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  avatar        String?                       // UploadThing URL
  bio           String?                       @db.VarChar(500)
  timezone      String    @default("UTC")     // IANA tz, e.g. "America/New_York"
  creditBalance Int       @default(2)         // Welcome credits
  trustScore    Float     @default(3.0)
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  skills            Skill[]
  availabilitySlots AvailabilitySlot[]
  sessionsAsLearner Session[]        @relation("Learner")
  sessionsAsTeacher Session[]        @relation("Teacher")
  creditTransactions CreditTransaction[]
  reviewsWritten    Review[]         @relation("Reviewer")
  reviewsReceived   Review[]         @relation("Reviewee")
  reportsMade       Report[]         @relation("Reporter")
  reportsAgainst    Report[]         @relation("ReportedUser")
  blocksGiven       Block[]          @relation("Blocker")
  blocksReceived    Block[]          @relation("BlockedUser")
  deviceTokens      DeviceToken[]
  accounts          Account[]
  sessions          Session[]

  @@index([email])
  @@index([creditBalance])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id          Int           @id @default(autoincrement())
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  expiresAt   DateTime
  sessionToken String       @unique
  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Skill {
  id          String    @id @default(cuid())
  userId      String
  type        SkillType
  tag         String                        // Structured tag from AI parsing
  description String?                       @db.VarChar(500) // Original free-text
  createdAt   DateTime  @default(now())

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  sessions    Session[] @relation("SessionSkill")

  @@index([userId])
  @@index([type, tag])
}

model AvailabilitySlot {
  id        String   @id @default(cuid())
  userId    String
  dayOfWeek Int                 // 0=Sun, 6=Sat
  startTime String              // "HH:mm" in user's timezone
  endTime   String              // "HH:mm" in user's timezone
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model SkillSession {
  id            String        @id @default(cuid())
  learnerId     String
  teacherId     String
  skillId       String
  status        SessionStatus @default(REQUESTED)
  scheduledAt   DateTime
  roomId        String?                       // LiveKit room name
  roomToken     String?                       // (transient, not stored for learner)
  teacherToken  String?                       // (transient, not stored for teacher)
  learnerConfirmed   Boolean   @default(false)
  teacherConfirmed   Boolean   @default(false)
  learnerConfirmedAt DateTime?
  teacherConfirmedAt DateTime?
  cancelledAt   DateTime?
  completedAt   DateTime?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  learner       User        @relation("Learner", fields: [learnerId], references: [id])
  teacher       User        @relation("Teacher", fields: [teacherId], references: [id])
  skill         Skill       @relation("SessionSkill", fields: [skillId], references: [id])
  creditTransaction CreditTransaction[]
  reviews       Review[]
  reports       Report[]

  @@index([learnerId])
  @@index([teacherId])
  @@index([status])
  @@index([scheduledAt])
  @@index([createdAt])
}

model CreditTransaction {
  id        String                @id @default(cuid())
  userId    String
  sessionId String?
  amount    Int                    // +1, -1, +2, etc.
  type      CreditTransactionType
  note      String?                @db.VarChar(500) // Admin notes, expiry reason
  createdAt DateTime              @default(now())

  user      User                  @relation(fields: [userId], references: [id])
  session   SkillSession?          @relation(fields: [sessionId], references: [id])

  @@index([userId])
  @@index([sessionId])
  @@index([createdAt])
}

model Review {
  id              String    @id @default(cuid())
  sessionId       String
  reviewerId      String
  revieweeId      String
  rating          Int                    // 1-5
  text            String?               @db.VarChar(300)
  voiceNoteUrl    String?               // UploadThing URL (optional)
  submittedAt     DateTime  @default(now())

  session         SkillSession @relation(fields: [sessionId], references: [id])
  reviewer        User         @relation("Reviewer", fields: [reviewerId], references: [id])
  reviewee        User         @relation("Reviewee", fields: [revieweeId], references: [id])

  @@unique([sessionId, reviewerId])     // One review per party per session
  @@index([sessionId])
  @@index([revieweeId])
}

model Report {
  id              String       @id @default(cuid())
  reporterId      String
  reportedUserId  String
  sessionId       String?
  reason          ReportReason
  description     String?      @db.VarChar(1000)
  status          ReportStatus @default(PENDING)
  moderatorNote   String?      @db.VarChar(500)
  createdAt       DateTime     @default(now())
  resolvedAt      DateTime?

  reporter        User         @relation("Reporter", fields: [reporterId], references: [id])
  reportedUser    User         @relation("ReportedUser", fields: [reportedUserId], references: [id])
  session         SkillSession? @relation(fields: [sessionId], references: [id])

  @@index([reportedUserId])
  @@index([status])
}

model Block {
  id        String   @id @default(cuid())
  blockerId String
  blockedId String
  createdAt DateTime @default(now())

  blocker   User     @relation("Blocker", fields: [blockerId], references: [id])
  blocked   User     @relation("BlockedUser", fields: [blockedId], references: [id])

  @@unique([blockerId, blockedId])
  @@index([blockedId])
}

model DeviceToken {
  id        String   @id @default(cuid())
  userId    String
  token     String                     // Expo push token
  platform  String                     // "ios" | "android" | "web"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, platform])
  @@index([userId])
}
```

---

## 5. API Design

### RESTful Route Handlers (Next.js App Router)

All routes prefixed with `/api`. Authenticated routes require `Authorization: Bearer <JWT>`.

#### Auth

| Method | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/api/auth/[...nextauth]` | NextAuth.js handler | No |
| `GET` | `/api/auth/session` | Get current session | Optional |

#### Profiles & Skills

| Method | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/api/profiles/me` | Get current user profile | Yes |
| `PATCH` | `/api/profiles/me` | Update profile | Yes |
| `GET` | `/api/profiles/[id]` | Get public profile by ID | Optional |
| `POST` | `/api/profiles/me/skills` | Add a skill (with AI tagging) | Yes |
| `DELETE` | `/api/profiles/me/skills/[id]` | Remove a skill | Yes |
| `GET` | `/api/profiles/me/availability` | Get availability slots | Yes |
| `PUT` | `/api/profiles/me/availability` | Set availability slots | Yes |

#### Sessions

| Method | Route | Description | Auth |
|---|---|---|---|
| `POST` | `/api/sessions` | Request a session | Yes |
| `GET` | `/api/sessions` | List my sessions | Yes |
| `GET` | `/api/sessions/[id]` | Get session details | Yes |
| `PATCH` | `/api/sessions/[id]/accept` | Teacher accepts | Yes |
| `PATCH` | `/api/sessions/[id]/reject` | Teacher rejects | Yes |
| `PATCH` | `/api/sessions/[id]/cancel` | Either party cancels | Yes |
| `PATCH` | `/api/sessions/[id]/confirm` | Confirm session completed | Yes |
| `GET` | `/api/sessions/[id]/token` | Get LiveKit room token | Yes |

#### Matches

| Method | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/api/matches` | Get suggested matches | Yes |
| `GET` | `/api/matches/directory` | Browse teacher directory | Optional |

#### Credits

| Method | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/api/credits/balance` | Get current balance | Yes |
| `GET` | `/api/credits/transactions` | Transaction history | Yes |

#### Reviews

| Method | Route | Description | Auth |
|---|---|---|---|
| `POST` | `/api/reviews` | Submit a review | Yes |
| `GET` | `/api/reviews/session/[sessionId]` | Get reviews for a session (double-blind aware) | Yes |

#### LiveKit

| Method | Route | Description | Auth |
|---|---|---|---|
| `POST` | `/api/livekit/token` | Generate a room token | Yes |

#### Reports & Moderation

| Method | Route | Description | Auth |
|---|---|---|---|
| `POST` | `/api/reports` | Submit a report | Yes |
| `POST` | `/api/reports/dispute` | Dispute a credit transfer | Yes |
| `POST` | `/api/users/[id]/block` | Block a user | Yes |
| `DELETE` | `/api/users/[id]/block` | Unblock a user | Yes |

#### Admin

| Method | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/api/admin/reports` | List all reports | Admin |
| `PATCH` | `/api/admin/reports/[id]` | Resolve a report | Admin |
| `POST` | `/api/admin/credits/grant` | Admin credit grant | Admin |

### Conventions

- **Request/Response types** are defined in `packages/types/src/api.ts`
- **Validation** via Zod schemas (defined alongside route handlers)
- **Error format:** `{ error: { code: string; message: string } }`
- **Pagination:** `?cursor=<id>&limit=20`, response includes `nextCursor`
- **Idempotency:** Credit operations use idempotency keys to prevent duplicates

---

## 6. Key Flows

### 6.1 Skill Tagging (AI Parse)

```
User submits free-text description
        │
        ▼
POST /api/profiles/me/skills
  body: { type: "TEACH", description: "I can teach sourdough and bike repair" }
        │
        ▼
Server calls DeepSeek API
  prompt: "Extract structured tags from: '...'"
        │
        ▼
DeepSeek returns: ["baking", "sourdough", "bicycle-maintenance"]
        │
        ▼
One Skill row per tag saved to DB
Response: { skills: [{ id, type, tag, description }] }
```

### 6.2 Session Booking → Completion

```
1. Learner browses matches/directory → POST /api/sessions
   { teacherId, skillId, scheduledAt }
   ── Server checks: learner.creditBalance >= 1?  ──❌ → 402 "Insufficient credits"

2. Teacher notified → PATCH /api/sessions/[id]/accept
   ── Credit frozen: learner.creditBalance -= 1 (transaction: SPEND)
   ── Room created: LiveKit room + token generated

3. Session day: Both join /session/[id]/room
   ── LiveKit Web/RN SDK handles WebRTC
   ── 30 min timer starts
   ── At 35 min: Trigger.dev job fires → LiveKit API deletes room

4. Post-session: Both prompted to confirm
   ── PATCH /api/sessions/[id]/confirm
   ── When both confirm:
       teacher.creditBalance += 1 (transaction: EARN)
       Session status → COMPLETED

5. Post-session (optional): POST /api/reviews
   ── Double-blind: stored but hidden from other party until both submit or 48h

6. If only one confirms: 24h Trigger.dev job fires → auto-confirm other party
   ── If no one confirms: credits returned to learner; teacher reliability flag
```

### 6.3 Match Generation

```
Trigger.dev daily cron (e.g., 02:00 UTC)
        │
        ▼
Batch select users active in last 7 days
        │
        ▼
Per user:
  1. Get their WANTED skills (tags)
  2. Get other users' TEACH skills (tags)
  3. Compute tag overlap score
  4. Filter by timezone overlap (availability windows)
  5. Filter by Trust Score floor
  6. Exclude blocked users
  7. Rank by composite score
        │
        ▼
Top 10 matches per user
  ── Option A: Call DeepSeek for natural-language explanation per match
  ── Option B: Template-based explanation (faster, cheaper)
        │
        ▼
Insert into DB (MatchSuggestion table? Or compute on read)
  ── Push notification to user: "3 new skill matches found!"
```

### 6.4 Double-Blind Review Logic

```
Session completes
  │
  ├── Learner submits review → review.learnerSubmitted = now()
  │   ── Teacher's review is not visible yet
  │
  ├── Teacher submits review → review.teacherSubmitted = now()
  │   ── Both submitted → both reviews become visible
  │
  └── 48h elapsed (Trigger.dev job) → any unsubmitted reviews are marked optional
      ── If only one side submitted, that review becomes visible
      ── Trust Score recalculates
```

### 6.5 Fraud Detection (Welcome Credit Abuse)

```
On signup:
  ── Flag account if IP matches another account created in last 24h
  ── Welcome credits marked with type: WELCOME (trackable)
  ── Device fingerprint logged (client-side)

Trigger.dev weekly job:
  ── Find accounts where:
       creditBalance < 0 (should never happen, but check)
       OR (createdAt > 7d ago AND sessionsAsTeacher count == 0
           AND creditTransactions == 2 welcome spent)
  ── Auto-freeze suspicious accounts → manual review queue
```

---

## 7. Scheduled Jobs (Trigger.dev)

| Job | Schedule | Description |
|---|---|---|
| `daily-matching` | Every 24h at 02:00 UTC | Batch compute match suggestions for all active users |
| `credit-expiry` | Every 24h at 03:00 UTC | Find accounts inactive > 6 months, expire credits |
| `auto-confirm-session` | Delayed, 24h after session `scheduledAt` | Auto-confirm the party that hasn't responded; resolve unconfirmed sessions |
| `room-cleanup` | Delayed, 35min after session `scheduledAt` | Close LiveKit room via API |
| `fraud-detection` | Every 7 days | Scan for welcome credit abuse patterns |
| `review-visibility` | Delayed, 48h after session `completedAt` | Finalize double-blind review visibility |
| `trust-score-recalc` | After review submit or session confirm | Recalculate Trust Score for affected users |

---

## 8. AI Integration (DeepSeek)

### Client Setup

```typescript
// packages/db/../deepseek.ts (conceptual)
import OpenAI from "openai";

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});
```

### Use Cases

| Use Case | Model | Max Tokens | Cached? |
|---|---|---|---|
| Skill tag extraction | deepseek-chat | 200 | No |
| Match explanation generation | deepseek-chat | 150 | No |
| Voice note → text review | deepseek-chat (text input of transcription) | 200 | No |
| Call transcript moderation | deepseek-chat | 100 | No |

### Prompt Templates

**Skill tagging:**
```
Extract a list of skill tags from the following text. Return ONLY a JSON array of lowercase, hyphenated strings. Maximum 5 tags.
Text: "{userDescription}"
```

**Match explanation:**
```
Write a one-sentence explanation (max 150 chars) why these two users would be a good skill swap match.
Teacher name: {teacherName}
Teacher skill: {skillTag}
Learner wanted: {wantedTag}
Availability overlap: {timeDescription}
```

**Moderation check:**
```
Analyze the following transcript excerpt. Classify as either "SAFE" or "FLAG".
FLAG if it contains: harassment, hate speech, commercial solicitation, explicit content, or spam.
Transcript: "{last2Minutes}"
Respond with only "SAFE" or "FLAG" followed by a brief reason if FLAG.
```

---

## 9. Authentication & Authorization

### Flow

```
┌─────────┐        ┌──────────────┐        ┌─────────┐
│  Client │        │ NextAuth.js  │        │   DB    │
│ (Web/   │        │ (apps/web)   │        │ (Neon)  │
│ Mobile) │        │              │        │         │
└────┬────┘        └──────┬───────┘        └────┬────┘
     │                    │                     │
     │ 1. Login/signup    │                     │
     │───────────────────▶│                     │
     │                    │ 2. Verify/create    │
     │                    │────────────────────▶│
     │                    │◀────────────────────│
     │ 3. JWT session     │                     │
     │◀───────────────────│                     │
     │                    │                     │
     │ 4. API call + JWT  │                     │
     │───────────────────▶│                     │
     │                    │ 5. Validate JWT     │
     │                    │ 6. DB query         │
     │                    │────────────────────▶│
     │◀───────────────────│                     │
```

- **Web:** NextAuth.js handles session cookies automatically.
- **Mobile:** `expo-secure-store` stores the JWT. Sent as `Authorization: Bearer <token>` in headers from `packages/api`.

### Authorization Levels

| Level | Description |
|---|---|
| `public` | No auth required (landing pages, browse directory) |
| `authenticated` | Valid JWT required |
| `session-participant` | Must be learner or teacher of the session |
| `admin` | Admin role flag on User model |

Implemented via middleware and inline checks in route handlers.

---

## 10. Video Integration (LiveKit)

### Server Side

```typescript
// apps/web/src/lib/livekit.ts (conceptual)
import { AccessToken } from "livekit-server-sdk";

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

export async function createRoomToken(
  roomName: string,
  userId: string,
  userName: string,
  isTeacher: boolean
) {
  const at = new AccessToken(apiKey, apiSecret, {
    identity: userId,
    name: userName,
  });
  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });
  return at.toJwt();
}
```

### Client Side (Web)

```tsx
// apps/web/src/app/(dashboard)/sessions/[id]/room/page.tsx (conceptual)
import { LiveKitRoom, VideoConference } from "@livekit/components-react";

export default function SessionRoom({ token, serverUrl }) {
  return (
    <LiveKitRoom token={token} serverUrl={serverUrl} connect={true}>
      <VideoConference />
    </LiveKitRoom>
  );
}
```

### Trigger.dev Room Cleanup

```typescript
// trigger/jobs/room-cleanup.ts (conceptual)
import { LiveKitClient } from "livekit-server-sdk";

export const roomCleanupJob = task({
  id: "room-cleanup",
  run: async ({ roomName }) => {
    const client = new LiveKitClient(host, apiKey, apiSecret);
    await client.deleteRoom(roomName);
  },
});
```

### Lifecycle

| Event | Action |
|---|---|
| Teacher accepts session | POST `/api/livekit/token` → store `roomId` on session |
| Session start time | Both parties can join room |
| 30 min | Soft cap: display notice to participants |
| 35 min | Trigger.dev job: `LiveKitClient.deleteRoom()` |
| Call ends | Both prompted to confirm completion |

---

## 11. Real-time & Notifications

### Architecture

```
Trigger.dev job ──▶ Expo Push API ──▶ iOS/Android Push
                ──▶ Web Push API   ──▶ Browser Notification
                ──▶ In-app (Polling / SSE)
```

### Notification Events

| Event | Channel | Trigger |
|---|---|---|
| New session request | Push | POST `/api/sessions` → Trigger.dev |
| Session accepted | Push | PATCH `/api/sessions/[id]/accept` → Trigger.dev |
| Session rejected | Push | PATCH `/api/sessions/[id]/reject` → Trigger.dev |
| Session reminder (1h before) | Push | Trigger.dev delayed job |
| Confirm session prompt | Push + In-app | Trigger.dev delayed job (post-session) |
| New match suggestions | Push | Trigger.dev `daily-matching` job |
| Credit balance low | In-app | On balance drop to 0 |
| Session cancelled | Push | PATCH `/api/sessions/[id]/cancel` |

### Device Token Registration

```typescript
// apps/mobile/lib/notifications.ts (conceptual)
import * as Notifications from "expo-notifications";

const token = await Notifications.getExpoPushTokenAsync();

await fetch("/api/users/me/device-token", {
  method: "POST",
  body: JSON.stringify({ token: token.data, platform: Platform.OS }),
});
```

---

## 12. Time Zone Handling

### Strategy

- Users set their IANA timezone on their profile (e.g., `"America/New_York"`)
- All times stored in **UTC** in the database
- All API responses return UTC timestamps
- Clients convert to local time for display using `Intl.DateTimeFormat` or `dayjs`
- Availability slots stored as `dayOfWeek` (0–6) + `HH:mm` strings — relative to the user's timezone

### Timezone overlap calculation

```typescript
// Server-side, when computing match availability
function hasOverlap(slotA: AvailabilitySlot, tzA: string, slotB: AvailabilitySlot, tzB: string): boolean {
  // Convert both slots to UTC ranges for a given reference week
  const rangeA = toUTCRange(slotA.dayOfWeek, slotA.startTime, slotA.endTime, tzA);
  const rangeB = toUTCRange(slotB.dayOfWeek, slotB.startTime, slotB.endTime, tzB);
  return rangesOverlap(rangeA, rangeB);
}
```

---

## 13. Security

| Concern | Approach |
|---|---|
| **Auth tokens** | JWT with short expiry (1h), refresh via NextAuth.js |
| **API keys** | Never exposed to client. DeepSeek, LiveKit keys server-side only |
| **SQL injection** | Prisma parameterized queries |
| **XSS** | React's built-in escaping + Content Security Policy headers |
| **CSRF** | NextAuth.js CSRF tokens (web). JWT Bearer (mobile, immune) |
| **Rate limiting** | Upstash Redis — per-user, per-IP limits on session booking and AI endpoints |
| **Video room access** | LiveKit tokens scoped to single room, tied to user identity |
| **Double-booking prevention** | DB transaction: check credit balance + freeze in one atomic update |
| **Credit tampering** | All credit changes go through `CreditTransaction` model with server-side validation |
| **Input validation** | Zod schemas on all API inputs |

### Rate Limits

| Endpoint | Limit |
|---|---|
| `POST /api/sessions` | 5 per hour per user |
| `POST /api/profiles/me/skills` | 10 per hour per user |
| `POST /api/livekit/token` | 10 per hour per user |
| AI endpoints (skill parse, moderation) | 30 per minute globally |

---

## 14. Testing Strategy

### Layers

| Layer | Tool | Coverage Target |
|---|---|---|
| **Unit tests** | Vitest | `packages/*` (types, utilities, business logic) |
| **API tests** | Vitest + `next-test-api-route-handler` | All `/api/*` route handlers |
| **Component tests** | Vitest + React Testing Library | Critical web UI components |
| **E2E tests** | Playwright | Critical user flows (signup → teach → learn) |
| **Mobile tests** | Jest + React Native Testing Library | Critical mobile components |

### Key Test Scenarios

```
Session flow:
  ✓ Learner requests session (credit balance >= 1)
  ✓ Learner blocked from requesting at 0 credits
  ✓ Teacher accepts → credit frozen
  ✓ Both confirm → credits transfer
  ✓ Only learner confirms → auto-confirm teacher after 24h
  ✓ No one confirms → credit refund + teacher penalty
  ✓ Dispute raised → credits frozen

Credit economy:
  ✓ Welcome credits granted on signup (2 credits)
  ✓ Earn credit on confirmed session teach
  ✓ Credit expiry after 6 months inactivity
  ✓ Cannot request at 0 credits

AI:
  ✓ Skill tagging extracts correct tags
  ✓ DeepSeek match explanation generates valid text
  ✓ Moderation correctly flags harmful content

Reviews:
  ✓ Double-blind: reviewer cannot see other's review before both submitted
  ✓ Voice note uploads and is transcribed

LiveKit:
  ✓ Room token generated with correct permissions
  ✓ Room closes after 35 minutes
```

---

## 15. Infrastructure & Deployment

### Environments

| Environment | Database | Domain |
|---|---|---|
| **Development** | Neon branch `dev` | `localhost:4000` |
| **Preview** | Neon branch `preview` | `<branch>.skillswap.vercel.app` |
| **Production** | Neon branch `main` | `skillswap.app` |

### CI/CD Pipeline (GitHub Actions)

```
Push to main
  │
  ├── Lint (ESLint + Prettier)
  ├── TypeCheck (tsc --noEmit)
  ├── Test (Vitest + Playwright)
  │
  ├── Build web (Next.js)
  ├── Deploy web → Vercel (production)
  ├── Run Prisma migrations → Neon (production)
  │
  ├── Build mobile (EAS Build)
  │   ├── iOS → EAS Submit (TestFlight)
  │   └── Android → EAS Submit (Play Store Internal)
  │
  └── Deploy Trigger.dev jobs
```

### Database Migrations

```bash
# Development
turbo db:migrate:dev

# Production (via GitHub Actions)
pnpm --filter @skillswap/db exec prisma migrate deploy
```

---

## 16. Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."     # For Prisma migrations (no pooler)

# Auth
AUTH_SECRET="random-secret"
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."

# LiveKit
LIVEKIT_API_KEY="..."
LIVEKIT_API_SECRET="..."
LIVEKIT_HOST="wss://..."

# DeepSeek AI
DEEPSEEK_API_KEY="..."

# UploadThing
UPLOADTHING_TOKEN="..."
UPLOADTHING_SECRET="..."

# Upstash Redis
UPSTASH_REDIS_URL="..."
UPSTASH_REDIS_TOKEN="..."

# Trigger.dev
TRIGGER_SECRET_KEY="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:4000"
NEXT_PUBLIC_LIVEKIT_HOST="wss://..."

# Sentry
SENTRY_DSN="..."
```

---

## 17. Development Setup

### Prerequisites

- Node.js >= 20.9.0
- pnpm >= 9.0.0
- Xcode 16+ (iOS simulator)
- Android Studio (Android emulator)
- Docker (optional, for local Redis/Postgres)

### Quick Start

```bash
# 1. Clone & install
git clone <repo-url> skillswap
cd skillswap
pnpm install

# 2. Set up environment
cp .env.example .env
# Fill in required values

# 3. Set up database
cp .env packages/db/.env
pnpm --filter @skillswap/db exec prisma db push

# 4. Start dev servers
pnpm dev

# This starts:
# - apps/web        → localhost:4000
# - apps/mobile     → Expo dev server
# - trigger dev     → localhost:8889 (Trigger.dev tunnel)

# Individual commands:
pnpm --filter @skillswap/web dev
pnpm --filter @skillswap/mobile dev     # or: ios / android
pnpm --filter @skillswap/trigger dev

# Run tests
pnpm test
pnpm test:e2e
```

### Scripts (Root `package.json`)

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "test:e2e": "turbo test:e2e",
    "db:migrate:dev": "turbo db:migrate:dev",
    "db:studio": "turbo db:studio",
    "clean": "turbo clean"
  }
}
```

---

*End of document.*
