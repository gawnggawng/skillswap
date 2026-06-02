import { definePackageConfig } from "../../vitest.shared";

export default definePackageConfig({
  test: {
    name: "@skillswap/api",
    environment: "happy-dom",
  },
});
