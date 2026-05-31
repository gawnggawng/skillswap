import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-neutral-600">Sign in to your SkillSwap account</p>
      </div>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/dashboard" });
        }}
      >
        <button
          type="submit"
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 font-medium hover:bg-neutral-50 transition-colors"
        >
          Continue with Google
        </button>
      </form>
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/dashboard" });
        }}
      >
        <button
          type="submit"
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 font-medium hover:bg-neutral-50 transition-colors"
        >
          Continue with GitHub
        </button>
      </form>
      <p className="text-center text-sm text-neutral-500">
        No account yet?{" "}
        <a href="/signup" className="text-primary-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
