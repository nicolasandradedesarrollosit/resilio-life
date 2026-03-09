/**
 * Transactions Service
 * Handles transactions API calls
 */

import type {
  TransactionsResponse,
  TransactionResponse,
  CreateTransactionDTO,
} from "../types/transactions.types";

import { apiClient } from "@/shared/services/apiClient";

class TransactionsService {
  async getAll(): Promise<TransactionsResponse> {
    return apiClient.get<TransactionsResponse>("/transactions");
  }

  async create(data: CreateTransactionDTO): Promise<TransactionResponse> {
    return apiClient.post<TransactionResponse>("/transactions", data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/transactions/${id}`);
  }
}

export const transactionsService = new TransactionsService();
