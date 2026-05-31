export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-neutral-600">
          Get 2 free credits to start learning. Teach a session to earn more.
        </p>
      </div>
      <div className="space-y-3">
        <button className="w-full rounded-lg border border-neutral-300 px-4 py-3 font-medium hover:bg-neutral-50 transition-colors">
          Continue with Google
        </button>
        <button className="w-full rounded-lg border border-neutral-300 px-4 py-3 font-medium hover:bg-neutral-50 transition-colors">
          Continue with GitHub
        </button>
      </div>
      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <a href="/login" className="text-primary-600 hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
