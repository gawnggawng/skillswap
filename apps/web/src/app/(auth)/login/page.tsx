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
