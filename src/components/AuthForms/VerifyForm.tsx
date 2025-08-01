import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import dynamic from 'next/dynamic';

const Input = dynamic(() => import("@/components/Layouts/AuthInput"), {
  ssr: false,
});

const VerifyForm = () => {

  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };


  return (
    <div className="w-full md:w-[25vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
      <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[1vw]">
        <h1 className="md:text-[2vw] text-[3.5vh] font-semibold text-center">
          Verify Account
        </h1>

        <p className="text-sm md:text-md text-zinc-600 dark:text-zinc-400 text-center mt-1">
          Please enter the verification code sent to your email
        </p>

        <form
          onSubmit={handleVerify}
          className="flex flex-col gap-3 mt-[2vh] md:mt-[2vw] px-[2vh] mx:px-0"
        >

          <Input
            label="verification code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyForm;
