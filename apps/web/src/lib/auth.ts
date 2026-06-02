import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { expo } from "@better-auth/expo";
import { db } from "@skillswap/db";
import { grantWelcomeCredits } from "@skillswap/core/credits";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  advanced: {
    database: { generateId: false },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  user: {
    fields: { image: "avatar" },
    additionalFields: {
      role: { type: "string", input: false, defaultValue: "user" },
    },
  },
  trustedOrigins: [
    "skillswap://",
    "skillswap://*",
    ...(process.env.NODE_ENV === "development"
      ? ["exp://", "exp://*"]
      : []),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await grantWelcomeCredits(user.id);
        },
      },
    },
  },
  plugins: [expo(), bearer(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
