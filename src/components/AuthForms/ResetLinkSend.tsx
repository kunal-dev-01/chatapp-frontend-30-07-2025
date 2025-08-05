import React, { useState } from 'react';
import AuthLayout from "../Layouts/AuthLayout";
import Link from 'next/link';
import { Mail, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks/reduxHook";
import {
  forgotPassword,
  selectForgotPasswordState,
} from "@/Redux/UserServices/Slices/auth.slice";
import { toast } from "react-hot-toast";

const ResetLinkSend = ({ email }: { email: string }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(selectForgotPasswordState);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;
    
    try {
      await dispatch(forgotPassword({ email })).unwrap();
      toast.success("Reset link sent again!");
      
      // Start 60 second cooldown
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Resend failed:", error);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full md:w-[28vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
        <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[2vw] p-6">
          
          {/* Success Icon */}
          <div className="relative mx-auto mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Mail size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="md:text-[1.8vw] text-[3vh] font-bold text-center dark:text-zinc-200 mb-2">
            Check Your Email
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 text-center mb-6 leading-relaxed">
            We've sent a password reset link to
          </p>

          {/* Email Display */}
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-300 dark:border-zinc-700">
            <p className="text-center font-semibold text-zinc-800 dark:text-zinc-200 break-all">
              {email}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              Click the link in the email to reset your password. The link will expire in 15 minutes.
            </p>
          </div>

          {/* Resend Button */}
          <button
            onClick={handleResendEmail}
            disabled={loading || resendCooldown > 0}
            className="w-full py-3 mb-4 rounded-md font-medium text-zinc-700 dark:text-zinc-300
              bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600
              hover:bg-zinc-200 dark:hover:bg-zinc-700
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Sending...</span>
              </>
            ) : resendCooldown > 0 ? (
              <>
                <RefreshCw size={16} />
                <span>Resend in {resendCooldown}s</span>
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                <span>Resend Email</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-zinc-300 dark:border-zinc-600"></div>
            <span className="px-4 text-sm text-zinc-500 dark:text-zinc-400">or</span>
            <div className="flex-1 border-t border-zinc-300 dark:border-zinc-600"></div>
          </div>

          {/* Back to Login */}
          <Link
            href="/login"
            className="w-full py-3 rounded-md font-medium text-white text-center
              bg-gradient-to-r from-[#9668c2] to-[#7a4dc4]
              hover:from-[#8557b3] hover:to-[#6b42b5]
              transition-all duration-200 flex items-center justify-center gap-2
              no-underline"
          >
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>

          {/* Help Text */}
          <div className="mt-6 pt-4 border-t border-zinc-300 dark:border-zinc-600">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
              Didn't receive the email? Check your spam folder or try a different email address.
            </p>
          </div>

        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetLinkSend;