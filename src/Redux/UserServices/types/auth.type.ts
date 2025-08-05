// ====================== User Types ====================== //

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

/// ====================== Auth Types ====================== //
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


export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

//// ====================== API Response Types ====================== //

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

/// ====================== Auth State ====================== //

export interface AuthState {
  // User data
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  
  // Register states
  register: {
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string | null;
  };
  
  // Verify email states
  verifyEmail: {
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string | null;
  };
  
  // Resend verification states
  resendVerification: {
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string | null;
  };

  login:{
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string | null;
  }
}