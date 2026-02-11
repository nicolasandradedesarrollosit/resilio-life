/**
 * Messages Type Definitions
 */

export interface MessageData {
  _id: string;
  senderId: string;
  recipientId: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface MessagesResponse {
  message?: string;
  data: MessageData[];
}

export interface MessageResponse {
  message?: string;
  data: MessageData;
}
