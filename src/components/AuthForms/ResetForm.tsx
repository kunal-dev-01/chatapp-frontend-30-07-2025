import React, { useState, useEffect } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import dynamic from "next/dynamic";
import { Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks/reduxHook";
import { 
  resetPassword, 
  clearResetPasswordState,
  selectResetPasswordState,
  selectIsAuthenticated 
} from "@/Redux/UserServices/Slices/auth.slice";
import { toast } from "react-hot-toast";

const Input = dynamic(() => import("@/components/Layouts/AuthInput"), {
  ssr: false,
});

interface ResetFormProps {
  token?: string;
}

const ResetForm: React.FC<ResetFormProps> = ({ token }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Fix: Use correct selectors from auth slice
  const { loading, error, success, message } = useAppSelector(selectResetPasswordState);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Clear state on component mount and unmount
  useEffect(() => {
    dispatch(clearResetPasswordState());
    
    return () => {
      dispatch(clearResetPasswordState());
    };
  }, [dispatch]);

  // Handle success case
  useEffect(() => {
    if (success && message) {
      toast.success(message);
      
      // Auto redirect after 3 seconds if authenticated
      if (isAuthenticated) {
        const timer = setTimeout(() => {
          router.push('/user/?tab=chats');
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [success, message, isAuthenticated, router]);

  // Handle error case
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setValidationError("No reset token provided. Please request a new password reset link.");
    } else {
      setValidationError("");
    }
  }, [token]);

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
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setValidationError("Password must contain at least one uppercase letter, one lowercase letter, and one number");
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
      // Fix: Use correct payload structure according to auth slice
      await dispatch(resetPassword({
        token,
        passwordData: {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
      })).unwrap();
    } catch (error) {
      // Error handling is done by Redux and useEffect
      console.error('Reset password failed:', error);
    }
  };

  const isFormValid = () => {
    return formData.password.trim() && 
           formData.confirmPassword.trim() && 
           formData.password === formData.confirmPassword &&
           formData.password.length >= 8 &&
           /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password);
  };

  // Success state component
  if (success) {
    return (
      <AuthLayout>
        <div className="w-full md:w-[28vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
          <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[2vw] p-6">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              
              <h1 className="md:text-[1.8vw] text-[3vh] font-bold dark:text-zinc-200 mb-3">
                Password Reset Successful!
              </h1>
              
              <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Your password has been successfully reset and you are now logged in.
              </p>

              {/* Success Message */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-700 dark:text-green-300">
                  🎉 {message || "Welcome back! Redirecting to your dashboard..."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href="/user/?tab=chats"
                  className="block w-full py-3 rounded-md font-medium text-white 
                           bg-gradient-to-r from-[#9668c2] to-[#7a4dc4] 
                           hover:from-[#8557b3] hover:to-[#6b42b5]
                           transition-all duration-200 text-center no-underline"
                >
                  Continue to Dashboard
                </Link>

                <Link
                  href="/login"
                  className="block w-full py-3 rounded-md font-medium text-zinc-700 dark:text-zinc-300
                           bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600
                           hover:bg-zinc-200 dark:hover:bg-zinc-700
                           transition-all duration-200 text-center no-underline"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full md:w-[28vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
        <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[2vw] p-6">
          <h1 className="md:text-[1.8vw] text-[3vh] font-bold text-center dark:text-zinc-200 mb-2">
            Reset Password
          </h1>

          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 text-center mb-6">
            Please enter your new password
          </p>

          {/* Error Display */}
          {(error || validationError) && (
            <div className="flex items-center gap-2 p-3 mb-4 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
              <AlertCircle size={16} />
              <span className="text-sm">{error || validationError}</span>
            </div>
          )}

          {/* Token Error */}
          {!token && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                ⚠️ Invalid or missing reset token. Please request a new password reset link.
              </p>
            </div>
          )}

          <form
            onSubmit={handleReset}
            className="flex flex-col gap-4"
          >
            {/* Password Input */}
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Requirements */}
            {formData.password && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-xs">
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">Password Requirements:</p>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                  <li className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}`}>
                    {formData.password.length >= 8 ? '✓' : '○'} At least 8 characters
                  </li>
                  <li className={`flex items-center gap-2 ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                    {/(?=.*[a-z])/.test(formData.password) ? '✓' : '○'} One lowercase letter
                  </li>
                  <li className={`flex items-center gap-2 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                    {/(?=.*[A-Z])/.test(formData.password) ? '✓' : '○'} One uppercase letter
                  </li>
                  <li className={`flex items-center gap-2 ${/(?=.*\d)/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                    {/(?=.*\d)/.test(formData.password) ? '✓' : '○'} One number
                  </li>
                </ul>
              </div>
            )}

            {/* Password Match Indicator */}
            {formData.password && formData.confirmPassword && (
              <div className={`text-xs px-2 ${formData.password === formData.confirmPassword ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isFormValid() || !token}
              className="w-full py-3 mt-4 rounded-md font-medium text-white 
                       bg-gradient-to-r from-[#9668c2] to-[#7a4dc4] 
                       hover:from-[#8557b3] hover:to-[#6b42b5]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-2 justify-center">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Resetting Password...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-zinc-300 dark:border-zinc-600"></div>
            <span className="px-4 text-sm text-zinc-500 dark:text-zinc-400">or</span>
            <div className="flex-1 border-t border-zinc-300 dark:border-zinc-600"></div>
          </div>

          {/* Back to Login */}
          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
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