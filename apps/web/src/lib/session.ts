import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
};

export const requireUser = async (req: Request) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    throw new Response(
      JSON.stringify({ error: { code: "UNAUTHENTICATED", message: "Sign in required" } }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  return session.user;
};
