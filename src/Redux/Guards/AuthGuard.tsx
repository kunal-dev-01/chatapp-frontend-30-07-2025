import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks/reduxHook';
import { checkAuth, setInitialized } from '@/Redux/UserServices/Slices/auth.slice';
import Loader from '@/components/Layouts/Loader';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { 
    isInitialized, 
    accessToken, 
    isCheckingAuth,
  } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      console.log('🔍 AuthGuard: Initializing auth check...');
      console.log('🔍 AuthGuard: Access token exists:', !!accessToken);
      console.log('🔍 AuthGuard: Is initialized:', isInitialized);

      if (accessToken && !isInitialized) {
        try {
          console.log('🔍 AuthGuard: Dispatching checkAuth...');
          await dispatch(checkAuth()).unwrap();
          console.log('✅ AuthGuard: Auth check successful');
        } catch (error) {
          console.error('❌ AuthGuard: Auth check failed:', error);
        }
      } else if (!accessToken && !isInitialized) {
        console.log('🔍 AuthGuard: No token, setting initialized');
        dispatch(setInitialized());
      }
    };

    initAuth();
  }, [dispatch, accessToken, isInitialized]);

  // Show loader while checking auth or not initialized
  if (!isInitialized || isCheckingAuth) {
    console.log('🔄 AuthGuard: Showing loader', { isInitialized, isCheckingAuth });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-sm text-gray-600">
            Initializing application...
          </p>
        </div>
      </div>
    );
  }

  console.log('✅ AuthGuard: Rendering children');
  return <>{children}</>;
};

export default AuthGuard;