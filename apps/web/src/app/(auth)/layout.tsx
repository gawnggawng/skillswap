import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Link
        href="/"
        className="mb-8 font-display text-2xl font-semibold tracking-tight"
      >
        Skill<span className="text-primary">Swap</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
