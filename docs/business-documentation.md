# SkillSwap — Business Documentation

**Subtitle:** *Barter your knowledge. No money.*

**Version:** 1.0  
**Date:** May 2026  
**Status:** Draft / Pre-MVP

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Core Concept & Value Proposition](#2-core-concept--value-proposition)
3. [Target Audience & Personas](#3-target-audience--personas)
4. [Business Logic Deep Dive](#4-business-logic-deep-dive)
   - [4.1 User Profile & Skill Listings](#41-user-profile--skill-listings)
   - [4.2 Skill Matching (AI-Powered)](#42-skill-matching-ai-powered)
   - [4.3 Session Lifecycle](#43-session-lifecycle)
   - [4.4 Time-Credit Economy](#44-time-credit-economy)
   - [4.5 Trust & Safety](#45-trust--safety)
5. [Monetisation Strategy (Optional/Future)](#5-monetisation-strategy-optionalfuture)
6. [Competitive Landscape](#6-competitive-landscape)
7. [Risk Register](#7-risk-register)
8. [Success Metrics & KPIs](#8-success-metrics--kpis)
9. [Appendix: Glossary](#9-appendix-glossary)

---

## 1. Executive Summary

**SkillSwap** is a community marketplace where people exchange knowledge using only **time-credits** — never money. One 30‑minute session taught earns one credit; one session taken spends one credit. The platform matches learners with teachers using AI, facilitates live video sessions, and enforces a trust & safety system to maintain quality.

The product addresses three intersecting problems:

- **Accessibility:** Traditional tutoring and coaching are locked behind paywalls. SkillSwap removes the financial barrier entirely.
- **Loneliness:** One-on-one live video calls foster genuine human connection around shared interests.
- **Underutilised knowledge:** Every person has skills worth sharing, but no easy way to monetise them without payment infrastructure.

The business model is **credit‑based barter**, with optional premium tiers layered on top without breaking the core zero‑money promise.

---

## 2. Core Concept & Value Proposition

### 2.1 The Credit System

| Action | Credits Earned | Credits Spent |
|---|---|---|
| Teach a 30‑minute session (confirmed) | +1 | — |
| Take a 30‑minute session (completed) | — | –1 |
| New user welcome bonus | +2 | — |

- **Welcome credits** (2 credits) let every user request a session before they teach one. This jump‑starts the network effect.
- The system enforces: **you cannot request a session if your available credits = 0.** You must teach first.
- Credits are **non‑transferable** — no gifting, pooling, or selling — to prevent black markets.
- Credits **expire after 6 months of account inactivity** to keep the community active and prevent hoarding.

### 2.2 Value Proposition (per user segment)

| Segment | Pain Point | SkillSwap Solution |
|---|---|---|
| **Learners** | Can't afford courses/tutors | Pay with time instead of money |
| **Experts** | Know things but can't monetise easily | Turn knowledge into learning opportunities; no tax/income complexity from "barter" |
| **Isolated individuals** | Loneliness, lack of meaningful interaction | Structured 1:1 video calls around shared interests |
| **Career changers** | Need to learn new skills fast | Reciprocal learning — teach what you know, learn what you need |
| **Students** | Tight budget, curiosity about many topics | Free access to real‑world practitioners in exchange for sharing their own skills |

### 2.3 Core Differentiators

- **Truly zero‑money.** No tipping, no paid bookings, no hidden fees for the base experience.
- **AI‑powered matching** via DeepSeek, not just keyword search.
- **Trust Score** built from completions, reviews, and reliability — reputation matters.
- **Double‑blind reviews** prevent retaliation and gaming.
- **Live video built in** (LiveKit), not just a scheduling tool.

---

## 3. Target Audience & Personas

### Persona 1: Maya — The Curious Learner

- 24, recent graduate, tight budget
- Wants to learn: conversational Japanese, watercolour painting, basic coding
- Can teach: English, university essay writing, yoga
- **Motivation:** "I can't afford classes, but I have things to offer back."

### Persona 2: Raj — The Retired Expert

- 62, retired engineer, lots of free time
- Wants to learn: smartphone photography, genealogy research
- Can teach: circuit design, woodworking, car maintenance
- **Motivation:** "I miss teaching and connecting with people. I don't want to charge money."

### Persona 3: Sofia — The Career Switcher

- 31, moving from marketing to UX design
- Wants to learn: Figma, user research, design systems
- Can teach: content strategy, SEO, social media management
- **Motivation:** "I need to build new skills quickly, and I have professional skills to trade."

### Persona 4: Leo — The Hobbyist

- 19, university student, deeply into niche hobbies
- Wants to learn: sourdough baking, chess openings, music production
- Can teach: speed‑cubing, lockpicking (legal), urban sketching
- **Motivation:** "I love sharing obscure skills and learning from people who are passionate."

---

## 4. Business Logic Deep Dive

### 4.1 User Profile & Skill Listings

Every user has a profile containing:

| Field | Description |
|---|---|
| **Basic info** | Name, avatar, timezone, bio |
| **Skills I can teach** | Tags + free‑text description |
| **Skills I want to learn** | Tags + free‑text description |
| **Availability preferences** | Weekly recurring time slots (e.g., "Tuesdays 7–9 PM CET") |
| **Credit balance** | Visible numerical display |
| **Trust Score** | Weighted composite (see §4.5) |

#### AI Skill Tagging

The app uses **DeepSeek** to parse free‑text descriptions into structured tags.

**Example:**
> *Input:* "I can show you how to make sourdough and fix a bike chain"
>
> *Output tags:* `baking`, `sourdough`, `bicycle-maintenance`

This runs at profile creation and on every edit. Tags are the primary matching keys for the recommendation engine.

#### Availability

Users define **recurring weekly windows** (not one‑off slots). The system computes timezone overlaps between matched pairs to suggest mutually available times. One‑off exceptions (holidays, busy weeks) can be marked as unavailable ad‑hoc.

---

### 4.2 Skill Matching (AI‑Powered)

#### Algorithm Inputs

1. User A's **offered skills** (tags + description embeddings)
2. User A's **wanted skills** (tags + description embeddings)
3. Timezone and availability **overlap window**
4. Trust Score floor (configurable minimum)
5. User's **preferred language(s)**

#### Algorithm Outputs

A ranked list of matches, each with:
- Match score (0–100)
- Teacher name, Trust Score, relevant skill tags
- Shared availability window
- A **short human‑readable explanation** generated by DeepSeek:

> *"Anna teaches Python; you want to learn Python. She's free Tuesday evenings your time. Trust Score: 4.7."*

#### Discovery Modes

| Mode | Trigger | Description |
|---|---|---|
| **Proactive suggestions** | Periodic (daily batch) / on‑demand | Push‑notified or shown on dashboard |
| **Manual directory** | User browses | Filterable by skill, rating, timezone, language |
| **Direct request** | User clicks "Request Session" on a teacher's profile | Initiates session lifecycle |

---

### 4.3 Session Lifecycle

#### State Machine

```
[Learner browses/discover match]
        |
        v
[Learner requests session on available slot]  ← must have ≥ 1 available credit
        |
        v
[Teacher notified] ──rejects──> [Session cancelled; credits unfrozen]
        |
      accepts
        |
        v
[Credits frozen (reserved)] → [Room link & token generated (LiveKit)]
        |
        v
[Session start time] → [Video call begins]
        |
        ├── 30 min soft cap
        ├── +5 min grace period
        └── Room auto‑closes at 35 min
        |
        v
[Post‑session: Both parties prompted to confirm completion]
        |
        ├── Both confirm ──> Credits transfer: +1 teacher, –1 learner
        |                     (within 24h window)
        |
        ├── One confirms ──> Other auto‑confirmed after 24h
        |                     UNLESS a dispute is raised
        |
        ├── No one confirms ──> Credits returned to learner
        |                        Teacher gets penalty flag
        |
        └── Dispute raised ──> Credits frozen; manual moderation
```

#### Key Rules

1. **Credit freeze on acceptance.** Learner's credit is reserved at the moment the teacher accepts. This prevents double‑booking.
2. **30‑minute soft cap + 5‑minute grace period.** The LiveKit room automatically closes after 35 minutes from the scheduled start.
3. **24‑hour confirmation window.** Both parties must confirm or the system auto‑resolves (see state machine above).
4. **Cancellation / no‑show policy:**
   - Teacher cancels: credits returned to learner; teacher reliability score impacted.
   - Learner cancels: credits returned if cancelled > 2 hours before session; otherwise penalty flag.
   - No‑show (either party): penalty flag, reliability score impact.
5. **Post‑session review (optional):**
   - Star rating (1–5)
   - Short text review (max 300 chars)
   - OR voice note (max 60 seconds) — summarised by DeepSeek into a clean written review
   - Reviews are **double‑blind** (neither party sees until both have submitted, or 48h have elapsed)

---

### 4.4 Time‑Credit Economy

#### Earning Credits

| Method | Amount | Notes |
|---|---|---|
| Teach a completed session | +1 | Only after confirmation |
| New user welcome bonus | +2 | One‑time, flagged |
| Admin manual grant | Variable | For community contributions, tracked transparently |

#### Restrictions

| Rule | Rationale |
|---|---|
| No credit gifting | Prevents black‑market trading |
| No credit pooling | Prevents multi‑account farming |
| No credit sale | Violates zero‑money principle |
| Balance never < 0 | System denies booking if credits < 1 |
| 6‑month inactivity expiry | Keeps economy liquid; prevents hoarding |
| Welcome credits flagged | Fraud detection monitors for multi‑account abuse |

#### Fraud Detection

The system monitors:
- Multiple accounts from the same IP / device fingerprint
- Accounts that only consume (never teach) and burn through welcome credits
- Rapid account creation → credit spending patterns
- Suspicious session patterns (e.g., same two IPs repeatedly exchanging credits)

Flagged accounts are frozen pending manual review.

#### Admin Override

Administrators can grant credits for:
- Community‑building events (hosting group sessions, writing guides)
- Exceptional contributions (reporting bugs, volunteer moderation)
- Correcting disputed credit movement

All admin grants are **logged publicly** (amount, reason, timestamp) to maintain transparency.

---

### 4.5 Trust & Safety

#### Trust Score

Computed as a weighted composite:

| Component | Weight | Description |
|---|---|---|
| Session completion rate | 35% | % of accepted sessions that were confirmed completed |
| Average review rating | 35% | Weighted mean of star ratings received |
| Reliability | 20% | Inverse of cancellation/no‑show rate |
| Account age & activity | 10% | Longer, active accounts get a slight boost |

Score range: 1.0 – 5.0. Displayed visually on the profile (stars + numeric).

#### Double‑Blind Reviews

- After a session, both parties are prompted to leave a review.
- **Neither party can see the other's review** until:
  - Both have submitted, OR
  - 48 hours have elapsed since the session ended
- This prevents retaliation ("you gave me 3 stars, so I'll give you 1") and encourages honesty.

#### AI Moderation (Post‑Call)

If **both parties consent** to audio transcription:
1. The last 2 minutes of the call are transcribed.
2. DeepSeek analyses the transcript for:
   - Inappropriate content (harassment, hate speech)
   - Spam / commercial solicitation (trying to sell services, move off‑platform)
   - Adult / explicit content
3. Flagged sessions enter a **manual moderation queue** for human review.

> **Privacy note:** Transcription is opt‑in (both must consent). No audio is stored after analysis.

#### Block & Report

| Action | Effect |
|---|---|
| **Block a user** | Prevents that user from seeing your profile, requesting sessions, or messaging you |
| **Report a session** | Flags the session for moderator review; both parties notified |
| **Dispute a credit transfer** | Freezes the credits; moderator investigates; credits either released, transferred, or refunded based on outcome |

#### Moderation Queue

A simple admin panel allows moderators to:
- Review flagged sessions (with transcript and session metadata)
- Resolve disputes (with a brief justification)
- Suspend or ban users
- View admin credit grant history

---

## 5. Monetisation Strategy (Optional / Future)

The core service remains **free and ad‑free** with a credit‑only economy. The following premium layers can be added later without violating the zero‑money promise:

| Tier | Features | Pricing Model |
|---|---|---|
| **Free** | Up to 3 swaps/month, basic profile, standard matching | Free |
| **Premium** | Unlimited swaps/month, priority matching, advanced filters, session recording | Monthly subscription (e.g., $5/mo) |
| **Cosmetic** | Profile badges, verified skill badges, custom avatar frames | One‑time micropayments |
| **Enterprise** | Internal skill‑sharing for companies, private communities, admin dashboard, analytics | Per‑seat or flat SaaS fee |

**Principle:** Paying users get convenience and status features. The core barter exchange remains zero‑cost for everyone.

---

## 6. Competitive Landscape

| Competitor | Model | SkillSwap Differentiator |
|---|---|---|
| **Italki / Preply** | Paid tutoring marketplace | Zero‑money barter; no payment processing |
| **Meetup / Eventbrite** | Free/paid in‑person events | 1:1 live video; AI matching |
| **Reddit (r/IWantToLearn, etc.)** | Free, unstructured | Structured sessions, trust system, no scams |
| **Coursera / Udemy** | Pre‑recorded paid courses | Live interaction, reciprocal learning, free |
| **TimeBanks (general)** | Barter hours for tasks | Specialised to **knowledge exchange only**, with AI matching |

**Key insight:** No existing product combines *zero‑money knowledge barter* + *AI matching* + *built‑in video* + *trust system* in one platform.

---

## 7. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Welcome credit abuse** (fake accounts farming credits) | High | High | Fraud detection (IP/device fingerprinting), flagged welcome credits, rate limiting |
| **Low teacher supply** (everyone wants to learn, few want to teach) | High | High | Welcome credits incentivise initial supply; gamification; "Teach a Skill" onboarding flow |
| **Session no‑shows** | Medium | Medium | Trust Score penalties, auto‑resolve after 24h, credit refunds |
| **Inappropriate behaviour on video calls** | Medium | High | AI moderation (opt‑in transcript analysis), block/report, manual review |
| **Credit hoarding / economy stagnation** | Medium | Medium | 6‑month inactivity expiry, gamification of teaching |
| **Legal: classification as taxable barter** | Low | Medium | Legal review before launch; clear ToS that credits have no monetary value |
| **Legal: GDPR / data privacy compliance** | Medium | High | Video not stored; transcription opt‑in only; data minimisation; EU hosting option |
| **Platform abuse (spam, commercial solicitation)** | Medium | Medium | AI moderation flags commercial keywords; block/report |

---

## 8. Success Metrics & KPIs

### North Star Metric
> **Confirmed sessions completed per week**

### Engagement Metrics

| Metric | Target (6 months post‑launch) |
|---|---|
| Monthly Active Users (MAU) | 5,000 |
| Sessions completed / week | 1,000 |
| Session confirmation rate | > 80% |
| Average Trust Score | > 4.0 |
| Return rate (users active 30 days after signup) | > 40% |
| Teacher‑to‑learner ratio | > 0.6 |
| Time to first session (from signup) | < 48 hours |

### Quality Metrics

| Metric | Target |
|---|---|
| Dispute rate | < 2% of sessions |
| No‑show rate | < 5% |
| Average review rating | > 4.2 |
| Moderation flags requiring action | < 3% of sessions |

### Growth Metrics

| Metric | Target |
|---|---|
| Viral coefficient (k‑factor) | > 1.0 |
| Organic vs. paid acquisition | > 70% organic |
| Skill categories with active listings | > 50 distinct |

---

## 9. Appendix: Glossary

| Term | Definition |
|---|---|
| **Credit** | The unit of exchange on SkillSwap. 1 credit = 1 thirty‑minute teaching session. |
| **Welcome Credit** | Two credits granted to every new user upon signup. Flagged for fraud monitoring. |
| **Trust Score** | A 1.0–5.0 composite score calculated from completion rate, reviews, and reliability. |
| **Double‑Blind Review** | A review system where neither party sees the other's review until both have submitted. |
| **Credit Freeze** | Temporary reservation of a learner's credit when a teacher accepts a session request. |
| **Penalty Flag** | A negative mark on a user's reliability record, typically for a no‑show or failure to confirm. |
| **LiveKit** | The third‑party video‑call infrastructure used to host sessions. |
| **DeepSeek** | The AI model used for skill tagging, match explanations, review summarisation, and content moderation. |
| **Soft Cap** | The 30‑minute expected duration of a session; followed by a 5‑minute grace period before room closure. |
| **Grace Period** | 5 extra minutes added to each session before the LiveKit room auto‑closes. |

---

*End of document.*
