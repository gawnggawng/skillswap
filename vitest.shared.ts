import { defineConfig, mergeConfig } from "vitest/config";
import type { UserConfig } from "vite";

/** Defaults every workspace Vitest config should inherit. */
export const packageTestDefaults = {
  test: {
    passWithNoTests: true,
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/.expo/**",
      "**/coverage/**",
    ],
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
  },
} satisfies UserConfig;

export const definePackageConfig = (config: UserConfig) =>
  defineConfig(mergeConfig(packageTestDefaults, config));
