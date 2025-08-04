import React, { useState, useEffect } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import dynamic from "next/dynamic";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks/reduxHook";
import { resetPassword, clearResetPasswordError } from "@/Redux/UserServices/Slices/auth.slice";

const Input = dynamic(() => import("@/components/Layouts/AuthInput"), {
  ssr: false,
});

interface ResetFormProps {
  token?: string;
}

const ResetForm: React.FC<ResetFormProps> = ({ token }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isResettingPassword, isResettingPasswordError, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError("");
    }
  };

  const validateForm = () => {
    if (!formData.password.trim()) {
      setValidationError("Password is required");
      return false;
    }
    
    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }
    
    return true;
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!token) {
      setValidationError("Invalid reset token");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })).unwrap();
      
      setIsSuccess(true);
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (error) {
      // Error handling is done by Redux
      console.error('Reset password failed:', error);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isSuccess) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router, isSuccess]);

  // Clear error when component mounts
  useEffect(() => {
    return () => {
      if (isResettingPasswordError) {
        dispatch(clearResetPasswordError());
      }
    };
  }, [dispatch, isResettingPasswordError]);

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setValidationError("No reset token provided. Please request a new password reset link.");
    }
  }, [token]);

  const isFormValid = () => {
    return formData.password.trim() && 
           formData.confirmPassword.trim() && 
           formData.password === formData.confirmPassword &&
           formData.password.length >= 8;
  };

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="w-full md:w-[25vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
          <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[2vw]">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              
              <h1 className="md:text-[2vw] text-[3.5vh] font-semibold dark:text-zinc-200 mb-2">
                Password Reset Successful!
              </h1>
              
              <p className="text-sm md:text-md text-zinc-600 dark:text-zinc-400 mb-6">
                Your password has been successfully reset. You are now logged in.
              </p>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-700 dark:text-green-300">
                  🎉 Redirecting to your dashboard in a few seconds...
                </p>
              </div>

              <Link
                href="/dashboard"
                className="inline-block w-full py-2 rounded-md font-medium text-white 
                         bg-gradient-to-r from-[#9668c2] to-[#7a4dc4] 
                         hover:from-[#8557b3] hover:to-[#6b42b5]
                         transition-all duration-200 text-center"
              >
                Continue to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full md:w-[25vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
        <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[1vw]">
          <h1 className="md:text-[2vw] text-[3.5vh] font-semibold text-center dark:text-zinc-200">
            Reset Password
          </h1>

          <p className="text-sm md:text-md text-zinc-600 dark:text-zinc-400 text-center mt-1">
            Please enter your new password
          </p>

          {(isResettingPasswordError || validationError) && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mx-[2vh] md:mx-0">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {isResettingPasswordError || validationError}
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleReset}
            className="flex flex-col gap-3 mt-[2vh] md:mt-[2vw] px-[2vh] md:px-0"
          >
            <Input
              label="New Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
            />

            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-600 dark:text-red-400 px-2">
                Passwords do not match
              </p>
            )}

            <button
              type="submit"
              disabled={isResettingPassword || !isFormValid() || !token}
              className="w-full py-2 mt-3 rounded-md font-medium text-white 
                       bg-gradient-to-r from-[#9668c2] to-[#7a4dc4] 
                       hover:from-[#8557b3] hover:to-[#6b42b5]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200"
            >
              {isResettingPassword ? (
                <div className="flex items-center gap-2 justify-center">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Resetting...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center mt-5 select-none">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-[#9668c2] hover:underline cursor-pointer font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetForm;