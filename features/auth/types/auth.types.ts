/**
 * Auth Type Definitions
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  [key: string]: any;
}

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
  data: User;
  token?: string;
  message?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ValidationState {
  email: boolean | null;
  password: boolean | null;
}
