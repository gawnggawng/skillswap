export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  timezone: string;
  creditBalance: number;
  trustScore: number;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  timezone: string;
  trustScore: number;
  skills: Skill[];
  availability: AvailabilitySlot[];
}

export interface PublicUserProfile {
  id: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  timezone: string;
  trustScore: number;
  teachSkills: Skill[];
}

export type SkillType = "TEACH" | "LEARN";

export interface Skill {
  id: string;
  userId: string;
  type: SkillType;
  tag: string;
  description: string | null;
  createdAt: Date;
}

export interface CreateSkillInput {
  type: SkillType;
  description: string;
}

export interface AvailabilitySlot {
  id: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateAvailabilityInput {
  slots: Omit<AvailabilitySlot, "id" | "userId">[];
}
