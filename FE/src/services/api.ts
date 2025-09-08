import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ApiError, ExpenseRequest, AddExpenseResponse, ListExpensesRequest, ListExpensesResponse, DeleteExpenseRequest, DeleteExpenseResponse, IncomeRequest, AddIncomeResponse, ListIncomesRequest, ListIncomesResponse, DeleteIncomeRequest, DeleteIncomeResponse } from '@/types/api';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      console.log(`📊 API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorMessage = `HTTP Error: ${response.status}`;
        let errorData = null;

        try {
          errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }

        const apiError: ApiError = {
          message: errorMessage,
          status: response.status,
          errors: errorData?.errors || {}
        };

        console.error('❌ API Error:', apiError);
        throw apiError;
      }

      const data = await response.json();
      
      // Detailed logging for debugging
      console.log('✅ API Success:', { 
        endpoint, 
        status: response.status,
        responseType: typeof data,
        responseKeys: data ? Object.keys(data) : 'NO_KEYS',
        fullResponse: data
      });

      if (endpoint.includes('/register/') || endpoint.includes('/login/')) {
        console.log('🔍 Auth Response Analysis:', {
          hasToken: !!data.token,
          tokenType: typeof data.token,
          hasUser: !!data.user,
          userType: typeof data.user,
          userKeys: data.user ? Object.keys(data.user) : 'NO_USER_KEYS',
          fullUserObject: data.user
        });
      }
      
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error
        const networkError: ApiError = {
          message: 'Network error. Please check your internet connection.',
          status: 0
        };
        console.error('🌐 Network Error:', networkError);
        throw networkError;
      }
      
      // Re-throw API errors
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('🔐 Login attempt for:', credentials.email);
    
    return this.request<LoginResponse>('/user/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    console.log('📝 Registration attempt for:', userData.email);
    
    // Prepare the payload based on what the backend expects
    const payload = {
      email: userData.email,
      password: userData.password,
      // Add name if the backend supports it
      ...(userData.name && { name: userData.name })
    };

    return this.request<RegisterResponse>('/user/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Utility method to set auth token for future requests
  setAuthToken(token: string | null) {
    this.authToken = token;
    if (token) {
      console.log('🔑 Setting auth token for future requests');
    } else {
      console.log('🔓 Clearing auth token');
    }
  }

  // User initialization endpoint
  async initUser(): Promise<any> {
    console.log('👤 Initializing user...');
    
    return this.request<any>('/walker/init_user', {
      method: 'POST',
    });
  }

  // Expense endpoints
  async addExpense(expenseData: ExpenseRequest): Promise<AddExpenseResponse> {
    console.log('💰 Adding expense:', {
      amount: expenseData.amount,
      category: expenseData.category,
      date: expenseData.date,
      description: expenseData.description
    });
    
    return this.request<AddExpenseResponse>('/walker/add_expense', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }

  async listExpenses(params: ListExpensesRequest): Promise<ListExpensesResponse> {
    console.log('📋 Listing expenses:', {
      skip: params.skip,
      limit: params.limit
    });
    
    return this.request<ListExpensesResponse>('/walker/list_expenses', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async deleteExpense(params: DeleteExpenseRequest): Promise<DeleteExpenseResponse> {
    console.log('🗑️ Deleting expense:', {
      expense_id: params.expense_id
    });
    
    return this.request<DeleteExpenseResponse>('/walker/delete_expense', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async addIncome(incomeData: IncomeRequest): Promise<AddIncomeResponse> {
    console.log('💰 Adding income:', {
      amount: incomeData.amount,
      date: incomeData.date,
      description: incomeData.description
    });
    
    return this.request<AddIncomeResponse>('/walker/add_income', {
      method: 'POST',
      body: JSON.stringify(incomeData),
    });
  }

  async listIncomes(params: ListIncomesRequest): Promise<ListIncomesResponse> {
    console.log('📋 Listing incomes:', {
      skip: params.skip,
      limit: params.limit
    });
    
    return this.request<ListIncomesResponse>('/walker/list_incomes', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async deleteIncome(params: DeleteIncomeRequest): Promise<DeleteIncomeResponse> {
    console.log('🗑️ Deleting income:', {
      income_id: params.income_id
    });
    
    return this.request<DeleteIncomeResponse>('/walker/delete_income', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Future endpoints can be added here
  // async getUserProfile(token: string): Promise<ApiUser> { ... }
  // async refreshToken(token: string): Promise<LoginResponse> { ... }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for testing
export { ApiService };