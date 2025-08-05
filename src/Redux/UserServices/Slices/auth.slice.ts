import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { AxiosError } from "axios";

import {
  User,
  ApiError,
  AuthState,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  VerifyEmailResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  CheckAuthResponse,
  RefreshTokenResponse,
} from "@/Redux/UserServices/types/auth.type";

// Initial state
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

// Enhanced utility function to extract error message
const extractErrorMessage = (error: unknown): string => {
  console.log("🔍 Full error object:", error);

  if (error instanceof AxiosError) {
    const errorData = error.response?.data;
    console.log("🔍 Error response data:", errorData);
    console.log("🔍 Error status:", error.response?.status);

    if (errorData) {
      // Handle validation errors array
      if (errorData.errors && Array.isArray(errorData.errors)) {
        const validationMessages = errorData.errors.map((err: string | { message?: string; field?: string }) => {
          if (typeof err === "string") return err;
          if (typeof err === "object" && err.message) return err.message;
          if (typeof err === "object" && err.field && err.message) return `${err.field}: ${err.message}`;
          return JSON.stringify(err);
        });

        if (validationMessages.length > 0) {
          return validationMessages.join(". ");
        }
      }

      // Main error message
      if (errorData.message) {
        return errorData.message;
      }

      // Handle nested error structures
      if (errorData.error?.message) {
        return errorData.error.message;
      }

      if (errorData.data?.message) {
        return errorData.data.message;
      }
    }

    // Handle different HTTP status codes
    const status = error.response?.status;
    switch (status) {
      case 400:
        return errorData?.message || "Invalid request. Please check your input.";
      case 401:
        return errorData?.message || "Invalid credentials.";
      case 403:
        return errorData?.message || "Access forbidden.";
      case 404:
        return errorData?.message || "Resource not found.";
      case 409:
        return errorData?.message || "Resource already exists.";
      case 422:
        return errorData?.message || "Validation failed.";
      case 500:
        return errorData?.message || "Server error. Please try again later.";
      default:
        return errorData?.message || `Error ${status}: Something went wrong.`;
    }
  }

  // Handle network errors
  if (error instanceof Error) {
    if (error.message.includes("Network Error")) {
      return "Network error. Please check your connection.";
    }
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred. Please try again.";
};

// Enhanced function to extract validation errors
const extractValidationErrors = (error: unknown): string[] => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data;

    if (errorData?.errors && Array.isArray(errorData.errors)) {
      return errorData.errors.map((err: string | { message?: string; field?: string }) => {
        if (typeof err === "string") return err;
        if (typeof err === "object" && err.message) return err.message;
        if (typeof err === "object" && err.field && err.message) return `${err.field}: ${err.message}`;
        return JSON.stringify(err);
      });
    }
  }

  return [];
};

// Async thunks
export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterRequest,
  { rejectValue: ApiError }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    console.log("🚀 Sending registration request:", userData);
    const response = await api.post<RegisterResponse>("/auth/register", userData);
    console.log("✅ Registration response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Registration error:", error);

    const errorMessage = extractErrorMessage(error);
    const validationErrors = extractValidationErrors(error);
    const statusCode = error instanceof AxiosError ? error.response?.status : undefined;

    return rejectWithValue({
      message: errorMessage,
      statusCode,
      errors: validationErrors.length > 0 ? validationErrors : undefined,
    });
  }
});

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: ApiError }
>("auth/login", async (loginData, { rejectWithValue }) => {
  try {
    console.log("🚀 Sending login request:", { identifier: loginData.identifier });
    const response = await api.post<LoginResponse>("/auth/login", loginData);
    console.log("✅ Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Login error:", error);

    const errorMessage = extractErrorMessage(error);
    const validationErrors = extractValidationErrors(error);
    const statusCode = error instanceof AxiosError ? error.response?.status : undefined;

    return rejectWithValue({
      message: errorMessage,
      statusCode,
      errors: validationErrors.length > 0 ? validationErrors : undefined,
    });
  }
});

export const logoutUser = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: ApiError }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    console.log("🚀 Sending logout request");
    const response = await api.post("/auth/logout");
    console.log("✅ Logout response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Logout error:", error);

    const errorMessage = extractErrorMessage(error);
    const statusCode = error instanceof AxiosError ? error.response?.status : undefined;

    return rejectWithValue({
      message: errorMessage,
      statusCode,
    });
  }
});

export const verifyEmail = createAsyncThunk<
  VerifyEmailResponse,
  string,
  { rejectValue: ApiError }
