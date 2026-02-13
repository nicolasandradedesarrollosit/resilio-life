/**
 * AllUsers Service
 * Handles all users-related API calls
 */

import { apiClient } from "@/shared/services/apiClient";
import type { UsersResponse, UserResponse } from "../types/allUsers.types";

class AllUsersService {
  /**
   * Get all users
   */
  async getAll(): Promise<UsersResponse> {
    return apiClient.get<UsersResponse>("/users");
  }

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<UserResponse> {
    return apiClient.get<UserResponse>(`/users/${id}`);
  }
}

export const allUsersService = new AllUsersService();
