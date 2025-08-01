import React, { useState } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import dynamic from 'next/dynamic';
import { Loader2 } from "lucide-react";
import Link from "next/link";

const Input = dynamic(() => import("@/components/Layouts/AuthInput"), {
  ssr: false,
});

const ForgotForm = () => {

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleForgot = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <AuthLayout>
      <div className="w-full md:w-[25vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
        <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[1vw]">
          <h1 className="md:text-[2vw] text-[3.5vh] font-semibold text-center">
            Forgot Password
          </h1>

          <p className="text-sm md:text-md text-zinc-600 dark:text-zinc-400 text-center mt-1">
            Please enter the email associated with your account
          </p>

          <form
            onSubmit={handleForgot}
            className="flex flex-col gap-3 mt-[2vh] md:mt-[2vw] px-[2vh] mx:px-0"
          >
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-3 rounded-md font-medium text-white 
             bg-gradient-to-r from-[#9668c2] to-[#7a4dc4] cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2 justify-center">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Verification Code"
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

export default ForgotForm;