>("auth/verifyEmail", async (token, { rejectWithValue }) => {
  try {
    console.log("🚀 Sending email verification request for token:", token);
    const response = await api.get<VerifyEmailResponse>(`/auth/verify-email/${token}`);
    console.log("✅ Email verification response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Email verification error:", error);

    const errorMessage = extractErrorMessage(error);
    const validationErrors = extractValidationErrors(error);
    const statusCode = error instanceof AxiosError ? error.response?.status : undefined;

    return rejectWithValue({
      message: errorMessage,
      statusCode,
      errors: validationErrors.length > 0 ? validationErrors : undefined,
    });
  }
});

export const resendVerificationEmail = createAsyncThunk<
  ResendVerificationResponse,
  ResendVerificationRequest,
  { rejectValue: ApiError }
>("auth/resendVerification", async (emailData, { rejectWithValue }) => {
  try {
    console.log("🚀 Sending resend verification request:", emailData);
    const response = await api.post<ResendVerificationResponse>("/auth/resend-verification", emailData);
    console.log("✅ Resend verification response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Resend verification error:", error);

    const errorMessage = extractErrorMessage(error);
    const validationErrors = extractValidationErrors(error);
    const statusCode = error instanceof AxiosError ? error.response?.status : undefined;

    return rejectWithValue({
      message: errorMessage,
      statusCode,
      errors: validationErrors.length > 0 ? validationErrors : undefined,
    });
  }
});

export const forgotPassword = createAsyncThunk<
  ForgotPasswordResponse,
  ForgotPasswordRequest,
  { rejectValue: ApiError }
>("auth/forgotPassword", async (emailData, { rejectWithValue }) => {
  try {
    console.log("🚀 Sending forgot password request:", emailData);
    const response = await api.post<ForgotPasswordResponse>("/auth/forgot-password", emailData);
    console.log("✅ Forgot password response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Forgot password error:", error);

    const errorMessage = extractErrorMessage(error);
    const validationErrors = extractValidationErrors(error);
    const statusCode = error instanceof AxiosError ? error.response?.status : undefined;

    return rejectWithValue({
      message: errorMessage,
      statusCode,
      errors: validationErrors.length > 0 ? validationErrors : undefined,
    });
  }
});

export const resetPassword = createAsyncThunk<
  ResetPasswordResponse,
  { token: string; passwordData: ResetPasswordRequest },
  { rejectValue: ApiError }
>("auth/resetPassword", async ({ token, passwordData }, { rejectWithValue }) => {
  try {
    console.log("🚀 Sending reset password request for token:", token);
    const response = await api.post<ResetPasswordResponse>(`/auth/reset-password/${token}`, passwordData);
    console.log("✅ Reset password response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Reset password error:", error);

    const errorMessage = extractErrorMessage(error);
    const validationErrors = extractValidationErrors(error);
    const statusCode = error instanceof AxiosError ? error.response?.status : undefined;

    return rejectWithValue({
      message: errorMessage,
      statusCode,
      errors: validationErrors.length > 0 ? validationErrors : undefined,
    });
  }
});

export const checkAuth = createAsyncThunk<
  CheckAuthResponse,
  void,
  { rejectValue: ApiError }
>("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    console.log("🚀 Checking authentication status");
    const response = await api.get<CheckAuthResponse>("/auth/check");
    console.log("✅ Check auth response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Check auth error:", error);

    const errorMessage = extractErrorMessage(error);
    const statusCode = error instanceof AxiosError ? error.response?.status : undefined;

    return rejectWithValue({
      message: errorMessage,
      statusCode,
    });
  }
});

export const refreshAccessToken = createAsyncThunk<
  RefreshTokenResponse,
  void,
  { rejectValue: ApiError }
