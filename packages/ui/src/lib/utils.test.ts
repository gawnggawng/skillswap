import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("merges tailwind classes and drops conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditional class values", () => {
    expect(cn("base", false && "hidden", "end")).toBe("base end");
  });
});
