import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/utils/api';
import { AxiosError } from 'axios';

// Types - You'll need to add these to your auth.type.ts file
import {
  AuthState,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  CheckAuthResponse,
  RefreshTokenResponse,
  LogoutResponse,
  ApiError,
  User,
} from '../types/auth.type';

// Additional types you'll need to add to your auth.type.ts


// Initial state with all endpoints
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  
  register: {
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  
  verifyEmail: {
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  
  resendVerification: {
    loading: false,
    error: null,
    success: false,
    message: null,
  },

  login: {
    loading: false,
    error: null,
    success: false,
    message: null,
  },

  logout: {
    loading: false,
    error: null,
    success: false,
    message: null,
  },

  forgotPassword: {
    loading: false,
    error: null,
    success: false,
    message: null,
  },

  resetPassword: {
    loading: false,
    error: null,
    success: false,
    message: null,
  },

  checkAuth: {
    loading: false,
    error: null,
    success: false,
    message: null,
  },

  refreshToken: {
    loading: false,
    error: null,
    success: false,
    message: null,
  },
};

// Utility function to extract error message
const extractErrorMessage = (error: unknown): string => {
  console.log("🔍 Error details:", error);
  
  if (error instanceof AxiosError) {
    const errorData = error.response?.data;
    console.log("🔍 Error response data:", errorData);
    
    // Handle validation errors (usually an array)
    if (errorData?.errors && Array.isArray(errorData.errors)) {
      return errorData.errors.join(', ');
    }
    
    // Handle single error message
    if (errorData?.message) {
      return errorData.message;
    }
    
    // Handle express-validator errors format
    if (errorData?.error && typeof errorData.error === 'string') {
      return errorData.error;
    }
    
    // Handle different error formats from your backend
    if (errorData?.data?.message) {
      return errorData.data.message;
    }
    
    // Handle status-based errors
    if (error.response?.status) {
      switch (error.response.status) {
        case 400:
          return errorData?.message || 'Invalid request. Please check your input.';
        case 401:
          return 'Unauthorized. Please check your credentials.';
        case 403:
          return 'Access forbidden.';
        case 404:
          return 'Resource not found.';
        case 409:
          return errorData?.message || 'Resource already exists.';
        case 422:
          return errorData?.message || 'Validation failed.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return errorData?.message || `Error ${error.response.status}: ${error.response.statusText}`;
      }
    }
    
    // Network or timeout errors
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please check your connection and try again.';
    }
    
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      return 'Network error. Please check your internet connection.';
    }
    
    // Fallback to error message
    if (error.message) {
      return error.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// ====================== ALL ASYNC THUNKS ====================== //

// 1. Register User
export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterRequest,
  { rejectValue: ApiError }
>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log("🚀 Sending registration request:", userData);
      const response = await api.post<RegisterResponse>('/auth/register', userData);
      console.log("✅ Registration response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Registration error:", error);
      const errorMessage = extractErrorMessage(error);
      const statusCode = error instanceof AxiosError ? error.response?.status : undefined;
      
      return rejectWithValue({
        message: errorMessage,
        statusCode,
        errors: error instanceof AxiosError && error.response?.data?.errors 
          ? error.response.data.errors 
          : undefined
      });
    }
  }
);

// 2. Login User
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: ApiError }
>(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      console.log("🚀 Sending login request:", loginData);
      const response = await api.post<LoginResponse>('/auth/login', loginData);
      console.log("✅ Login response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Login error:", error);
      const errorMessage = extractErrorMessage(error);
      const statusCode = error instanceof AxiosError ? error.response?.status : undefined;
      
      return rejectWithValue({
        message: errorMessage,
        statusCode,
        errors: error instanceof AxiosError && error.response?.data?.errors 
          ? error.response.data.errors 
          : undefined
      });
    }
  }
);

// 3. Logout User
export const logoutUser = createAsyncThunk<
  LogoutResponse,
  void,
  { rejectValue: ApiError }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      console.log("🚀 Sending logout request");
      const response = await api.post<LogoutResponse>('/auth/logout');
      console.log("✅ Logout response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Logout error:", error);
      const errorMessage = extractErrorMessage(error);
      const statusCode = error instanceof AxiosError ? error.response?.status : undefined;
      
      return rejectWithValue({
        message: errorMessage,
        statusCode,
        errors: error instanceof AxiosError && error.response?.data?.errors 
          ? error.response.data.errors 
          : undefined
      });
    }
  }
);

