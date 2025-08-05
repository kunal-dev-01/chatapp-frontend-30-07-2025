import React, { useState, useEffect } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import Loader from "../Layouts/Loader";
import dynamic from "next/dynamic";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks/reduxHook";
import {
  forgotPassword,
  clearForgotPasswordError,
} from "@/Redux/UserServices/Slices/auth.slice";
import { toast } from "react-hot-toast";

const Input = dynamic(() => import("@/components/Layouts/AuthInput"), {
  ssr: false,
});

const ResetLinkSend = dynamic(() => import("./ResetLinkSend"), {
  ssr: false,
  loading: () => <Loader />,
});



const ForgotForm = () => {
  const dispatch = useAppDispatch();
  const { isForgotPassword, isForgotPasswordError } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    try {
      await dispatch(forgotPassword(email)).unwrap();
      setIsEmailSent(true);
    } catch (error) {
      // Error handling is done by Redux
      console.error("Forgot password failed:", error);
    }
  };

  useEffect(() => {
    if (typeof isForgotPasswordError === "string") {
      toast.error(isForgotPasswordError, {
        duration: 4000,
      });
      dispatch(clearForgotPasswordError()); // clear after showing
    }
  }, [isForgotPasswordError, dispatch]);

  const isFormValid = () => {
    return email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <AuthLayout>
      {isEmailSent ? (
        <ResetLinkSend email={email} />
      ) : (
        <div className="w-full md:w-[25vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
          <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[1vw]">
            <h1 className="md:text-[2vw] text-[3.5vh] font-semibold text-center dark:text-zinc-200">
              Forgot Password
            </h1>

            <p className="text-sm md:text-md text-zinc-600 dark:text-zinc-400 text-center mt-1">
              Please enter the email associated with your account
            </p>

            <form
              onSubmit={handleForgot}
              className="flex flex-col gap-3 mt-[2vh] md:mt-[2vw] px-[2vh] md:px-0"
            >
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={isForgotPassword || !isFormValid()}
                className="w-full py-2 mt-3 rounded-md font-medium text-white 
                         bg-gradient-to-r from-[#9668c2] to-[#7a4dc4] 
                         hover:from-[#8557b3] hover:to-[#6b42b5]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              >
                {isForgotPassword ? (
                  <div className="flex items-center gap-2 justify-center">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Reset Link"
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
      )}
    </AuthLayout>
  );
};

export default ForgotForm;
