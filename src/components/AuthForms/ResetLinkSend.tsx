import React from 'react'
import AuthLayout from "../Layouts/AuthLayout";
import Link from 'next/link';
import { Mail } from 'lucide-react';

const ResetLinkSend = ({email}:{email:string}) => {
  return (
    <AuthLayout>
        <div className="w-full md:w-[25vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
        <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[1vw]">
          <h1 className="md:text-[2vw] text-[3.5vh] font-semibold text-center dark:text-zinc-200">
            Forgot Password
          </h1>

          <Mail size={50} className="mx-auto my-[2vh] dark:text-zinc-200" />

          <p className="text-sm md:text-md text-zinc-600 dark:text-zinc-400 text-center mt-1">
            A password reset link has been sent to {email}
          </p>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center mt-5 select-none">
            Back to{" "}
            <Link
              href="/login"
              className="text-[#9668c2] hover:underline cursor-pointer font-semibold"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}

export default ResetLinkSend