export interface MatchSuggestion {
  teacherId: string;
  teacherName: string | null;
  teacherAvatar: string | null;
  trustScore: number;
  matchedSkillTags: string[];
  overlapDescription: string;
  explanation: string;
  score: number;
}

export interface MatchDirectoryParams {
  skillTag?: string;
  minTrustScore?: number;
  timezone?: string;
  cursor?: string;
  limit?: number;
}
