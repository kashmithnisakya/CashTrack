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

// List Expenses Types
export interface ListExpensesRequest {
  skip: number;
  limit: number;
}

export interface ListExpensesResponse {
  status: number;
  reports: Expense[];
}

// Income Types
export interface IncomeRequest {
  amount: number;
  date: string; // ISO string format
  description: string;
}

export interface Income {
  income_id: string;
  amount: number;
  date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface AddIncomeResponse {
  status: number;
  reports: Array<{
    message: string;
    income: Income;
  }>;
}

// List Incomes Types
export interface ListIncomesRequest {
  skip: number;
  limit: number;
}

export interface ListIncomesResponse {
  status: number;
  reports: Income[];
}

// Delete Expense Types
export interface DeleteExpenseRequest {
  expense_id: string;
}

export interface DeleteExpenseResponse {
  status: number;
  reports: Array<{
    message: string;
  }>;
}

// Delete Income Types
export interface DeleteIncomeRequest {
  income_id: string;
}

export interface DeleteIncomeResponse {
  status: number;
  reports: Array<{
    message: string;
  }>;
}

// Profile Types
export interface Profile {
  email: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string;
}

export interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
}

export interface UpdateProfileResponse {
  status: number;
  reports: Array<{
    message: string;
    profile: Profile;
  }>;
}

export interface GetProfileRequest {
  [key: string]: never; // Empty payload
}

export interface GetProfileResponse {
  status: number;
  reports: Profile[];
}