import Link from "next/link";
import { ArrowRight, Repeat2, Sparkles, Video } from "lucide-react";
import { Button } from "@skillswap/ui/components/button";
import { Badge } from "@skillswap/ui/components/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@skillswap/ui/components/card";
import { Avatar, AvatarFallback } from "@skillswap/ui/components/avatar";
import { CreditChip } from "@skillswap/ui/components/credit-chip";
import { TrustScore } from "@skillswap/ui/components/trust-score";
import { ModeToggle } from "@skillswap/ui/components/mode-toggle";

export default function LandingPage() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6">
      {/* Top bar */}
      <header className="flex items-center justify-between py-6">
        <span className="font-display text-xl font-semibold tracking-tight">
          Skill<span className="text-primary">Swap</span>
        </span>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="lg" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="lg" asChild>
            <Link href="/signup">
              Get started <ArrowRight />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="stagger grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Badge variant="outline" className="gap-1.5 border-credit/30 text-credit-foreground dark:text-credit">
            <Sparkles className="size-3.5" />
            No money. Ever.
          </Badge>

          <h1 className="mt-5 font-display text-[length:var(--text-display)] leading-[1.02] font-semibold tracking-tight text-balance">
            Barter your{" "}
            <span className="text-primary italic">knowledge.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-muted-foreground text-pretty">
            Teach a 30-minute session, earn a credit. Learn something new, spend
            one. A community that trades time, not cash.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" className="h-11 px-5 text-base" asChild>
              <Link href="/signup">
                Start with 2 free credits <ArrowRight />
              </Link>
            </Button>
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <CreditChip delta="earn" size="sm">2</CreditChip>
              welcome credits on signup
            </span>
          </div>

          {/* Three-beat value props */}
          <ul className="mt-12 grid gap-5 sm:grid-cols-3">
            {[
              { icon: Repeat2, t: "Reciprocal", d: "Teach what you know, learn what you need." },
              { icon: Sparkles, t: "AI matching", d: "Matched to teachers by skill and timezone." },
              { icon: Video, t: "Live 1:1", d: "Real video sessions, real human connection." },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t}>
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="size-4.5" />
                </span>
                <p className="mt-3 font-display font-semibold">{t}</p>
                <p className="mt-1 text-sm text-muted-foreground text-pretty">{d}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Sample match card — shows the brand components in context */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-clay-200/40 via-transparent to-sage-200/40 blur-2xl"
          />
          <Card className="animate-rise-in shadow-lg">
            <CardHeader className="flex flex-row items-center gap-3">
              <Avatar className="size-12">
                <AvatarFallback className="bg-sage-100 font-display text-sage-800">
                  AN
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg leading-tight font-semibold">Anna Nilsson</p>
                <TrustScore value={4.7} count={23} size="sm" className="mt-0.5" />
              </div>
              <Badge className="bg-online/15 text-online border-transparent">
                <span className="mr-1 inline-block size-1.5 rounded-full bg-online animate-pulse-ring" />
                online
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Teaches</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["Python", "Data viz", "SQL"].map((s) => (
                    <Badge key={s} variant="secondary" className="border-teach/15 bg-teach/10 text-foreground">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">You want to learn</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["Python"].map((s) => (
                    <Badge key={s} className="border-transparent bg-learn/15 text-learn dark:text-learn-foreground">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground text-pretty">
                <span className="font-medium text-foreground">94% match.</span>{" "}
                Anna teaches Python, which you want to learn. She&rsquo;s free
                Tuesday evenings your time.
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <CreditChip label="to book">1</CreditChip>
              <Button>
                Request session <ArrowRight />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <footer className="border-t py-8 text-sm text-muted-foreground">
        SkillSwap — barter your knowledge, never your money.
      </footer>
    </main>
  );
}
