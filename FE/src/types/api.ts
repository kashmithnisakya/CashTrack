// API Types for CashTrack Backend

export interface ApiUser {
  id: string;
  email: string;
  root_id: string;
  is_activated: boolean;
  is_admin: boolean;
  expiration: number;
  state: string;
}

export interface LoginResponse {
  token: string;
  user: ApiUser;
}

export interface RegisterResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string; // Optional, might not be needed by backend
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface AuthState {
  user: ApiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}