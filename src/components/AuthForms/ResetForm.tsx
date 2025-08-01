import React, { useState } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const Input = dynamic(() => import("@/components/Layouts/AuthInput"), {
  ssr: false,
});

const ResetForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <AuthLayout>
      <div className="w-full md:w-[25vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
        <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[1vw]">
          <h1 className="md:text-[2vw] text-[3.5vh] font-semibold text-center">
            Reset Password
          </h1>

          <p className="text-sm md:text-md text-zinc-600 dark:text-zinc-400 text-center mt-1">
            Please enter your new password
          </p>

          <form
            onSubmit={handleReset}
            className="flex flex-col gap-3 mt-[2vh] md:mt-[2vw] px-[2vh] mx:px-0"
          >
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <span>Resetting...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center mt-5 select-none">
            Back to{" "}
            <Link
              href="/register"
              className="text-[#9668c2] hover:underline cursor-pointer font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetForm;
