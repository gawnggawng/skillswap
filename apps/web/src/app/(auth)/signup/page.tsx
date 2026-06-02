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