>("auth/refreshToken", async (_, { rejectWithValue }) => {
  try {
    console.log("🚀 Refreshing access token");
    const response = await api.post<RefreshTokenResponse>("/auth/refresh");
    console.log("✅ Refresh token response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Refresh token error:", error);

    const errorMessage = extractErrorMessage(error);
    const statusCode = error instanceof AxiosError ? error.response?.status : undefined;

    return rejectWithValue({
      message: errorMessage,
      statusCode,
    });
  }
});

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Clear individual states
    clearRegisterState: (state) => {
      state.register = initialState.register;
    },

    clearLoginState: (state) => {
      state.login = initialState.login;
    },

    clearLogoutState: (state) => {
      state.logout = initialState.logout;
    },

    clearVerifyEmailState: (state) => {
      state.verifyEmail = initialState.verifyEmail;
    },

    clearResendVerificationState: (state) => {
      state.resendVerification = initialState.resendVerification;
    },

    clearForgotPasswordState: (state) => {
      state.forgotPassword = initialState.forgotPassword;
    },

    clearResetPasswordState: (state) => {
      state.resetPassword = initialState.resetPassword;
    },

    clearCheckAuthState: (state) => {
      state.checkAuth = initialState.checkAuth;
    },

    clearRefreshTokenState: (state) => {
      state.refreshToken = initialState.refreshToken;
    },

    // Clear all auth states
    clearAllAuthStates: (state) => {
      state.register = initialState.register;
      state.login = initialState.login;
      state.logout = initialState.logout;
      state.verifyEmail = initialState.verifyEmail;
      state.resendVerification = initialState.resendVerification;
      state.forgotPassword = initialState.forgotPassword;
      state.resetPassword = initialState.resetPassword;
      state.checkAuth = initialState.checkAuth;
      state.refreshToken = initialState.refreshToken;
    },

    // Set authentication data
    setAuthData: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },

    // Update access token
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    // Update user data
    updateUserData: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Update user email verification status
    updateUserEmailVerification: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.isEmailVerified = action.payload;
      }
    },

    // Logout (clear all auth data)
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      // Clear all states on logout
      state.register = initialState.register;
      state.login = initialState.login;
      state.logout = initialState.logout;
      state.verifyEmail = initialState.verifyEmail;
      state.resendVerification = initialState.resendVerification;
      state.forgotPassword = initialState.forgotPassword;
      state.resetPassword = initialState.resetPassword;
      state.checkAuth = initialState.checkAuth;
      state.refreshToken = initialState.refreshToken;
    },
  },

  extraReducers: (builder) => {
    // Register user
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
        state.register.error = action.payload?.message || "Registration failed";
        state.register.success = false;
        state.register.message = null;

        if (action.payload?.errors) {
          console.log("🔍 Validation errors:", action.payload.errors);
        }
      });

    // Login user
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

        // Set auth data
        if (action.payload.data) {
          state.user = action.payload.data.user;
          state.accessToken = action.payload.data.accessToken;
          state.isAuthenticated = true;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.login.loading = false;
        state.login.error = action.payload?.message || "Login failed";
        state.login.success = false;
        state.login.message = null;
      });

    // Logout user
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

        // Clear auth data
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logout.loading = false;
        state.logout.error = action.payload?.message || "Logout failed";
        state.logout.success = false;
        state.logout.message = null;
      });

    // Verify email
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
        if (state.user && action.payload.data?.user) {
          state.user = { ...state.user, ...action.payload.data.user };
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verifyEmail.loading = false;
        state.verifyEmail.error = action.payload?.message || "Email verification failed";
        state.verifyEmail.success = false;
        state.verifyEmail.message = null;
      });

    // Resend verification email
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
        state.resendVerification.error = action.payload?.message || "Failed to resend verification email";
        state.resendVerification.success = false;
        state.resendVerification.message = null;
      });

    // Forgot password
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
        state.forgotPassword.error = action.payload?.message || "Failed to send reset email";
        state.forgotPassword.success = false;
        state.forgotPassword.message = null;
      });

    // Reset password
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

        // Set auth data if provided
        if (action.payload.data) {
          state.user = action.payload.data.user;
          state.accessToken = action.payload.data.accessToken;
          state.isAuthenticated = true;
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.error = action.payload?.message || "Password reset failed";
        state.resetPassword.success = false;
        state.resetPassword.message = null;
      });

    // Check auth
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
        state.checkAuth.message = action.payload.message;

        // Update user data
        if (action.payload.data?.user) {
          state.user = action.payload.data.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.checkAuth.loading = false;
        state.checkAuth.error = action.payload?.message || "Authentication check failed";
        state.checkAuth.success = false;
        state.checkAuth.message = null;

        // Clear auth data on auth check failure
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });

    // Refresh token
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
        state.refreshToken.message = action.payload.message;

        // Update access token
        if (action.payload.data?.accessToken) {
          state.accessToken = action.payload.data.accessToken;
        }
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.refreshToken.loading = false;
        state.refreshToken.error = action.payload?.message || "Token refresh failed";
        state.refreshToken.success = false;
        state.refreshToken.message = null;

        // Clear auth data on refresh failure
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const {
  clearRegisterState,
  clearLoginState,
  clearLogoutState,
  clearVerifyEmailState,
  clearResendVerificationState,
  clearForgotPasswordState,
  clearResetPasswordState,
  clearCheckAuthState,
  clearRefreshTokenState,
  clearAllAuthStates,
  setAuthData,
  updateAccessToken,
  updateUserData,
  updateUserEmailVerification,
  logout,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;