import React, { useState, useEffect } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks/reduxHook";
import {
  loginUser,
  clearLoginState,
} from "@/Redux/UserServices/Slices/auth.slice";
import { toast } from "react-hot-toast";

const Input = dynamic(() => import("@/components/Layouts/AuthInput"), {
  ssr: false,
});

interface FormData {
  identifier: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get auth state from Redux
  const { 
    login: { loading: isLoading, error: loginError, success: loginSuccess },
    isAuthenticated 
  } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    password: "",
  });

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!formData.identifier.trim() || !formData.password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await dispatch(loginUser(formData)).unwrap();
      // Success will be handled by useEffect
    } catch (error) {
      // Error is already handled by Redux slice and will be shown in useEffect
      console.error("Login failed:", error);
    }
  };

  // Handle successful login
  useEffect(() => {
    if (loginSuccess) {
      toast.success("Login successful! Redirecting...", {
        duration: 2000,
      });
      
      // Clear the login state after success
      dispatch(clearLoginState());
      
      // Redirect to dashboard
      router.push("/user/?tab=chats");
    }
  }, [loginSuccess, router, dispatch]);

  // Handle login errors
  useEffect(() => {
    if (loginError) {
      toast.error(loginError, {
        duration: 4000,
      });
      
      // Clear error after showing toast
      setTimeout(() => {
        dispatch(clearLoginState());
      }, 100);
    }
  }, [loginError, dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/user/?tab=chats");
    }
  }, [isAuthenticated, router]);

  const isFormValid = (): boolean => {
    return Boolean(formData.identifier.trim() && formData.password.trim());
  };

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
            <Input
              label="Email or Username"
              type="text"
              value={formData.identifier}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleInputChange("identifier", e.target.value)
              }
              required
              disabled={isLoading}
            />
            
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleInputChange("password", e.target.value)
              }
              required
              disabled={isLoading}
            />

            <Link href="/forgot-password" className="select-none">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer pl-2 hover:underline">
                Forgot Password?
              </p>
            </Link>

            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="w-full py-2 mt-3 rounded-md font-medium text-white 
                       bg-gradient-to-r from-[#9668c2] to-[#7a4dc4] 
                       hover:from-[#8557b3] hover:to-[#6b42b5]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200"
            >
              {isLoading ? (
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