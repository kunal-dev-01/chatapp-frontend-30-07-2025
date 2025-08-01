import React, { useState } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Loader from "../Layouts/Loader";

const Input = dynamic(() => import("@/components/Layouts/AuthInput"), {
  ssr: false,
});

const VerifyForm = dynamic(() => import("./VerifyForm"), {
  ssr: false,
  loading: () => <Loader />,
});

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submit, setSubmit] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
  };

  return (
    <AuthLayout>
      {submit ? (
        <VerifyForm />
      ) : (
        <div className="w-full md:w-[25vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
          <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[1vw]">
            <h1 className="md:text-[2vw] text-[3.5vh] font-semibold text-center">
              Create an account
            </h1>

            <p className="text-sm md:text-md text-zinc-600 dark:text-zinc-400 text-center mt-1">
              Please fill in the form below
            </p>

            <form
              onSubmit={handleRegister}
              className="flex flex-col gap-3 mt-[2vh] md:mt-[2vw] px-[2vh] mx:px-0"
            >
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                    <span>Signing Up...</span>
                  </div>
                ) : (
                  "Sign Up"
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
      )}
    </AuthLayout>
  );
};

export default RegisterForm;
