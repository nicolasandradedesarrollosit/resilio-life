/**
 * AllUsers Type Definitions
 */

export interface UserData {
  _id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  city?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  message?: string;
  data: UserData[];
}

export interface UserResponse {
  message?: string;
  data: UserData;
}
