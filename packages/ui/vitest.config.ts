import react from "@vitejs/plugin-react";
import { definePackageConfig } from "../../vitest.shared";

export default definePackageConfig({
  plugins: [react()],
  test: {
    name: "@skillswap/ui",
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
