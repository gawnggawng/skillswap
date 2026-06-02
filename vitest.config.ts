import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      "packages/types",
      "packages/core",
      "packages/db",
      "packages/api",
      "packages/ui",
      "packages/trigger",
      "apps/web",
      "apps/mobile",
    ],
  },
});
