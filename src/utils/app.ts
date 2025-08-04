// 1. Fixed API Utils (utils/api.ts)
import axios from 'axios';
import { store } from '@/Redux/Store/store';
import { logout, refreshTokenSuccess } from '@/Redux/UserServices/Slices/auth.slice';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to:`, config.url);
    
    const state = store.getState();
    const token = state.auth.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received:`, response.status, response.config.url);
    
    // Handle automatic token refresh
    const newAccessToken = response.headers['x-new-access-token'];
    if (newAccessToken) {
      console.log('🔄 Refreshing access token...');
      store.dispatch(refreshTokenSuccess(newAccessToken));
    }
    return response;
  },
  async (error) => {
    console.error('❌ Response error:', error.response?.status, error.config?.url);
    
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 Attempting token refresh...');
        const response = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;
        store.dispatch(refreshTokenSuccess(accessToken));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        store.dispatch(logout());
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;