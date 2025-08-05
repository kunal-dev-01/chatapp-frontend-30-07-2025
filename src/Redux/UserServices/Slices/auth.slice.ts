import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { AxiosError } from "axios";

import {
  RegisterRequest,
  RegisterResponse,
  VerifyEmailResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  ApiError,
  AuthState,
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
};

// Utility function to extract error message
const extractErrorMessage = (error: unknown): string => {
  console.log("🔍 Full error object:", error);

  if (error instanceof AxiosError) {
    const errorData = error.response?.data;
    console.log("🔍 Error response data:", errorData);
    console.log("🔍 Error status:", error.response?.status);
    console.log("🔍 Error headers:", error.response?.headers);

    // Backend error response format: { status: 'error', message: '...', statusCode: 400 }
    if (errorData?.message) {
      return errorData.message;
    }

    // Handle validation errors array
    if (errorData?.errors && Array.isArray(errorData.errors)) {
      const errorMessages = errorData.errors.map((err: any) => {
        if (typeof err === "string") return err;
        if (err.message) return err.message;
        if (err.field && err.message) return `${err.field}: ${err.message}`;
        return JSON.stringify(err);
      });
      return errorMessages.join(", ");
    }

    // Handle different error formats
    if (errorData?.error && typeof errorData.error === "string") {
      return errorData.error;
    }

    // Handle nested data.message
    if (errorData?.data?.message) {
      return errorData.data.message;
    }

    // Handle status-specific errors
    if (error.response?.status) {
      switch (error.response.status) {
        case 400:
          return (
            errorData?.message ||
            "Invalid request. Please check your input and try again."
          );
        case 401:
          return (
            errorData?.message || "Unauthorized. Please check your credentials."
          );
        case 403:
          return errorData?.message || "Access forbidden.";
        case 404:
          return errorData?.message || "Resource not found.";
        case 409:
          return errorData?.message || "Resource already exists.";
        case 422:
          return (
            errorData?.message || "Validation failed. Please check your input."
          );
        case 500:
          return errorData?.message || "Server error. Please try again later.";
        default:
          return (
            errorData?.message ||
            `Error ${error.response.status}: Something went wrong.`
          );
      }
    }

    // Network or connection errors
    if (error.code === "ECONNABORTED") {
      return "Request timeout. Please check your connection and try again.";
    }

    if (
      error.code === "ERR_NETWORK" ||
      error.message.includes("Network Error")
    ) {
      return "Network error. Please check your internet connection and try again.";
    }

    if (error.code === "ECONNREFUSED") {
      return "Unable to connect to server. Please try again later.";
    }

    // Fallback to axios error message
    if (error.message) {
      return error.message;
    }
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Last resort
  return "An unexpected error occurred. Please try again.";
};

// Async thunks
export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterRequest,
  { rejectValue: ApiError }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    console.log("🚀 Sending registration request:", userData);
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      userData
    );
    console.log("✅ Registration response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Registration error:", error);
    const errorMessage = extractErrorMessage(error);
    const statusCode =
      error instanceof AxiosError ? error.response?.status : undefined;

    return rejectWithValue({
      message: errorMessage,
      statusCode,
      errors:
        error instanceof AxiosError && error.response?.data?.errors
          ? error.response.data.errors
          : undefined,
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
    const response = await api.get<VerifyEmailResponse>(
      `/auth/verify-email/${token}`
    );
    console.log("✅ Email verification response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Email verification error:", error);
    const errorMessage = extractErrorMessage(error);
    const statusCode =
      error instanceof AxiosError ? error.response?.status : undefined;

    return rejectWithValue({
      message: errorMessage,
      statusCode,
      errors:
        error instanceof AxiosError && error.response?.data?.errors
          ? error.response.data.errors
          : undefined,
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
    const response = await api.post<ResendVerificationResponse>(
      "/auth/resend-verification",
      emailData
    );
    console.log("✅ Resend verification response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Resend verification error:", error);
    const errorMessage = extractErrorMessage(error);
    const statusCode =
      error instanceof AxiosError ? error.response?.status : undefined;

    return rejectWithValue({
      message: errorMessage,
      statusCode,
      errors:
        error instanceof AxiosError && error.response?.data?.errors
          ? error.response.data.errors
          : undefined,
    });
  }
});

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Clear register state
    clearRegisterState: (state) => {
      if (!state.register) {
        state.register = {
          loading: false,
          error: null,
          success: false,
          message: null,
        };
      } else {
        state.register.loading = false;
        state.register.error = null;
        state.register.success = false;
        state.register.message = null;
      }
    },

    // Clear verify email state
    clearVerifyEmailState: (state) => {
      if (!state.verifyEmail) {
        state.verifyEmail = {
          loading: false,
          error: null,
          success: false,
          message: null,
        };
      } else {
        state.verifyEmail.loading = false;
        state.verifyEmail.error = null;
        state.verifyEmail.success = false;
        state.verifyEmail.message = null;
      }
    },

    // Clear resend verification state
    clearResendVerificationState: (state) => {
      if (!state.resendVerification) {
        state.resendVerification = {
          loading: false,
          error: null,
          success: false,
          message: null,
        };
      } else {
        state.resendVerification.loading = false;
        state.resendVerification.error = null;
        state.resendVerification.success = false;
        state.resendVerification.message = null;
      }
    },

    // Clear all auth states
    clearAllAuthStates: (state) => {
      state.register = initialState.register;
      state.verifyEmail = initialState.verifyEmail;
      state.resendVerification = initialState.resendVerification;
    },

    // Refresh token success
    refreshTokenSuccess: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      // Clear all states on logout
      state.register = initialState.register;
      state.verifyEmail = initialState.verifyEmail;
      state.resendVerification = initialState.resendVerification;
    },

    // Update user email verification status
    updateUserEmailVerification: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.isEmailVerified = action.payload;
      }
    },
  },

  extraReducers: (builder) => {
    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        if (!state.register) {
          state.register = {
            loading: false,
            error: null,
            success: false,
            message: null,
          };
        }
        state.register.loading = true;
        state.register.error = null;
        state.register.success = false;
        state.register.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        if (!state.register) {
          state.register = {
            loading: false,
            error: null,
            success: false,
            message: null,
          };
        }
        state.register.loading = false;
        state.register.error = null;
        state.register.success = true;
        state.register.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        if (!state.register) {
          state.register = {
            loading: false,
            error: null,
            success: false,
            message: null,
          };
        }
        state.register.loading = false;
        state.register.error = action.payload?.message || "Registration failed";
        state.register.success = false;
        state.register.message = null;
      });

    // Verify email
    builder
      .addCase(verifyEmail.pending, (state) => {
        if (!state.verifyEmail) {
          state.verifyEmail = {
            loading: false,
            error: null,
            success: false,
            message: null,
          };
        }
        state.verifyEmail.loading = true;
        state.verifyEmail.error = null;
        state.verifyEmail.success = false;
        state.verifyEmail.message = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        if (!state.verifyEmail) {
          state.verifyEmail = {
            loading: false,
            error: null,
            success: false,
            message: null,
          };
        }
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
        if (!state.verifyEmail) {
          state.verifyEmail = {
            loading: false,
            error: null,
            success: false,
            message: null,
          };
        }
        state.verifyEmail.loading = false;
        state.verifyEmail.error =
          action.payload?.message || "Email verification failed";
        state.verifyEmail.success = false;
        state.verifyEmail.message = null;
      });

    // Resend verification email
    builder
      .addCase(resendVerificationEmail.pending, (state) => {
        if (!state.resendVerification) {
          state.resendVerification = {
            loading: false,
            error: null,
            success: false,
            message: null,
          };
        }
        state.resendVerification.loading = true;
        state.resendVerification.error = null;
        state.resendVerification.success = false;
        state.resendVerification.message = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state, action) => {
        if (!state.resendVerification) {
          state.resendVerification = {
            loading: false,
            error: null,
            success: false,
            message: null,
          };
        }
        state.resendVerification.loading = false;
        state.resendVerification.error = null;
        state.resendVerification.success = true;
        state.resendVerification.message = action.payload.message;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        if (!state.resendVerification) {
          state.resendVerification = {
            loading: false,
            error: null,
            success: false,
            message: null,
          };
        }
        state.resendVerification.loading = false;
        state.resendVerification.error =
          action.payload?.message || "Failed to resend verification email";
        state.resendVerification.success = false;
        state.resendVerification.message = null;
      });
  },
});

// Export actions
export const {
  clearRegisterState,
  clearVerifyEmailState,
  clearResendVerificationState,
  clearAllAuthStates,
  refreshTokenSuccess,
  logout,
  updateUserEmailVerification,
} = authSlice.actions;

// Export selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;

// Individual state selectors
export const selectRegisterState = (state: { auth: AuthState }) =>
  state.auth.register;
export const selectVerifyEmailState = (state: { auth: AuthState }) =>
  state.auth.verifyEmail;
export const selectResendVerificationState = (state: { auth: AuthState }) =>
  state.auth.resendVerification;

// Export reducer
export default authSlice.reducer;
