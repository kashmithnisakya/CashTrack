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

// Expense Types
export interface ExpenseRequest {
  amount: number;
  category: string;
  date: string; // ISO string format
  description: string;
}

export interface Expense {
  expense_id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface AddExpenseResponse {
  status: number;
  reports: Array<{
    message: string;
    expense: Expense;
  }>;
}