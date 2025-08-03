import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks/reduxHook';
import { checkAuth, setInitialized } from '@/Redux/UserServices/Slices/auth.slice';
import Loader from '@/components/Layouts/Loader';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isInitialized, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      if (accessToken && !isInitialized) {
        try {
          await dispatch(checkAuth()).unwrap();
        } catch (error) {
          console.error('Auth check failed:', error);
        } finally {
          dispatch(setInitialized());
        }
      } else {
        dispatch(setInitialized());
      }
    };

    initAuth();
  }, [dispatch, accessToken, isInitialized]);

  if (!isInitialized) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default AuthGuard;