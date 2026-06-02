import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { definePackageConfig } from "../../vitest.shared";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const packagesDir = path.resolve(rootDir, "../../packages");

export default definePackageConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
      "@skillswap/types": path.resolve(packagesDir, "types/src/index.ts"),
      "@skillswap/api": path.resolve(packagesDir, "api/src/index.ts"),
      "@skillswap/core": path.resolve(packagesDir, "core/src/index.ts"),
      "@skillswap/db": path.resolve(packagesDir, "db/src/index.ts"),
      "@skillswap/ui": path.resolve(packagesDir, "ui/src/index.ts"),
    },
  },
  test: {
    name: "@skillswap/web",
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
