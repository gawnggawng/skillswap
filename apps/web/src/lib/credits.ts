import { db } from "@skillswap/db";
import type { CreditTransactionType } from "@skillswap/types/credit";

export const WELCOME_CREDITS = 2;
export const SESSION_CREDIT_COST = 1;
export const SESSION_CREDIT_EARN = 1;
export const INACTIVITY_EXPIRY_MONTHS = 6;

export async function getAvailableCredits(userId: string): Promise<number> {
  const user = await db.user.findUniqueOrThrow({
    where: { id: userId },
    select: { creditBalance: true },
  });
  return user.creditBalance;
}

export async function hasSufficientCredits(userId: string): Promise<boolean> {
  const balance = await getAvailableCredits(userId);
  return balance >= SESSION_CREDIT_COST;
}

export async function freezeCredits(
  userId: string,
  sessionId: string
): Promise<void> {
  await db.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { creditBalance: true },
    });

    if (user.creditBalance < SESSION_CREDIT_COST) {
      throw new Error("Insufficient credits");
    }

    await tx.user.update({
      where: { id: userId },
      data: { creditBalance: { decrement: SESSION_CREDIT_COST } },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        sessionId,
        amount: -SESSION_CREDIT_COST,
        type: "SPEND",
      },
    });
  });
}

export async function transferCredits(
  teacherId: string,
  learnerId: string,
  sessionId: string
): Promise<void> {
  await db.$transaction([
    db.user.update({
      where: { id: teacherId },
      data: { creditBalance: { increment: SESSION_CREDIT_EARN } },
    }),
    db.creditTransaction.create({
      data: {
        userId: teacherId,
        sessionId,
        amount: SESSION_CREDIT_EARN,
        type: "EARN",
      },
    }),
  ]);
}

export async function refundCredits(
  userId: string,
  sessionId: string
): Promise<void> {
  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { creditBalance: { increment: SESSION_CREDIT_COST } },
    }),
    db.creditTransaction.create({
      data: {
        userId,
        sessionId,
        amount: SESSION_CREDIT_COST,
        type: "REFUND",
      },
    }),
  ]);
}

export async function grantWelcomeCredits(userId: string): Promise<void> {
  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { creditBalance: { increment: WELCOME_CREDITS } },
    }),
    db.creditTransaction.create({
      data: {
        userId,
        amount: WELCOME_CREDITS,
        type: "WELCOME",
      },
    }),
  ]);
}

export async function expireInactiveCredits(): Promise<number> {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - INACTIVITY_EXPIRY_MONTHS);

  const inactiveUsers = await db.user.findMany({
    where: {
      creditBalance: { gt: 0 },
      updatedAt: { lt: cutoff },
    },
    select: { id: true, creditBalance: true },
  });

  for (const user of inactiveUsers) {
    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { creditBalance: 0 },
      }),
      db.creditTransaction.create({
        data: {
          userId: user.id,
          amount: -user.creditBalance,
          type: "EXPIRY",
          note: `${INACTIVITY_EXPIRY_MONTHS} months inactivity`,
        },
      }),
    ]);
  }

  return inactiveUsers.length;
}

export async function recalculateTrustScore(userId: string): Promise<number> {
  const [completions, reviews] = await Promise.all([
    db.skillSession.count({
      where: {
        OR: [
          { learnerId: userId, status: "COMPLETED" },
          { teacherId: userId, status: "COMPLETED" },
        ],
      },
    }),
    db.review.aggregate({
      where: { revieweeId: userId },
      _avg: { rating: true },
    }),
  ]);

  const noShows = await db.skillSession.count({
    where: {
      OR: [
        { learnerId: userId, status: "NO_SHOW" },
        { teacherId: userId, status: "NO_SHOW" },
      ],
    },
  });

  const total = completions + noShows;
  const completionRate = total > 0 ? completions / total : 0;
  const avgRating = reviews._avg.rating || 3.0;

  const trustScore = avgRating * 0.5 + completionRate * 5 * 0.5;

  await db.user.update({
    where: { id: userId },
    data: { trustScore },
  });

  return trustScore;
}
