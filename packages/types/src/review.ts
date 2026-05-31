export interface Review {
  id: string;
  sessionId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  text: string | null;
  voiceNoteUrl: string | null;
  submittedAt: Date;
  reviewer?: { id: string; name: string | null; avatar: string | null };
}

export interface CreateReviewInput {
  sessionId: string;
  revieweeId: string;
  rating: number;
  text?: string;
}

export interface ReviewVisibility {
  canView: boolean;
  review: Review | null;
  otherPartyReviewed: boolean;
}
