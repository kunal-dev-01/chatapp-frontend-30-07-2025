import React, { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import AuthLayout from "../Layouts/AuthLayout";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks/reduxHook";
import {
  resendVerificationEmail,
  clearResendVerificationState,
} from "@/Redux/UserServices/Slices/auth.slice";
import { ResendVerificationRequest } from "@/Redux/UserServices/types/auth.type";

interface EmailVerificationSuccessProps {
  email: string;
  onBackToForm: () => void;
}

const EmailVerificationSuccess: React.FC<EmailVerificationSuccessProps> = ({
  email,
  onBackToForm,
}) => {
  const dispatch = useAppDispatch();
  const resendVerificationState = useAppSelector(
    (state) => state.auth.resendVerification
  );

  const [resendMessage, setResendMessage] = useState<string>("");

  const handleResendVerification = async (): Promise<void> => {
    if (!email) {
      toast.error("Email address is required");
      return;
    }

    console.log("🔄 Resending verification email to:", email);
    setResendMessage("");

    try {
      const emailData: ResendVerificationRequest = { email };
      const result = await dispatch(
        resendVerificationEmail(emailData)
      ).unwrap();

      console.log("✅ Resend result:", result);

      if (result?.status === "success") {
        const message =
          result.message ||
          "Verification email sent successfully! Please check your inbox.";
        setResendMessage(message);
        toast.success(message);

        // Clear message after 10 seconds
        setTimeout(() => {
          setResendMessage("");
        }, 10000);
      }
    } catch (error) {
      console.error("❌ Resend failed:", error);

      // Type-safe error handling
      let errorMessage = "Failed to resend verification email";

      if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = (error as { message: string }).message;
      }

      setResendMessage(errorMessage);
      toast.error(errorMessage);

      // Clear error message after 10 seconds
      setTimeout(() => {
        setResendMessage("");
      }, 10000);
    }
  };

  const handleBackToRegistration = (): void => {
    setResendMessage("");
    dispatch(clearResendVerificationState());
    onBackToForm();
  };

  const isSuccessMessage = (message: string): boolean => {
    return (
      message.includes("successfully") ||
      message.includes("sent") ||
      message.includes("success")
    );
  };

  return (
    <AuthLayout>
      <div className="w-full md:w-[30vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
        <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[2vw]">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>

            {/* Main Heading */}
            <h1 className="md:text-[2vw] text-[3.5vh] font-semibold dark:text-zinc-200 mb-2">
              Check Your Email!
            </h1>

            {/* Email Information */}
            <div className="mb-6">
              <p className="text-sm md:text-md text-zinc-600 dark:text-zinc-400 mb-2">
                We've sent a verification link to:
              </p>
              <p className="font-semibold text-[#9668c2] break-all text-sm md:text-base">
                {email}
              </p>
            </div>

            {/* Instructions */}
            <div className="mb-6 p-[2px] rounded-xl animated-gradient-border transition-colors duration-300">
              <div className="p-5 rounded-[10px] border border-blue-300 dark:border-blue-800 bg-blue-100/50 dark:bg-blue-900/30 transition-all">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Click the verification link in your email to activate your
                      account.
                    </p>
                    <p className="text-xs text-white mt-1">
                      The link will expire in{" "}
                      <span className="font-semibold">24 hours</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resend Section */}
            <div className="border-t border-zinc-300 dark:border-zinc-700 pt-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                Didn't receive the email?
              </p>

              {/* Resend Message */}
              {resendMessage && (
                <div
                  className={`mb-3 p-3 rounded-lg transition-all duration-300 ${
                    isSuccessMessage(resendMessage)
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      isSuccessMessage(resendMessage)
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {resendMessage}
                  </p>
                </div>
              )}

              {/* Resend Button */}
              <button
                onClick={handleResendVerification}
                disabled={resendVerificationState?.loading}
                className="w-full py-2 rounded-md font-medium text-white 
                         bg-gradient-to-r from-[#9668c2] to-[#7a4dc4] 
                         hover:from-[#8557b3] hover:to-[#6b42b5] 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9668c2] focus:ring-offset-2"
              >
                {resendVerificationState?.loading ? (
                  <div className="flex items-center gap-2 justify-center">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Resend Verification Email"
                )}
              </button>

              {/* Help Text */}
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                Still having trouble? Check your spam folder or contact support.
              </p>
            </div>

            {/* Navigation Footer */}
            <div className="mt-6 pt-4 border-t border-zinc-300 dark:border-zinc-700">
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleBackToRegistration}
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9668c2] transition-colors"
                  type="button"
                >
                  ← Back to Registration
                </button>

                <div className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <p>
                    Already verified?{" "}
                    <Link
                      href="/login"
                      className="text-[#9668c2] hover:underline cursor-pointer font-semibold transition-colors"
                    >
                      Sign In
                    </Link>
                  </p>

                  <p>
                    Need help?{" "}
                    <Link
                      href="/contact"
                      className="text-[#9668c2] hover:underline cursor-pointer font-semibold transition-colors"
                    >
                      Contact Support
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerificationSuccess;
