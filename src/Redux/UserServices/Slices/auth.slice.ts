import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  User,
  LoginCredentials,
  RegisterCredentials,
} from "../types/auth.type";
import api from "@/utils/app";

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

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      if (!state.auth.accessToken) {
        throw new Error("No token found");
      }

      const response = await api.get("/auth/check-auth");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Authentication check failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
    } catch (error: any) {
      // Even if logout API fails, we still want to clear local state
      console.error("Logout API failed:", error);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Email verification failed"
      );
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerification",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/resend-verification", { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend verification email"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset email"
      );
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
      const response = await api.patch(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed"
      );
    }
  }
);

// Auth slice
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
      }
      );
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
