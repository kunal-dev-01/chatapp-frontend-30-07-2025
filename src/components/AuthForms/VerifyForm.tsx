import React, { useEffect, useState } from 'react';
import AuthLayout from '../Layouts/AuthLayout';
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks/reduxHook';
import { useRouter } from 'next/navigation';
import { verifyEmail, selectVerifyEmailState, clearVerifyEmailState } from '@/Redux/UserServices/Slices/auth.slice';
import toast from 'react-hot-toast';

interface VerifyFormProps {
  token: string;
}

const VerifyForm = ({ token }: VerifyFormProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const verifyEmailState = useAppSelector(selectVerifyEmailState);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Clear any previous states when component mounts
    dispatch(clearVerifyEmailState());
    
    // Verify email automatically when component loads
    if (token && !isVerifying) {
      setIsVerifying(true);
      handleVerifyEmail();
    }
  }, [token, dispatch, isVerifying]);

  // Handle verification state changes
  useEffect(() => {
    if (verifyEmailState?.success && verifyEmailState?.message) {
      toast.success(verifyEmailState.message);
      // Redirect to login or dashboard after successful verification
      setTimeout(() => {
        router.push('/login'); // or wherever you want to redirect
      }, 2000);
    }

    if (verifyEmailState?.error) {
      toast.error(verifyEmailState.error);
    }
  }, [verifyEmailState?.success, verifyEmailState?.error, verifyEmailState?.message, router]);

  const handleVerifyEmail = async () => {
    try {
      await dispatch(verifyEmail(token)).unwrap();
    } catch (error) {
      // Error is already handled in the useEffect above
      console.log('Verification failed:', error);
    }
  };

  const handleRetryVerification = () => {
    dispatch(clearVerifyEmailState());
    setIsVerifying(true);
    handleVerifyEmail();
  };

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email Verification
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We're verifying your email address
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="text-center">
              {verifyEmailState?.loading ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600">Verifying your email...</p>
                </div>
              ) : verifyEmailState?.success ? (
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
                    <p className="text-gray-600 mt-2">
                      Your email has been verified. Redirecting you to login...
                    </p>
                  </div>
                </div>
              ) : verifyEmailState?.error ? (
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
                    <p className="text-gray-600 mt-2">
                      {verifyEmailState?.error}
                    </p>
                  </div>
                  <button
                    onClick={handleRetryVerification}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                    <svg
                      className="w-8 h-8 text-gray-600"
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
                    <h3 className="text-lg font-medium text-gray-900">
                      Ready to Verify
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Click the button below to verify your email address
                    </p>
                  </div>
                  <button
                    onClick={handleVerifyEmail}
                    disabled={!token}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Verify Email
                  </button>
                </div>
              )}
            </div>

            {/* Additional actions */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Having trouble?{' '}
                <button
                  onClick={() => router.push('/auth/resend-verification')}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Request a new verification email
                </button>
              </p>
              <p className="text-sm text-gray-600">
                <button
                  onClick={() => router.push('/auth/login')}
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