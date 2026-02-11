/**
 * Transactions Service
 * Handles all transactions-related API calls
 */

import { apiClient } from "@/shared/services/apiClient";
import type {
  TransactionData,
  TransactionsResponse,
  TransactionResponse,
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from "../types/transactions.types";

class TransactionsService {
  /**
   * Get all transactions
   */
  async getAll(): Promise<TransactionsResponse> {
    return apiClient.get<TransactionsResponse>("/transactions");
  }

  /**
   * Get transaction by ID
   */
  async getById(id: string): Promise<TransactionResponse> {
    return apiClient.get<TransactionResponse>(`/transactions/${id}`);
  }

  /**
   * Create new transaction
   */
  async create(data: CreateTransactionDTO): Promise<TransactionResponse> {
    return apiClient.post<TransactionResponse>("/transactions", data);
  }

  /**
   * Update existing transaction
   */
  async update(
    id: string,
    data: UpdateTransactionDTO
  ): Promise<TransactionResponse> {
    return apiClient.put<TransactionResponse>(`/transactions/${id}`, data);
  }

  /**
   * Delete transaction
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/transactions/${id}`);
  }
}

export const transactionsService = new TransactionsService();
