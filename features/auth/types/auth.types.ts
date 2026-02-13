/**
 * Auth Type Definitions
 */

import type { UserData } from "@/shared/types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  [key: string]: any;
}

export interface GoogleLoginData {
  idToken?: string | null;
  email?: string | null;
  name?: string | null;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  data: UserData;
}