// 4. Refresh Token
export const refreshAccessToken = createAsyncThunk<
  RefreshTokenResponse,
  void,
  { rejectValue: ApiError }
>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      console.log("🚀 Refreshing access token");
      const response = await api.post<RefreshTokenResponse>('/auth/refresh-token');
      console.log("✅ Refresh token response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Refresh token error:", error);
      const errorMessage = extractErrorMessage(error);
      const statusCode = error instanceof AxiosError ? error.response?.status : undefined;
      
      return rejectWithValue({
        message: errorMessage,
        statusCode,
        errors: error instanceof AxiosError && error.response?.data?.errors 
          ? error.response.data.errors 
          : undefined
      });
    }
  }
);

// 5. Verify Email
export const verifyEmail = createAsyncThunk<
  VerifyEmailResponse,
  string,
  { rejectValue: ApiError }
>(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      console.log("🚀 Sending email verification request for token:", token);
      const response = await api.get<VerifyEmailResponse>(`/auth/verify-email/${token}`);
      console.log("✅ Email verification response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Email verification error:", error);
      const errorMessage = extractErrorMessage(error);
      const statusCode = error instanceof AxiosError ? error.response?.status : undefined;
      
      return rejectWithValue({
        message: errorMessage,
        statusCode,
        errors: error instanceof AxiosError && error.response?.data?.errors 
          ? error.response.data.errors 
          : undefined
      });
    }
  }
);

// 6. Resend Verification Email
export const resendVerificationEmail = createAsyncThunk<
  ResendVerificationResponse,
  ResendVerificationRequest,
  { rejectValue: ApiError }
>(
  'auth/resendVerification',
  async (emailData, { rejectWithValue }) => {
    try {
      console.log("🚀 Sending resend verification request:", emailData);
      const response = await api.post<ResendVerificationResponse>(
        '/auth/resend-verification', 
        emailData
      );
      console.log("✅ Resend verification response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Resend verification error:", error);
      const errorMessage = extractErrorMessage(error);
      const statusCode = error instanceof AxiosError ? error.response?.status : undefined;
      
      return rejectWithValue({
        message: errorMessage,
        statusCode,
        errors: error instanceof AxiosError && error.response?.data?.errors 
          ? error.response.data.errors 
          : undefined
      });
    }
  }
);

// 7. Forgot Password
export const forgotPassword = createAsyncThunk<
  ForgotPasswordResponse,
  ForgotPasswordRequest,
  { rejectValue: ApiError }
>(
  'auth/forgotPassword',
  async (emailData, { rejectWithValue }) => {
    try {
      console.log("🚀 Sending forgot password request:", emailData);
      const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', emailData);
      console.log("✅ Forgot password response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Forgot password error:", error);
      const errorMessage = extractErrorMessage(error);
      const statusCode = error instanceof AxiosError ? error.response?.status : undefined;
      
      return rejectWithValue({
        message: errorMessage,
        statusCode,
        errors: error instanceof AxiosError && error.response?.data?.errors 
          ? error.response.data.errors 
          : undefined
      });
    }
  }
);

// 8. Reset Password
export const resetPassword = createAsyncThunk<
  ResetPasswordResponse,
  { token: string; passwordData: ResetPasswordRequest },
  { rejectValue: ApiError }
>(
  'auth/resetPassword',
  async ({ token, passwordData }, { rejectWithValue }) => {
    try {
      console.log("🚀 Sending reset password request for token:", token);
      const response = await api.patch<ResetPasswordResponse>(
        `/auth/reset-password/${token}`, 
        passwordData
      );
      console.log("✅ Reset password response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Reset password error:", error);
      const errorMessage = extractErrorMessage(error);
      const statusCode = error instanceof AxiosError ? error.response?.status : undefined;
      
      return rejectWithValue({
        message: errorMessage,
        statusCode,
        errors: error instanceof AxiosError && error.response?.data?.errors 
          ? error.response.data.errors 
          : undefined
      });
    }
  }
);

// 9. Check Auth
export const checkAuth = createAsyncThunk<
  CheckAuthResponse,
  void,
  { rejectValue: ApiError }
>(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      console.log("🚀 Checking authentication status");
      const response = await api.get<CheckAuthResponse>('/auth/check-auth');
      console.log("✅ Check auth response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Check auth error:", error);
      const errorMessage = extractErrorMessage(error);
      const statusCode = error instanceof AxiosError ? error.response?.status : undefined;
      
      return rejectWithValue({
        message: errorMessage,
        statusCode,
        errors: error instanceof AxiosError && error.response?.data?.errors 
          ? error.response.data.errors 
          : undefined
      });
    }
  }
);

