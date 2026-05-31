import type { Skill } from "./user";

export type SessionStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED"
  | "DISPUTED"
  | "NO_SHOW";

export interface SkillSession {
  id: string;
  learnerId: string;
  teacherId: string;
  skillId: string;
  status: SessionStatus;
  scheduledAt: Date;
  roomId: string | null;
  learnerConfirmed: boolean;
  teacherConfirmed: boolean;
  learnerConfirmedAt: Date | null;
  teacherConfirmedAt: Date | null;
  cancelledAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  learner?: { id: string; name: string | null; avatar: string | null };
  teacher?: { id: string; name: string | null; avatar: string | null };
  skill?: Skill;
}

export interface CreateSessionInput {
  teacherId: string;
  skillId: string;
  scheduledAt: string;
}

export interface SessionListParams {
  status?: SessionStatus;
  role?: "learner" | "teacher";
  cursor?: string;
  limit?: number;
}
