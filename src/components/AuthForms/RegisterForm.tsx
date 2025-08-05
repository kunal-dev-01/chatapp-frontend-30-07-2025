import React, { useEffect, useState } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks/reduxHook";
import {
  registerUser,
  resendVerificationEmail,
  clearRegiterError,
  clearResendVerificationEmailError,
} from "@/Redux/UserServices/Slices/auth.slice";
import { toast } from "react-hot-toast";

const Input = dynamic(() => import("@/components/Layouts/AuthInput"), {
  ssr: false,
});

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const {
    isRegistering,
    isRegisteredError,
    isResendingVerificationEmailError,
    isResendingVerificationEmail,
    user, // Add user to check registration success
  } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [registrationStep, setRegistrationStep] = useState<"form" | "success">(
    "form"
  );
  const [resendMessage, setResendMessage] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("🚀 Starting registration process...");
    console.log("Form data:", formData);

    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      console.log("✅ Registration result:", result);

      // Check if registration was successful
      // Since backend sends { status: 'success', message: '...', data: { user: {...} } }
      if (result && (result.status === "success" || result.user)) {
        console.log("✅ Registration successful, showing success step");
        setRegistrationStep("success");
        toast.success("Registration successful! Please check your email to verify your account.");
      }
    } catch (error) {
      console.error("❌ Registration failed:", error);
      // Error is already handled by Redux and will show via toast
    }
  };

  const handleResendVerification = async () => {
    console.log("🔄 Resending verification email to:", formData.email);
    setResendMessage("");

    try {
      const result = await dispatch(
        resendVerificationEmail(formData.email)
      ).unwrap();

      console.log("✅ Resend result:", result);

      if (result && result.status === "success") {
        setResendMessage(
          "Verification email sent successfully! Please check your inbox."
        );
        toast.success("Verification email sent successfully!");
        
        // Clear message after 5 seconds
        setTimeout(() => {
          setResendMessage("");
        }, 5000);
      }
    } catch (error: any) {
      console.error("❌ Resend failed:", error);
      setResendMessage(error || "Failed to resend verification email");
      toast.error(error || "Failed to resend verification email");
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setResendMessage("");
      }, 5000);
    }
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim().length > 0 &&
      formData.username.trim().length > 0 &&
      formData.email.trim().length > 0 &&
      formData.password.trim().length >= 6 // Add minimum password length
    );
  };

  // Handle success step based on user creation
  useEffect(() => {
    if (user && user.email === formData.email && registrationStep === "form") {
      console.log("✅ User found in state, switching to success step");
      setRegistrationStep("success");
    }
  }, [user, formData.email, registrationStep]);

  // Handle errors with toast
  useEffect(() => {
    if (isRegisteredError) {
      console.error("❌ Registration error:", isRegisteredError);
      toast.error(isRegisteredError, {
        duration: 4000,
      });
      dispatch(clearRegiterError());
    }
  }, [isRegisteredError, dispatch]);

  useEffect(() => {
    if (isResendingVerificationEmailError) {
      console.error("❌ Resend verification error:", isResendingVerificationEmailError);
      toast.error(isResendingVerificationEmailError, {
        duration: 4000,
      });
      dispatch(clearResendVerificationEmailError());
    }
  }, [isResendingVerificationEmailError, dispatch]);

  // Reset form if user navigates back
  const handleBackToForm = () => {
    setRegistrationStep("form");
    setResendMessage("");
  };

  if (registrationStep === "success") {
    return (
      <AuthLayout>
        <div className="w-full md:w-[30vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
          <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[2vw]">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>

              <h1 className="md:text-[2vw] text-[3.5vh] font-semibold dark:text-zinc-200 mb-2">
                Check Your Email!
              </h1>

              <p className="text-sm md:text-md text-zinc-600 dark:text-zinc-400 mb-6">
                We've sent a verification link to <br />
                <span className="font-semibold text-[#9668c2]">
                  {formData.email}
                </span>
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">Next Steps:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Check your email inbox</li>
                      <li>• Click the verification link</li>
                      <li>• Return here to sign in</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Resend Section */}
              <div className="border-t border-zinc-300 dark:border-zinc-700 pt-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  Didn't receive the email?
                </p>

                {resendMessage && (
                  <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {resendMessage}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleResendVerification}
                  disabled={isResendingVerificationEmail}
                  className="w-full py-2 rounded-md font-medium text-white 
                           bg-gradient-to-r from-[#9668c2] to-[#7a4dc4] 
                           hover:from-[#8557b3] hover:to-[#6b42b5] 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200"
                >
                  {isResendingVerificationEmail ? (
                    <div className="flex items-center gap-2 justify-center">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Resend Verification Email"
                  )}
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-300 dark:border-zinc-700">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleBackToForm}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9668c2] transition-colors"
                  >
                    ← Back to Registration
                  </button>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Already verified?{" "}
                    <Link
                      href="/login"
                      className="text-[#9668c2] hover:underline cursor-pointer font-semibold"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
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
            Create an account
          </h1>

          <p className="text-sm md:text-md text-zinc-600 dark:text-zinc-400 text-center mt-1">
            Please fill in the form below
          </p>

          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-3 mt-[2vh] md:mt-[2vw] px-[2vh] md:px-0"
          >
            <Input
              label="Full Name"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              required
              disabled={isRegistering}
            />

            <Input
              label="Username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              required
              disabled={isRegistering}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              disabled={isRegistering}
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              disabled={isRegistering}
              placeholder="Minimum 6 characters"
            />

            <button
              type="submit"
              disabled={isRegistering || !isFormValid()}
              className="w-full py-2 mt-3 rounded-md font-medium text-white 
                       bg-gradient-to-r from-[#9668c2] to-[#7a4dc4] 
                       hover:from-[#8557b3] hover:to-[#6b42b5]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200"
            >
              {isRegistering ? (
                <div className="flex items-center gap-2 justify-center">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center mt-5 select-none">
            Already have an account?{" "}
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

export default RegisterForm;