// ====================== AUTH SLICE ====================== //

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear register state
    clearRegisterState: (state) => {
      state.register = initialState.register;
    },
    
    // Clear verify email state
    clearVerifyEmailState: (state) => {
      state.verifyEmail = initialState.verifyEmail;
    },

    // Clear login state
    clearLoginState: (state) => {
      state.login = initialState.login;
    },

    // Clear logout state
    clearLogoutState: (state) => {
      state.logout = initialState.logout;
    },
    
    // Clear resend verification state
    clearResendVerificationState: (state) => {
      state.resendVerification = initialState.resendVerification;
    },

    // Clear forgot password state
    clearForgotPasswordState: (state) => {
      state.forgotPassword = initialState.forgotPassword;
    },

    // Clear reset password state
    clearResetPasswordState: (state) => {
      state.resetPassword = initialState.resetPassword;
    },

    // Clear check auth state
    clearCheckAuthState: (state) => {
      state.checkAuth = initialState.checkAuth;
    },

    // Clear refresh token state
    clearRefreshTokenState: (state) => {
      state.refreshToken = initialState.refreshToken;
    },
    
    // Clear all auth states
    clearAllAuthStates: (state) => {
      state.register = initialState.register;
      state.verifyEmail = initialState.verifyEmail;
      state.resendVerification = initialState.resendVerification;
      state.login = initialState.login;
      state.logout = initialState.logout;
      state.forgotPassword = initialState.forgotPassword;
      state.resetPassword = initialState.resetPassword;
      state.checkAuth = initialState.checkAuth;
      state.refreshToken = initialState.refreshToken;
    },
    
    // Manual logout (clears state without API call)
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      // Clear all states on logout
      Object.assign(state, {
        ...state,
        register: initialState.register,
        verifyEmail: initialState.verifyEmail,
        resendVerification: initialState.resendVerification,
        login: initialState.login,
        logout: initialState.logout,
        forgotPassword: initialState.forgotPassword,
        resetPassword: initialState.resetPassword,
        checkAuth: initialState.checkAuth,
        refreshToken: initialState.refreshToken,
      });
    },
    
    // Update user email verification status
    updateUserEmailVerification: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.isEmailVerified = action.payload;
      }
    },

    // Set user data (useful for checkAuth)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    // Set access token
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    // Update user data
    updateUserData: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  
  extraReducers: (builder) => {
    // ====================== REGISTER ====================== //
    builder
      .addCase(registerUser.pending, (state) => {
        state.register.loading = true;
        state.register.error = null;
        state.register.success = false;
        state.register.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.register.loading = false;
        state.register.error = null;
        state.register.success = true;
        state.register.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.register.loading = false;
        state.register.error = action.payload?.message || 'Registration failed';
        state.register.success = false;
        state.register.message = null;
      });
    
    // ====================== LOGIN ====================== //
    builder
      .addCase(loginUser.pending, (state) => {
        state.login.loading = true;
        state.login.error = null;
        state.login.success = false;
        state.login.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.login.loading = false;
        state.login.error = null;
        state.login.success = true;
        state.login.message = action.payload.message;

        // Update user data and authentication status
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.login.loading = false;
        state.login.error = action.payload?.message || 'Login failed';
        state.login.success = false;
        state.login.message = null;
      });

    // ====================== LOGOUT ====================== //
    builder
      .addCase(logoutUser.pending, (state) => {
        state.logout.loading = true;
        state.logout.error = null;
        state.logout.success = false;
        state.logout.message = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.logout.loading = false;
        state.logout.error = null;
        state.logout.success = true;
        state.logout.message = action.payload.message;

        // Clear authentication data
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logout.loading = false;
        state.logout.error = action.payload?.message || 'Logout failed';
        state.logout.success = false;
        state.logout.message = null;

        // Even if logout API fails, clear local state
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });

    // ====================== REFRESH TOKEN ====================== //
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.refreshToken.loading = true;
        state.refreshToken.error = null;
        state.refreshToken.success = false;
        state.refreshToken.message = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.refreshToken.loading = false;
        state.refreshToken.error = null;
        state.refreshToken.success = true;
        state.refreshToken.message = 'Token refreshed successfully';
        state.accessToken = action.payload.data.accessToken;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.refreshToken.loading = false;
        state.refreshToken.error = action.payload?.message || 'Token refresh failed';
        state.refreshToken.success = false;
        state.refreshToken.message = null;

        // If refresh fails, logout user
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });

    // ====================== VERIFY EMAIL ====================== //
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.verifyEmail.loading = true;
        state.verifyEmail.error = null;
        state.verifyEmail.success = false;
        state.verifyEmail.message = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.verifyEmail.loading = false;
        state.verifyEmail.error = null;
        state.verifyEmail.success = true;
        state.verifyEmail.message = action.payload.message;
        
        // Update user data if available
        if (state.user && action.payload.data.user) {
          state.user = { ...state.user, ...action.payload.data.user };
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verifyEmail.loading = false;
        state.verifyEmail.error = action.payload?.message || 'Email verification failed';
        state.verifyEmail.success = false;
        state.verifyEmail.message = null;
      });
    
    // ====================== RESEND VERIFICATION ====================== //
    builder
      .addCase(resendVerificationEmail.pending, (state) => {
        state.resendVerification.loading = true;
        state.resendVerification.error = null;
        state.resendVerification.success = false;
        state.resendVerification.message = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state, action) => {
        state.resendVerification.loading = false;
        state.resendVerification.error = null;
        state.resendVerification.success = true;
        state.resendVerification.message = action.payload.message;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.resendVerification.loading = false;
        state.resendVerification.error = action.payload?.message || 'Failed to resend verification email';
        state.resendVerification.success = false;
        state.resendVerification.message = null;
      });

    // ====================== FORGOT PASSWORD ====================== //
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPassword.loading = true;
        state.forgotPassword.error = null;
        state.forgotPassword.success = false;
        state.forgotPassword.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPassword.loading = false;
        state.forgotPassword.error = null;
        state.forgotPassword.success = true;
        state.forgotPassword.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPassword.loading = false;
        state.forgotPassword.error = action.payload?.message || 'Failed to send password reset email';
        state.forgotPassword.success = false;
        state.forgotPassword.message = null;
      });

    // ====================== RESET PASSWORD ====================== //
    builder
      .addCase(resetPassword.pending, (state) => {
        state.resetPassword.loading = true;
        state.resetPassword.error = null;
        state.resetPassword.success = false;
        state.resetPassword.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.error = null;
        state.resetPassword.success = true;
        state.resetPassword.message = action.payload.message;

        // Auto login after successful password reset
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.error = action.payload?.message || 'Password reset failed';
        state.resetPassword.success = false;
        state.resetPassword.message = null;
      });

    // ====================== CHECK AUTH ====================== //
    builder
      .addCase(checkAuth.pending, (state) => {
        state.checkAuth.loading = true;
        state.checkAuth.error = null;
        state.checkAuth.success = false;
        state.checkAuth.message = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.checkAuth.loading = false;
        state.checkAuth.error = null;
        state.checkAuth.success = true;
        state.checkAuth.message = 'Authentication verified';
        
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.checkAuth.loading = false;
        state.checkAuth.error = action.payload?.message || 'Authentication check failed';
        state.checkAuth.success = false;
        state.checkAuth.message = null;
        
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

// ====================== EXPORT ACTIONS ====================== //
export const {
  clearRegisterState,
  clearVerifyEmailState,
  clearResendVerificationState,
  clearLoginState,
  clearLogoutState,
  clearForgotPasswordState,
  clearResetPasswordState,
  clearCheckAuthState,
  clearRefreshTokenState,
  clearAllAuthStates,
  logout,
  updateUserEmailVerification,
  setUser,
  setAccessToken,
  updateUserData,
} = authSlice.actions;

// ====================== EXPORT SELECTORS ====================== //
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;

// Individual state selectors
export const selectRegisterState = (state: { auth: AuthState }) => state.auth.register;
export const selectVerifyEmailState = (state: { auth: AuthState }) => state.auth.verifyEmail;
export const selectResendVerificationState = (state: { auth: AuthState }) => state.auth.resendVerification;
export const selectLoginState = (state: { auth: AuthState }) => state.auth.login;
export const selectLogoutState = (state: { auth: AuthState }) => state.auth.logout;
export const selectForgotPasswordState = (state: { auth: AuthState }) => state.auth.forgotPassword;
export const selectResetPasswordState = (state: { auth: AuthState }) => state.auth.resetPassword;
export const selectCheckAuthState = (state: { auth: AuthState }) => state.auth.checkAuth;
export const selectRefreshTokenState = (state: { auth: AuthState }) => state.auth.refreshToken;

// Export reducer
export default authSlice.reducer;