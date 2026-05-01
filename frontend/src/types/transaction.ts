export interface TransactionResponse {
  id: string;
  loanId?: string;
  amount: number;
  type: string;
  status: string;
  idempotencyKey: string;
  createdAt: string;
}

export interface TransactionRequest {
  loanId: string;
  amount: number;
  type: TransactionType;
  idempotencyKey: string;
}

export const TransactionType = {
  Disbursement: 0,
  Payment: 1,
  Transfer: 2,
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export const TransactionStatus = {
  Pending: 0,
  Completed: 1,
  Failed: 2,
} as const;
export type TransactionStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];
