import React, { useEffect, useState } from 'react';
import AuthLayout from '../Layouts/AuthLayout';
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks/reduxHook';
import { useRouter } from 'next/navigation';
import { verifyEmail, clearVerifyEmailState } from '@/Redux/UserServices/Slices/auth.slice';
import toast from 'react-hot-toast';

interface VerifyFormProps {
  token: string;
}

const VerifyForm: React.FC<VerifyFormProps> = ({ token }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Get verify email state from Redux
  const { 
    verifyEmail: { loading: isLoading, error: verifyError, success: verifySuccess, message: verifyMessage }
  } = useAppSelector((state) => state.auth);
  
  const [hasVerified, setHasVerified] = useState<boolean>(false);

  useEffect(() => {
    // Clear any previous states when component mounts
    dispatch(clearVerifyEmailState());
    
    // Verify email automatically when component loads
    if (token && !hasVerified && !isLoading) {
      setHasVerified(true);
      handleVerifyEmail();
    }
  }, [token, dispatch, hasVerified, isLoading]);

  // Handle verification success
  useEffect(() => {
    if (verifySuccess && verifyMessage) {
      toast.success(verifyMessage, {
        duration: 3000,
      });
      
      // Redirect to login after successful verification
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  }, [verifySuccess, verifyMessage, router]);

  // Handle verification errors
  useEffect(() => {
    if (verifyError) {
      toast.error(verifyError, {
        duration: 4000,
      });
    }
  }, [verifyError]);

  const handleVerifyEmail = async (): Promise<void> => {
    if (!token) {
      toast.error('No verification token provided');
      return;
    }

    try {
      await dispatch(verifyEmail(token)).unwrap();
    } catch (error) {
      console.log('Verification failed:', error);
      // Error is handled by useEffect above
    }
  };

  const handleRetryVerification = (): void => {
    dispatch(clearVerifyEmailState());
    setHasVerified(false);
    
    // Retry verification after a small delay
    setTimeout(() => {
      setHasVerified(true);
      handleVerifyEmail();
    }, 100);
  };

  const handleGoToLogin = (): void => {
    router.push('/login');
  };

  const handleRequestNewEmail = (): void => {
    router.push('/resend-verification');
  };

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Email Verification
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              We're verifying your email address
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="text-center">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600 dark:text-gray-400">Verifying your email...</p>
                </div>
              ) : verifySuccess ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-green-600">
                      Email Verified Successfully!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {verifyMessage || 'Your email has been verified. Redirecting you to login...'}
                    </p>
                  </div>
                </div>
              ) : verifyError ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-red-600">
                      Verification Failed
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {verifyError}
                    </p>
                  </div>
                  <button
                    onClick={handleRetryVerification}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isLoading ? 'Retrying...' : 'Try Again'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <svg
                      className="w-8 h-8 text-gray-600 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26c.32.21.69.21 1.01 0L20 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Ready to Verify
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Click the button below to verify your email address
                    </p>
                  </div>
                  <button
                    onClick={handleVerifyEmail}
                    disabled={!token || isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                  </button>
                </div>
              )}
            </div>

            {/* Additional actions */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Having trouble?{' '}
                <button
                  onClick={handleRequestNewEmail}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Request a new verification email
                </button>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <button
                  onClick={handleGoToLogin}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Back to Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyForm;