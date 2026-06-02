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
