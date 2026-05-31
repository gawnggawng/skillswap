import Link from "next/link";
import { signIn } from "@/lib/auth";
import { Button } from "@skillswap/ui/components/button";

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
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <Button type="submit" variant="outline" size="lg" className="h-11 w-full">
            Continue with Google
          </Button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
        >
          <Button type="submit" variant="outline" size="lg" className="h-11 w-full">
            Continue with GitHub
          </Button>
        </form>
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
