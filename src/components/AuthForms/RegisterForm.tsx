import React, { useEffect, useState } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks/reduxHook";
import {
  registerUser,
  clearRegisterState,
  clearResendVerificationState,
} from "@/Redux/UserServices/Slices/auth.slice";
import { toast } from "react-hot-toast";
import { RegisterRequest } from "@/Redux/UserServices/types/auth.type";

const EmailVerificationSuccess = dynamic(() => import("./EmailVerificationSuccess"), {
  ssr: false,
});

// Dynamic imports for better performance
const Input = dynamic(() => import("@/components/Layouts/AuthInput"), {
  ssr: false,
  loading: () => <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
});

interface FormData extends RegisterRequest {
  // Extending RegisterRequest ensures type safety
}

interface ValidationErrors {
  [key: string]: string;
}

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Redux selectors with proper typing
  const registerState = useAppSelector((state) => state.auth.register);
  const resendVerificationState = useAppSelector((state) => state.auth.resendVerification);

  // Local state
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [registrationStep, setRegistrationStep] = useState<"form" | "success">("form");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Form validation rules
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Full name validation
    if (formData.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    } else if (formData.fullName.trim().length > 50) {
      errors.fullName = "Full name must be less than 50 characters";
    }

    // Username validation
    if (formData.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (formData.username.trim().length > 30) {
      errors.username = "Username must be less than 30 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = "Password must contain uppercase, lowercase, and number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form utilities
  const isFormValid = (): boolean => {
    return (
      formData.fullName.trim().length >= 2 &&
      formData.username.trim().length >= 3 &&
      formData.email.trim().length > 0 &&
      formData.password.trim().length >= 8 &&
      Object.keys(validationErrors).length === 0
    );
  };

  // Event handlers
  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    console.log("🚀 Starting registration process...");
    
    // Clear previous errors
    setValidationErrors({});

    // Client-side validation
    if (!validateForm()) {
      console.log("❌ Client-side validation failed");
      return;
    }

    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      console.log("✅ Registration result:", result);

      if (result?.status === 'success') {
        console.log("✅ Registration successful, showing success step");
        setRegistrationStep("success");
        toast.success(result.message || "Registration successful! Please check your email.");
      }
    } catch (error) {
      console.error("❌ Registration failed:", error);
      // Error handling is done in useEffect
    }
  };

  const handleBackToForm = (): void => {
    setRegistrationStep("form");
    setValidationErrors({});
    dispatch(clearRegisterState());
    dispatch(clearResendVerificationState());
  };

  // Error handling effects
  useEffect(() => {
    if (registerState?.error) {
      console.log("🔍 Registration error:", registerState.error);
      
      toast.error(registerState.error, {
        duration: 5000,
        icon: <AlertCircle className="w-5 h-5" />,
      });
      
      // Clear error state
      const timer = setTimeout(() => {
        dispatch(clearRegisterState());
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [registerState?.error, dispatch]);

  useEffect(() => {
    if (resendVerificationState?.error) {
      console.log("🔍 Resend verification error:", resendVerificationState.error);
      
      toast.error(resendVerificationState.error, {
        duration: 5000,
        icon: <AlertCircle className="w-5 h-5" />,
      });
      
      // Clear error state
      const timer = setTimeout(() => {
        dispatch(clearResendVerificationState());
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [resendVerificationState?.error, dispatch]);

  // Render success step
  if (registrationStep === "success") {
    return (
      <EmailVerificationSuccess
        email={formData.email}
        onBackToForm={handleBackToForm}
      />
    );
  }

  // Render registration form
  return (
    <AuthLayout>
      <div className="w-full md:w-[25vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
        <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[1vw]">
          <header className="text-center mb-6">
            <h1 className="md:text-[2vw] text-[3.5vh] font-semibold dark:text-zinc-200">
              Create an account
            </h1>
            <p className="text-sm md:text-md text-zinc-600 dark:text-zinc-400 mt-1">
              Please fill in the form below
            </p>
          </header>

          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-3 mt-[2vh] md:mt-[2vw] px-[2vh] md:px-0"
            noValidate
          >
            {/* Full Name Field */}
            <div>
              <Input
                label="Full Name"
                type="text"
                value={formData.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange("fullName", e.target.value)
                }
                required
                disabled={registerState?.loading}
                placeholder="Enter your full name"
                autoComplete="name"
              />
              {validationErrors.fullName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {validationErrors.fullName}
                </p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <Input
                label="Username"
                type="text"
                value={formData.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange("username", e.target.value)
                }
                required
                disabled={registerState?.loading}
                placeholder="Choose a username (min 3 characters)"
                autoComplete="username"
              />
              {validationErrors.username && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {validationErrors.username}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange("email", e.target.value)
                }
                required
                disabled={registerState?.loading}
                placeholder="Enter your email address"
                autoComplete="email"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange("password", e.target.value)
                }
                required
                disabled={registerState?.loading}
                placeholder="Minimum 8 characters with uppercase, lowercase & number"
                autoComplete="new-password"
              />
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={registerState?.loading || !isFormValid()}
              className="w-full py-2 mt-3 rounded-md font-medium text-white 
                       bg-gradient-to-r from-[#9668c2] to-[#7a4dc4] 
                       hover:from-[#8557b3] hover:to-[#6b42b5]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9668c2] focus:ring-offset-2"
            >
              {registerState?.loading ? (
                <div className="flex items-center gap-2 justify-center">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <footer className="text-center mt-5">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 select-none">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#9668c2] hover:underline cursor-pointer font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterForm;