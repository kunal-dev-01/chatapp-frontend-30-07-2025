import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks/reduxHook';
import { checkAuth, setInitialized, resetLoadingStates } from '@/Redux/UserServices/Slices/auth.slice';
import Loader from '@/components/Layouts/Loader';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const hasInitialized = useRef(false);
  
  const { 
    isInitialized, 
    accessToken, 
    isCheckingAuth,
    isCheckingAuthError,
    user
  } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      // Prevent multiple initialization
      if (hasInitialized.current) {
        console.log('🔍 AuthGuard: Already initialized, skipping...');
        return;
      }

      console.log('🔍 AuthGuard: Starting initialization...');
      console.log('🔍 AuthGuard State:', {
        isInitialized,
        hasAccessToken: !!accessToken,
        isCheckingAuth,
        hasUser: !!user
      });

      hasInitialized.current = true;

      // Reset any persisted loading states first
      dispatch(resetLoadingStates());

      if (accessToken && !isInitialized) {
        try {
          console.log('🔍 AuthGuard: Have token, checking auth...');
          await dispatch(checkAuth()).unwrap();
          console.log('✅ AuthGuard: Auth check successful');
        } catch (error) {
          console.error('❌ AuthGuard: Auth check failed:', error);
          // Don't throw error, just set initialized
        }
      } else {
        console.log('🔍 AuthGuard: No token or already initialized, setting initialized state');
        dispatch(setInitialized());
      }
    };

    // Only run if not already initialized
    if (!isInitialized && !isCheckingAuth) {
      initAuth();
    }
  }, [dispatch, accessToken, isInitialized, isCheckingAuth, user]);

  // Force set initialized after 5 seconds if still loading (failsafe)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isInitialized) {
        console.warn('⚠️ AuthGuard: Force setting initialized after timeout');
        dispatch(setInitialized());
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isInitialized, dispatch]);

  // Show current state for debugging
  console.log('🔍 AuthGuard Render:', {
    isInitialized,
    isCheckingAuth,
    hasAccessToken: !!accessToken,
    hasUser: !!user,
    isCheckingAuthError,
    hasInitializedRef: hasInitialized.current
  });

  // Show loader while checking auth or not initialized
  if (!isInitialized || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {isCheckingAuth ? 'Checking authentication...' : 'Initializing application...'}
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            Debug: Init={isInitialized.toString()}, Checking={isCheckingAuth.toString()}, Token={!!accessToken}
          </p>
        </div>
      </div>
    );
  }

  console.log('✅ AuthGuard: Rendering children');
  return <>{children}</>;
};

export default AuthGuard;