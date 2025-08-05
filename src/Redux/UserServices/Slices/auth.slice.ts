import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  User,
  LoginCredentials,
  RegisterCredentials,
} from "../types/auth.type";
import api from "@/utils/app";
import { AxiosError } from "axios";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,

  isCheckingAuth: false,
  isRegistering: false,
  isLoggingIn: false,
  isVerifyingEmail: false,
  isResendingVerificationEmail: false,
  isLogoutting: false,
  isForgotPassword: false,
  isResettingPassword: false,

  isCheckingAuthError: null,
  isRegisteredError: null,
  isLoginError: null,
  isVerifyingEmailError: null,
  isResendingVerificationEmailError: null,
  isLogoutError: null,
  isForgotPasswordError: null,
  isResettingPasswordError: null,

  isInitialized: false,
};

// Helper function to extract error message
const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An error occurred"
    );
  }
  return "Network error occurred";
};

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      console.log("🔐 Attempting login...");
      const response = await api.post("/auth/login", credentials);
      console.log("✅ Login successful", response.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Login error:", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      console.log("📝 Attempting registration...");
      const response = await api.post("/auth/register", credentials);
      console.log("✅ Registration successful", response.data);
      // Return the user data from response
      return response.data.data;
    } catch (error) {
      console.error("❌ Registration error:", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Check Auth
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue, getState }) => {
    try {
      console.log("🔍 Checking authentication...");
      const state = getState() as { auth: AuthState };

      if (!state.auth.accessToken) {
        console.log("❌ No access token found");
        return rejectWithValue("No token found");
      }

      const response = await api.get("/auth/check-auth");
      console.log("✅ Auth check successful", response.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Auth check error:", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🚪 Attempting logout...");
      await api.post("/auth/logout");
      console.log("✅ Logout successful");
      return null;
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Even if logout fails on server, we should clear local state
      return null;
    }
  }
);

// Verify Email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token: string, { rejectWithValue }) => {
    try {
      console.log("📧 Verifying email...");
      const response = await api.get(`/auth/verify-email/${token}`);
      console.log("✅ Email verification successful", response.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Email verification error:", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Resend Verification Email
export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerification",
  async (email: string, { rejectWithValue }) => {
    try {
      console.log("📧 Resending verification email...");
      const response = await api.post("/auth/resend-verification", { email });
      console.log("✅ Verification email sent", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Resend verification error:", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      console.log("🔑 Requesting password reset...");
      const response = await api.post("/auth/forgot-password", { email });
      console.log("✅ Password reset email sent", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Forgot password error:", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    {
      token,
      password,
      confirmPassword,
    }: { token: string; password: string; confirmPassword: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("🔑 Resetting password...");
      const response = await api.patch(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      console.log("✅ Password reset successful", response.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Password reset error:", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearRegiterError: (state) => {
      state.isRegisteredError = null;
    },
    clearLoginError: (state) => {
      state.isLoginError = null;
    },
    clearVerifyEmailError: (state) => {
      state.isVerifyingEmailError = null;
    },
    clearResendVerificationEmailError: (state) => {
      state.isResendingVerificationEmailError = null;
    },
    clearLogoutError: (state) => {
      state.isLogoutError = null;
    },
    clearForgotPasswordError: (state) => {
      state.isForgotPasswordError = null;
    },
    clearResetPasswordError: (state) => {
      state.isResettingPasswordError = null;
    },
    clearCheckAuthError: (state) => {
      state.isCheckingAuthError = null;
    },
    refreshTokenSuccess: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLogoutting = false;
      state.isLogoutError = null;
      state.isInitialized = false;
    },
    resetLoadingStates: (state) => {
      // Reset all loading states and errors on app initialization
      state.isCheckingAuth = false;
      state.isRegistering = false;
      state.isLoggingIn = false;
      state.isVerifyingEmail = false;
      state.isResendingVerificationEmail = false;
      state.isLogoutting = false;
      state.isForgotPassword = false;
      state.isResettingPassword = false;
      
      state.isCheckingAuthError = null;
      state.isRegisteredError = null;
      state.isLoginError = null;
      state.isVerifyingEmailError = null;
      state.isResendingVerificationEmailError = null;
      state.isLogoutError = null;
      state.isForgotPasswordError = null;
      state.isResettingPasswordError = null;
    },
  },
  extraReducers: (builder) => {
    // Login Cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoggingIn = true;
        state.isLoginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.isLoginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isLoginError = action.payload as string;
      });

    // Register Cases - FIXED
    builder
      .addCase(registerUser.pending, (state) => {
        state.isRegistering = true;
        state.isRegisteredError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isRegistering = false;
        // Store user data but don't set as authenticated until email is verified
        if (action.payload?.user) {
          state.user = action.payload.user;
        }
        state.isRegisteredError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRegistering = false;
        state.isRegisteredError = action.payload as string;
      });

    // Check Auth Cases
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
        state.isCheckingAuthError = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isCheckingAuthError = null;
        state.isInitialized = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isCheckingAuth = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isCheckingAuthError = action.payload as string;
        state.isInitialized = true;
      });

    // Logout Cases
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLogoutting = true;
        state.isLogoutError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLogoutting = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isLogoutError = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLogoutting = false;
        // Even if logout fails, clear the state
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isLogoutError = action.payload as string;
      });

    // Verify Email Cases
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isVerifyingEmail = true;
        state.isVerifyingEmailError = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isVerifyingEmail = false;
        // Update user with verified email status
        if (action.payload?.user) {
          state.user = { ...state.user, ...action.payload.user };
        }
        state.isVerifyingEmailError = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isVerifyingEmail = false;
        state.isVerifyingEmailError = action.payload as string;
      });

    // Resend Verification Email Cases
    builder
      .addCase(resendVerificationEmail.pending, (state) => {
        state.isResendingVerificationEmail = true;
        state.isResendingVerificationEmailError = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.isResendingVerificationEmail = false;
        state.isResendingVerificationEmailError = null;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.isResendingVerificationEmail = false;
        state.isResendingVerificationEmailError = action.payload as string;
      });

    // Forgot Password Cases
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isForgotPassword = true;
        state.isForgotPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isForgotPassword = false;
        state.isForgotPasswordError = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isForgotPassword = false;
        state.isForgotPasswordError = action.payload as string;
      });

    // Reset Password Cases
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isResettingPassword = true;
        state.isResettingPasswordError = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isResettingPassword = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.isResettingPasswordError = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isResettingPassword = false;
        state.isResettingPasswordError = action.payload as string;
      });
  },
});

export const {
  refreshTokenSuccess,
  updateUser,
  setInitialized,
  logout,
  resetLoadingStates,
  clearLogoutError,
  clearLoginError,
  clearResetPasswordError,
  clearRegiterError,
  clearVerifyEmailError,
  clearResendVerificationEmailError,
  clearForgotPasswordError,
  clearCheckAuthError,
} = authSlice.actions;

export default authSlice.reducer;