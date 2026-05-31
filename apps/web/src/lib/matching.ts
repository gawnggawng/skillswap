import { db } from "@skillswap/db";

export interface MatchResult {
  teacherId: string;
  teacherName: string | null;
  teacherAvatar: string | null;
  trustScore: number;
  matchedSkillTags: string[];
  overlapDescription: string;
  score: number;
}

export async function findMatchesForUser(userId: string): Promise<MatchResult[]> {
  const user = await db.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      skills: { where: { type: "LEARN" } },
    },
  });

  if (user.skills.length === 0) return [];

  const learnTags = user.skills.map((s) => s.tag);

  const potentialTeachers = await db.user.findMany({
    where: {
      id: { not: userId },
      skills: {
        some: {
          type: "TEACH",
          tag: { in: learnTags },
        },
      },
      trustScore: { gte: 2.5 },
    },
    include: {
      skills: { where: { type: "TEACH", tag: { in: learnTags } } },
    },
    take: 20,
    orderBy: { trustScore: "desc" },
  });

  return potentialTeachers.map((teacher) => {
    const matchedTags = teacher.skills.map((s) => s.tag);
    const overlapScore = matchedTags.length / learnTags.length;
    const score = teacher.trustScore * 0.6 + overlapScore * 10 * 0.4;

    return {
      teacherId: teacher.id,
      teacherName: teacher.name,
      teacherAvatar: teacher.avatar,
      trustScore: teacher.trustScore,
      matchedSkillTags: matchedTags,
      overlapDescription: "Schedules overlap — see profile for details",
      score: Math.round(score * 10) / 10,
    };
  }).sort((a, b) => b.score - a.score);
}
