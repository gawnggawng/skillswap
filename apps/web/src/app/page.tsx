import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        SkillSwap
      </h1>
      <p className="mt-4 text-lg text-neutral-600 sm:text-xl">
        Barter your knowledge. No money.
      </p>
      <p className="mt-2 max-w-md text-neutral-500">
        Teach a 30-minute session, earn a credit. Learn from someone else, spend
        a credit. Simple.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/signup"
          className="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700 transition-colors"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-neutral-300 px-6 py-3 font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
