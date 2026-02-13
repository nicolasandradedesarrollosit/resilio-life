/**
 * Auth Service
 * Handles all authentication-related API calls
 */

import type {
  LoginCredentials,
  RegisterData,
  GoogleLoginData,
  AuthResponse,
} from "../types/auth.types";

import { apiClient } from "@/shared/services/apiClient";

class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/login", credentials);
  }

  /**
   * Login with Google OAuth
   */
  async loginWithGoogle(data: GoogleLoginData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/login-google", data);
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/users", data);
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    return apiClient.post<void>("/logout");
  }

  /**
   * Verify user session
   * Uses /check-session endpoint instead
   */
  async verifySession(): Promise<boolean> {
    try {
      await apiClient.get<AuthResponse>("/check-session");

      return true;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();
