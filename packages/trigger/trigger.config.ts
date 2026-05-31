import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_xxx",
  runtime: "node",
  logLevel: "log",
  retries: { enabledInDev: true, default: { maxAttempts: 1 } },
  dirs: ["./jobs"],
});
