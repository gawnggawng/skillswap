export type ReportStatus = "PENDING" | "RESOLVED_APPROVED" | "RESOLVED_DISMISSED";
export type ReportReason = "INAPPROPRIATE" | "SPAM" | "NO_SHOW" | "OTHER";

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  sessionId: string | null;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  moderatorNote: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
}

export interface CreateReportInput {
  reportedUserId: string;
  sessionId?: string;
  reason: ReportReason;
  description?: string;
}

export interface DisputeInput {
  sessionId: string;
  reason: string;
}
