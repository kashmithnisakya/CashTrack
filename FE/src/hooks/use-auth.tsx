import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, LoginRequest, RegisterRequest, ApiError } from '@/types/api';
import { apiService } from '@/services/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AUTH_TOKEN_KEY = 'cashtrack-auth-token';
const AUTH_USER_KEY = 'cashtrack-auth-user';

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // Start with loading to check stored auth
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const storedUser = localStorage.getItem(AUTH_USER_KEY);

        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser);
          
          // Check if token is expired
          const currentTime = Math.floor(Date.now() / 1000);
          if (user.expiration && user.expiration > currentTime) {
            console.log('🔄 Restoring auth session for:', user.email);
            setState({
              user,
              token: storedToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            apiService.setAuthToken(storedToken);
            return;
          } else {
            console.log('⏰ Stored token expired, clearing auth');
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_USER_KEY);
          }
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
      }

      setState(prev => ({ ...prev, isLoading: false }));
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('🔄 Starting login for:', credentials.email);
      const response = await apiService.login(credentials);
      
      console.log('📋 Login response structure:', {
        hasToken: !!response.token,
        hasUser: !!response.user,
        userStructure: response.user ? Object.keys(response.user) : 'NO_USER',
        responseKeys: Object.keys(response)
      });

      // Validate response structure with detailed error messages
      if (!response) {
        throw new Error('No response received from login API');
      }

      if (!response.token) {
        console.error('🚫 Missing token in response:', response);
        throw new Error('No token received from login API');
      }

      if (!response.user) {
        console.error('🚫 Missing user data in response:', response);
        throw new Error('No user data received from login API');
      }

      if (typeof response.user !== 'object') {
        console.error('🚫 User data is not an object:', typeof response.user, response.user);
        throw new Error('Invalid user data format in login response');
      }

      if (!response.user.email) {
        console.error('🚫 Missing email in user data:', response.user);
        throw new Error('User email not found in login response');
      }
      
      // Store auth data
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
      
      // Set auth token for future requests
      apiService.setAuthToken(response.token);

      // Initialize user after successful login
      try {
        console.log('🔄 Initializing user after login...');
        const initResponse = await apiService.initUser();
        console.log('✅ User initialization successful:', initResponse);
      } catch (initError) {
        console.warn('⚠️ User initialization failed (continuing with login):', initError);
        // Don't fail the login process if init_user fails
      }

      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log('✅ Login successful for:', response.user.email);
    } catch (error) {
      console.error('❌ Login failed:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as ApiError).message;
      }
      
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      
      throw error; // Re-throw to let components handle it
    }
  };

  const register = async (userData: RegisterRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('🔄 Starting registration for:', userData.email);
      const registerResponse = await apiService.register(userData);
      
      console.log('📋 Registration response:', registerResponse);

      // Validate registration response
      if (!registerResponse || !registerResponse.message) {
        throw new Error('Invalid registration response');
      }

      console.log('✅ Registration successful, now logging in...');
      
      // After successful registration, automatically login to get token
      const loginCredentials: LoginRequest = {
        email: userData.email,
        password: userData.password
      };
      
      const loginResponse = await apiService.login(loginCredentials);
      
      console.log('📋 Login after registration response structure:', {
        hasToken: !!loginResponse.token,
        hasUser: !!loginResponse.user,
        userStructure: loginResponse.user ? Object.keys(loginResponse.user) : 'NO_USER',
        responseKeys: Object.keys(loginResponse)
      });

      // Validate login response structure
      if (!loginResponse) {
        throw new Error('No response received from login API after registration');
      }

      if (!loginResponse.token) {
        console.error('🚫 Missing token in login response:', loginResponse);
        throw new Error('No token received from login API after registration');
      }

      if (!loginResponse.user) {
        console.error('🚫 Missing user data in login response:', loginResponse);
        throw new Error('No user data received from login API after registration');
      }

      if (typeof loginResponse.user !== 'object') {
        console.error('🚫 User data is not an object:', typeof loginResponse.user, loginResponse.user);
        throw new Error('Invalid user data format in login response after registration');
      }

      if (!loginResponse.user.email) {
        console.error('🚫 Missing email in user data:', loginResponse.user);
        throw new Error('User email not found in login response after registration');
      }
      
      // Store auth data from login response
      localStorage.setItem(AUTH_TOKEN_KEY, loginResponse.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(loginResponse.user));
      
      // Set auth token for future requests
      apiService.setAuthToken(loginResponse.token);

      // Initialize user after successful registration and login
      try {
        console.log('🔄 Initializing user after registration...');
        const initResponse = await apiService.initUser();
        console.log('✅ User initialization successful after registration:', initResponse);
      } catch (initError) {
        console.warn('⚠️ User initialization failed (continuing with registration):', initError);
        // Don't fail the registration process if init_user fails
      }

      setState({
        user: loginResponse.user,
        token: loginResponse.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log('✅ Registration and login successful for:', loginResponse.user.email);
    } catch (error) {
      console.error('❌ Registration/Login failed:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as ApiError).message;
      }
      
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      
      throw error; // Re-throw to let components handle it
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    
    // Clear stored auth data
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    
    // Clear auth token
    apiService.setAuthToken(null);

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}