import React, { useEffect, useState } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "@/Redux/Hooks/reduxHook";
import {
  loginUser,
  clearLoginState,
} from "@/Redux/UserServices/Slices/auth.slice";

// Dynamic Input
const Input = dynamic(() => import("@/components/Layouts/AuthInput"), {
  ssr: false,
  loading: () => <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />,
});

interface FormData {
  identifier: string;
  password: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { login, isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Validation
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.identifier.trim()) {
      errors.identifier = "Email or username is required";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = (): boolean => {
    return (
      formData.identifier.trim().length > 0 &&
      formData.password.trim().length > 0 &&
      Object.keys(validationErrors).length === 0
    );
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(loginUser(formData)).unwrap();
      toast.success("Login successful!", {
        duration: 3000
      });
      setFormData({ identifier: "", password: "" });
      setValidationErrors({});
      router.push("/user/?tab=chats");
    } catch (error) {
      console.log("Login failed:", error);
      // handled by useEffect
    }
  };

  // Auto redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/user/?tab=chats");
    }
  }, [isAuthenticated, router]);

  // Error feedback
  useEffect(() => {
    if (login?.error) {
      toast.error(login?.error, {
        duration: 4000,
        icon: <AlertCircle className="w-5 h-5" />,
      });

      const timer = setTimeout(() => {
        dispatch(clearLoginState());
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [login?.error, dispatch]);

  return (
    <AuthLayout>
      <div className="w-full md:w-[25vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
        <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[1vw]">
          <h1 className="md:text-[2vw] text-[3.5vh] font-semibold text-center dark:text-zinc-200">
            Welcome Back
          </h1>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center mt-1">
            We're happy to see you again! Log in below
          </p>

          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-3 mt-[2vh] md:mt-[2vw] px-[2vh] md:px-0"
          >
            {/* Identifier Field */}
            <div>
              <Input
                label="Email or Username"
                type="text"
                value={formData.identifier}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("identifier", e.target.value)
                }
                required
                disabled={login?.loading}
                autoComplete="username"
              />
              {validationErrors.identifier && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.identifier}
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
                disabled={login?.loading}
                autoComplete="current-password"
              />
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            <Link href="/forgot-password" className="select-none">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer pl-2 hover:underline">
                Forgot Password?
              </p>
            </Link>

            <button
              type="submit"
              disabled={login?.loading || !isFormValid()}
              className="w-full py-2 mt-3 rounded-md font-medium text-white 
                         bg-gradient-to-r from-[#9668c2] to-[#7a4dc4] 
                         hover:from-[#8557b3] hover:to-[#6b42b5]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
            >
              {login?.loading ? (
                <div className="flex items-center gap-2 justify-center">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center mt-5 select-none">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#9668c2] hover:underline cursor-pointer font-semibold"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
