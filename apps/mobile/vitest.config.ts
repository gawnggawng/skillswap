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
      "@": rootDir,
      "@skillswap/types": path.resolve(packagesDir, "types/src/index.ts"),
      "@skillswap/api": path.resolve(packagesDir, "api/src/index.ts"),
      "@skillswap/ui": path.resolve(packagesDir, "ui/src/index.ts"),
    },
  },
  test: {
    name: "@skillswap/mobile",
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
  },
});
