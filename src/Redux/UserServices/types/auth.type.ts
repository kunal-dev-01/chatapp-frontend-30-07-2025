export interface User {
  _id: string;
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


export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  isCheckingAuth: boolean;
  isRegistering: boolean;
  isLoggingIn: boolean;
  isVerifyingEmail: boolean;
  isResendingVerificationEmail: boolean;
  isLogoutting: boolean;
  isForgotPassword: boolean;
  isResettingPassword: boolean;

  isCheckingAuthError: string | null;
  isRegisteredError: string | null;
  isLoginError: string | null;
  isVerifyingEmailError: string | null;
  isResendingVerificationEmailError: string | null;
  isLogoutError: string | null;
  isForgotPasswordError: string | null;
  isResettingPasswordError: string | null;

  isInitialized: boolean;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  fullName: string;
}