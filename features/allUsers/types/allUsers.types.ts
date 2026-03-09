/**
 * AllUsers Type Definitions
 * Re-exports UserData from shared types to ensure consistency
 */

import type { UserData } from "@/shared/types";

export type { UserData };

export interface UsersResponse {
  success?: boolean;
  message?: string;
  data: UserData[];
}

export interface UserResponse {
  success?: boolean;
  message?: string;
  data: UserData;
}
