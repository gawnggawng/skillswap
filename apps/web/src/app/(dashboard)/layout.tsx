import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-neutral-200 bg-white p-6">
        <Link href="/dashboard" className="text-xl font-bold">
          SkillSwap
        </Link>
        <nav className="mt-8 space-y-2">
          <Link
            href="/dashboard"
            className="block rounded-lg px-3 py-2 text-neutral-700 hover:bg-neutral-100"
          >
            Dashboard
          </Link>
          <Link
            href="/matches"
            className="block rounded-lg px-3 py-2 text-neutral-700 hover:bg-neutral-100"
          >
            Find matches
          </Link>
          <Link
            href="/sessions"
            className="block rounded-lg px-3 py-2 text-neutral-700 hover:bg-neutral-100"
          >
            My sessions
          </Link>
          <Link
            href="/profile"
            className="block rounded-lg px-3 py-2 text-neutral-700 hover:bg-neutral-100"
          >
            Profile & skills
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
