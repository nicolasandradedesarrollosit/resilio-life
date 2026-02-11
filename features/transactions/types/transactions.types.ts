/**
 * Transactions Type Definitions
 */

export interface TransactionData {
  _id: string;
  userId: string;
  benefitId: string;
  amount: number;
  status: "pending" | "completed" | "cancelled";
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTransactionDTO {
  userId: string;
  benefitId: string;
  amount: number;
  description?: string;
}

export interface UpdateTransactionDTO extends Partial<CreateTransactionDTO> {
  status?: "pending" | "completed" | "cancelled";
}

export interface TransactionsResponse {
  message?: string;
  data: TransactionData[];
}

export interface TransactionResponse {
  message?: string;
  data: TransactionData;
}
