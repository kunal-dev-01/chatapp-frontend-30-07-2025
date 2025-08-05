import axios, { 
  AxiosError, 
  AxiosResponse, 
  InternalAxiosRequestConfig 
} from 'axios';
import { store } from '@/Redux/Store/store';
import { 
  logout, 
  setAccessToken, 
  refreshAccessToken,
  selectAccessToken 
} from '@/Redux/UserServices/Slices/auth.slice';

// ====================== TYPES ====================== //

interface ApiError {
  message: string;
  statusCode?: number;
  errors?: string[];
}

interface RefreshTokenResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
    user?: {
      id: string;
      username: string;
      email: string;
      fullName?: string;
      avatar?: string;
      isEmailVerified: boolean;
      isOnline?: boolean;
      lastSeen?: string;
      followersCount?: number;
      followingCount?: number;
      privacy?: string;
      theme?: string;
      language?: string;
    };
  };
}

interface QueuedRequest {
  resolve: (value: string) => void;
  reject: (error: AxiosError) => void;
}

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _skipTokenRefresh?: boolean;
}

// ====================== CONFIGURATION ====================== //

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// ====================== TOKEN REFRESH MANAGEMENT ====================== //

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    } else {
      reject(new Error('No token received') as AxiosError);
    }
  });
  failedQueue = [];
};

const addToQueue = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  });
};

// ====================== UTILITY FUNCTIONS ====================== //

const isClient = (): boolean => typeof window !== 'undefined';

const redirectToLogin = (): void => {
  if (isClient()) {
    // Clear any existing timers or intervals
    window.location.href = '/login';
  }
};

const shouldSkipAuth = (url: string): boolean => {
  const skipAuthRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh-token',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
    '/auth/resend-verification'
  ];
  
  return skipAuthRoutes.some(route => url.includes(route));
};

const getTokenFromStore = (): string | null => {
  try {
    const state = store.getState();
    return selectAccessToken(state);
  } catch (error) {
    console.error('Error getting token from store:', error);
    return null;
  }
};

// ====================== REQUEST INTERCEPTOR ====================== //

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const method = config.method?.toUpperCase() || 'UNKNOWN';
    const url = config.url || 'unknown';
    
    console.log(`🚀 Making ${method} request to: ${url}`);
    
    // Skip adding token for auth routes
    if (!shouldSkipAuth(url)) {
      const token = getTokenFromStore();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error('❌ Request interceptor error:', error.message);
    return Promise.reject(error);
  }
);

// ====================== RESPONSE INTERCEPTOR ====================== //

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const status = response.status;
    const url = response.config.url || 'unknown';
    
    console.log(`✅ Response received: ${status} from ${url}`);
    
    // Handle automatic token refresh from backend middleware
    const newAccessToken = response.headers['x-new-access-token'];
    if (newAccessToken && typeof newAccessToken === 'string') {
      console.log('🔄 Updating access token from response header');
      store.dispatch(setAccessToken(newAccessToken));
    }
    
    return response;
  },
  
  async (error: AxiosError<ApiError>): Promise<AxiosResponse | never> => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    const status = error.response?.status;
    const url = originalRequest?.url || 'unknown';
    
    console.error('❌ Response error:', {
      status,
      url,
      message: error.message,
      data: error.response?.data
    });
    
    // Handle 401 Unauthorized errors
    if (status === 401 && originalRequest && !originalRequest._retry) {
      
      // Skip token refresh for certain routes
      if (shouldSkipAuth(url) || originalRequest._skipTokenRefresh) {
        return Promise.reject(error);
      }
      
      // If already refreshing, add to queue
      if (isRefreshing) {
        try {
          const newToken = await addToQueue();
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (queueError) {
          return Promise.reject(queueError);
        }
      }
      
      // Mark request as retried and start refresh process
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        console.log('🔄 Attempting to refresh access token...');
        
        // Use Redux action for consistency
        const refreshResponse = await store.dispatch(refreshAccessToken()).unwrap();
        const newAccessToken = refreshResponse.data.accessToken;
        
        console.log('✅ Token refresh successful via Redux');
        
        // Process queued requests
        processQueue(null, newAccessToken);
        
        // Retry original request with new token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        
        // Process queue with error
        processQueue(refreshError as AxiosError, null);
        
        // Fallback: Try direct API call if Redux fails
        try {
          console.log('🔄 Fallback: Attempting direct token refresh...');
          
          const directRefreshResponse = await axios.post<RefreshTokenResponse>(
            `${BASE_URL}/auth/refresh-token`,
            {},
            {
              withCredentials: true,
              timeout: 10000,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          
          const { accessToken } = directRefreshResponse.data.data;
          
          console.log('✅ Direct token refresh successful');
          store.dispatch(setAccessToken(accessToken));
          
          // Process queued requests
          processQueue(null, accessToken);
          
          // Retry original request
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          return api(originalRequest);
          
        } catch (directRefreshError) {
          console.error('❌ Direct token refresh also failed:', directRefreshError);
          
          // Process queue with error
          processQueue(directRefreshError as AxiosError, null);
          
          // Clear auth state and redirect
          store.dispatch(logout());
          redirectToLogin();
          
          return Promise.reject(directRefreshError);
        }
        
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle other 4xx and 5xx errors
    if (status && status >= 400) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      
      // Create a more detailed error
      const enhancedError: AxiosError<ApiError> = {
        ...error,
        response: {
          ...error.response!,
          data: {
            message: errorMessage,
            statusCode: status,
            errors: error.response?.data?.errors
          }
        }
      };
      
      return Promise.reject(enhancedError);
    }
    
    return Promise.reject(error);
  }
);

// ====================== UTILITY METHODS ====================== //

/**
 * Make a request without automatic token refresh
 */
export const apiWithoutRefresh = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Check if API is healthy
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
    return response.status === 200;
  } catch {
    return false;
  }
};

/**
 * Get current authentication status
 */
export const getAuthStatus = (): {
  isAuthenticated: boolean;
  hasToken: boolean;
  token: string | null;
} => {
  const token = getTokenFromStore();
  const state = store.getState();
  
  return {
    isAuthenticated: state.auth.isAuthenticated,
    hasToken: !!token,
    token
  };
};

/**
 * Manually refresh token
 */
export const manualTokenRefresh = async (): Promise<string> => {
  if (isRefreshing) {
    return addToQueue();
  }
  
  isRefreshing = true;
  
  try {
    const response = await store.dispatch(refreshAccessToken()).unwrap();
    return response.data.accessToken;
  } finally {
    isRefreshing = false;
  }
};

/**
 * Clear authentication and redirect
 */
export const clearAuthAndRedirect = (): void => {
  store.dispatch(logout());
  redirectToLogin();
};

// ====================== EXPORTS ====================== //

export default api;
export type { ApiError, RefreshTokenResponse };

// ====================== DEBUG UTILITIES (Development Only) ====================== //

if (process.env.NODE_ENV === 'development') {
  // Add request/response logging for development
  api.interceptors.request.use((config) => {
    console.group(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    console.log('Headers:', config.headers);
    console.log('Data:', config.data);
    console.groupEnd();
    return config;
  });
  
  api.interceptors.response.use(
    (response) => {
      console.group(`✅ ${response.status} ${response.config.url}`);
      console.log('Response:', response.data);
      console.groupEnd();
      return response;
    },
    (error) => {
      console.group(`❌ ${error.response?.status || 'Network Error'} ${error.config?.url}`);
      console.error('Error:', error.response?.data || error.message);
      console.groupEnd();
      return Promise.reject(error);
    }
  );
}