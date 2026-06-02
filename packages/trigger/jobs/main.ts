import { task, schedule } from "@trigger.dev/sdk/v3";
import { db } from "@skillswap/db";
import { expireInactiveCredits, recalculateTrustScore } from "@skillswap/core/credits";

export const dailyMatchingJob = task({
  id: "daily-matching",
  run: async () => {
    const activeUsers = await db.user.findMany({
      select: { id: true },
      where: {
        updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    return {
      status: "completed",
      usersProcessed: activeUsers.length,
    };
  },
});

export const creditExpiryJob = task({
  id: "credit-expiry",
  run: async () => {
    const count = await expireInactiveCredits();
    return { status: "completed", expiredUsers: count };
  },
});

export const autoConfirmSessionJob = task({
  id: "auto-confirm-session",
  run: async (payload: { sessionId: string }) => {
    const session = await db.skillSession.findUniqueOrThrow({
      where: { id: payload.sessionId },
    });

    if (session.status !== "COMPLETED" && session.status !== "DISPUTED") {
      await db.skillSession.update({
        where: { id: payload.sessionId },
        data: {
          status: "COMPLETED",
          teacherConfirmed: true,
          learnerConfirmed: true,
          completedAt: new Date(),
        },
      });
    }

    return { status: "completed", sessionId: payload.sessionId };
  },
});

export const roomCleanupJob = task({
  id: "room-cleanup",
  run: async (payload: { roomId: string }) => {
    // LiveKit server SDK would delete the room here
    return { status: "completed", roomId: payload.roomId };
  },
});

export const fraudDetectionJob = task({
  id: "fraud-detection",
  run: async () => {
    const suspiciousUsers = await db.user.findMany({
      where: {
        creditBalance: { lt: 0 },
      },
      select: { id: true },
    });

    return {
      status: "completed",
      suspiciousAccounts: suspiciousUsers.length,
    };
  },
});

export const reviewVisibilityJob = task({
  id: "review-visibility",
  run: async (payload: { sessionId: string }) => {
    await recalculateTrustScore(payload.sessionId);
    return { status: "completed", sessionId: payload.sessionId };
  },
});
