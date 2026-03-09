/**
 * Transactions Type Definitions
 */

export interface TransactionUser {
  _id: string;
  name: string;
  lastName: string;
  email: string;
}

export interface TransactionBenefit {
  _id: string;
  title: string;
  pointsCost: number;
}

export interface TransactionData {
  _id: string;
  user: TransactionUser;
  benefit: TransactionBenefit;
  business: string;
  redeemedAt: string;
  createdAt: string;
}

export interface CreateTransactionDTO {
  userId: string;
  benefitId: string;
}

export interface TransactionsResponse {
  success?: boolean;
  message?: string;
  data: TransactionData[];
}

export interface TransactionResponse {
  success?: boolean;
  message?: string;
  data: TransactionData;
}
