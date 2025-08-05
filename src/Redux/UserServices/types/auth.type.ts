export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
  avatar?: string | undefined;
  banner?: string; 
  bio?: string;
  
  // Account Status
  isEmailVerified: boolean;
  isActive: boolean;
  isOnline: boolean;
  lastSeen: Date;
  
  // Security
  passwordChangedAt: Date;
  passwordResetToken?: string | undefined;
  passwordResetExpires?: Date | undefined;
  emailVerificationToken?: string | undefined;
  emailVerificationExpires?: Date | undefined;
  
  // Follow System
  followers: string[];
  following: string[];
  followersCount: number;
  followingCount: number;
  
  // Privacy Settings
  privacy: {
    isPrivate: boolean;
    showLastSeen: 'everyone' | 'followers' | 'none';
    showOnlineStatus: 'everyone' | 'followers' | 'none';
    allowMessagesFrom: 'everyone' | 'followers' | 'none';
  };
  
  // Profile Customization
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  
  // Follow Requests (for private accounts)
  followRequests: {
    sent: string[];
    received: string[];
  };
  
  // Blocked Users
  blockedUsers: string[];
  blockedBy: string[];
  
  // Account Analytics
  accountCreatedAt: Date;
  lastPasswordChange: Date;
  totalMessages: number;
  totalChats: number;
  
  // Device Information
  devices: {
    deviceId: string;
    deviceType: 'web' | 'mobile' | 'desktop';
    deviceName: string;
    lastLogin: Date;
    isActive: boolean;
    pushToken?: string;
  }[];
  
  // Notification Settings
  notifications: {
    messages: boolean;
    followRequests: boolean;
    newFollowers: boolean;
    mentions: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  
}


export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
  data: {
    user: Pick<User, 'id' | 'username' | 'email' | 'fullName' | 'isEmailVerified'>;
  };
}

export interface VerifyEmailResponse {
  status: string;
  message: string;
  data: {
    user: Pick<User, 'id' | 'username' | 'email' | 'fullName' | 'isEmailVerified'>;
  };
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  status: string;
  message: string;
}


// Login
export interface LoginRequest {
  identifier: string; // email or username
  password: string;
}

export interface LoginResponse extends ApiResponse<{
  user: User;
  accessToken: string;
}> {}

// Forgot Password
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse extends ApiResponse {}

// Reset Password
export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse extends ApiResponse<{
  user: User;
  accessToken: string;
}> {}

// Check Auth
export interface CheckAuthResponse extends ApiResponse<{ user: User }> {}

// Refresh Token
export interface RefreshTokenResponse extends ApiResponse<{
  accessToken: string;
}> {}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: string[];
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

export interface AsyncState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  
  // Async states
  register: AsyncState;
  login: AsyncState;
  logout: AsyncState;
  verifyEmail: AsyncState;
  resendVerification: AsyncState;
  forgotPassword: AsyncState;
  resetPassword: AsyncState;
  checkAuth: AsyncState;
  refreshToken: AsyncState;
}