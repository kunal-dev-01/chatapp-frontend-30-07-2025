import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  User,
  LoginCredentials,
  RegisterCredentials,
} from "../types/auth.type";
import api from "@/utils/app"; // Fixed import path
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

// Async thunks with better error handling
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      console.log("🔐 Attempting login...");
      const response = await api.post("/auth/login", credentials);
      console.log("✅ Login successful");
      return response.data.data;
    } catch (error) {
      console.error("❌ Login error:", error);
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Login failed";
        return rejectWithValue(message);
      }
      return rejectWithValue("Network error occurred");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      console.log("📝 Attempting registration...");
      const response = await api.post("/auth/register", credentials);
      console.log("✅ Registration successful");
      return response.data;
    } catch (error) {
      console.error("❌ Registration error:", error);
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Registration failed";
        return rejectWithValue(message);
      }
      return rejectWithValue("Network error occurred");
    }
  }
);

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
      console.log("✅ Auth check successful");
      return response.data.data;
    } catch (error) {
      console.error("❌ Auth check error:", error);
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Auth check failed";
        return rejectWithValue(message);
      }
      return rejectWithValue("Network error occurred");
    }
  }
);

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

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token: string, { rejectWithValue }) => {
    try {
      console.log("📧 Verifying email...");
      const response = await api.get(`/auth/verify-email/${token}`);
      console.log("✅ Email verification successful");
      return response.data;
    } catch (error) {
      console.error("❌ Email verification error:", error);
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Verification failed";
        return rejectWithValue(message);
      }
      return rejectWithValue("Network error occurred");
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerification",
  async (email: string, { rejectWithValue }) => {
    try {
      console.log("📧 Resending verification email...");
      const response = await api.post("/auth/resend-verification", { email });
      console.log("✅ Verification email sent");
      return response.data;
    } catch (error) {
      console.error("❌ Resend verification error:", error);
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Resend failed";
        return rejectWithValue(message);
      }
      return rejectWithValue("Network error occurred");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      console.log("🔑 Requesting password reset...");
      const response = await api.post("/auth/forgot-password", { email });
      console.log("✅ Password reset email sent");
      return response.data;
    } catch (error) {
      console.error("❌ Forgot password error:", error);
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Password reset failed";
        return rejectWithValue(message);
      }
      return rejectWithValue("Network error occurred");
    }
  }
);

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
      console.log("✅ Password reset successful");
      return response.data.data;
    } catch (error) {
      console.error("❌ Password reset error:", error);
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Password reset failed";
        return rejectWithValue(message);
      }
      return rejectWithValue("Network error occurred");
    }
  }
);

// Auth slice - same as before, no changes needed
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
  },
  extraReducers: (builder) => {
    // Login
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

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isRegistering = true;
        state.isRegisteredError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isRegistering = false;
        state.isRegisteredError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRegistering = false;
        state.isRegisteredError = action.payload as string;
      });

    // Check Auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isCheckingAuthError = null;
        state.isInitialized = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isCheckingAuthError = null;
        state.isInitialized = true;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLogoutting = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLogoutting = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isLogoutError = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLogoutting = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isLogoutError = null;
      });

    // Other cases remain the same...
    // Verify Email
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isVerifyingEmail = true;
        state.isVerifyingEmailError = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isVerifyingEmail = false;
        state.isVerifyingEmailError = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isVerifyingEmail = false;
        state.isVerifyingEmailError = action.payload as string;
      });

    // Reset Password
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
      })

      // Forgot Password
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
      })

      // Resend Verification Email
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
  },
});

export const {
  refreshTokenSuccess,
  updateUser,
  setInitialized,
  logout,
  clearLogoutError,
  clearLoginError,
  clearResetPasswordError,
  clearRegiterError,
  clearVerifyEmailError,
  clearResendVerificationEmailError,
  clearForgotPasswordError,
} = authSlice.actions;

export default authSlice.reducer;
