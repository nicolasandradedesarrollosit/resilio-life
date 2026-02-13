/**
 * Messages Type Definitions
 */

import type { MessageData } from "@/shared/types";

export type { MessageData };

export interface MessagesResponse {
  success?: boolean;
  message?: string;
  data: MessageData[];
}

export interface MessageResponse {
  success?: boolean;
  message?: string;
  data: MessageData;
}
