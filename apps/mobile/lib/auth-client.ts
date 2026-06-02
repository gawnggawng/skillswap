import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { saveToken } from "./secure-store";

const API_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ||
  process.env.EXPO_PUBLIC_API_URL ||
  "http://localhost:4000";

export const authClient = createAuthClient({
  baseURL: API_URL,
  fetchOptions: {
    onSuccess: async (ctx) => {
      const token = ctx.response.headers.get("set-auth-token");
      if (token) {
        await saveToken(token);
      }
    },
  },
  plugins: [
    expoClient({
      scheme: "skillswap",
      storagePrefix: "skillswap",
      storage: SecureStore,
    }),
  ],
});
