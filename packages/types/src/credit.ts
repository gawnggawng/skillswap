export type CreditTransactionType =
  | "WELCOME"
  | "EARN"
  | "SPEND"
  | "REFUND"
  | "EXPIRY"
  | "ADMIN_GRANT";

export interface CreditTransaction {
  id: string;
  userId: string;
  sessionId: string | null;
  amount: number;
  type: CreditTransactionType;
  note: string | null;
  createdAt: Date;
}

export interface CreditBalance {
  balance: number;
}

export interface CreditTransactionListParams {
  cursor?: string;
  limit?: number;
}
