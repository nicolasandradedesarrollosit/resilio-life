/**
 * Messages Service
 * Handles all messages-related API calls
 */

import type {
  MessagesResponse,
  MessageResponse,
} from "../types/messages.types";

import { apiClient } from "@/shared/services/apiClient";

class MessagesService {
  /**
   * Get all messages
   */
  async getAll(): Promise<MessagesResponse> {
    return apiClient.get<MessagesResponse>("/messages");
  }

  /**
   * Get message by ID
   */
  async getById(id: string): Promise<MessageResponse> {
    return apiClient.get<MessageResponse>(`/messages/${id}`);
  }

  /**
   * Mark message as read
   */
  async markAsRead(id: string): Promise<MessageResponse> {
    return apiClient.patch<MessageResponse>(`/messages/${id}/read`);
  }
}

export const messagesService = new MessagesService();
