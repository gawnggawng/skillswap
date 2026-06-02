import { describe, it, expect, vi, beforeEach } from "vitest";

const transaction = vi.fn();
const findFirst = vi.fn();

vi.mock("@skillswap/db", () => ({
  db: {
    $transaction: (...args: unknown[]) => transaction(...args),
    creditTransaction: {
      findFirst: (...args: unknown[]) => findFirst(...args),
      create: vi.fn(),
    },
    user: { update: vi.fn() },
  },
  Prisma: {},
}));

import { grantWelcomeCredits } from "./credits";

describe("grantWelcomeCredits", () => {
  beforeEach(() => {
    transaction.mockReset();
    findFirst.mockReset();
  });

  it("grants credits the first time", async () => {
    findFirst.mockResolvedValue(null);
    await grantWelcomeCredits("user-1");
    expect(transaction).toHaveBeenCalledTimes(1);
  });

  it("is a no-op if a WELCOME transaction already exists", async () => {
    findFirst.mockResolvedValue({ id: "txn-1" });
    await grantWelcomeCredits("user-1");
    expect(transaction).not.toHaveBeenCalled();
  });
});
