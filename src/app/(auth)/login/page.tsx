"use client";
import React from "react";
import Loader from "@/components/Layouts/Loader";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("@/components/AuthForms/LoginForm"), {
  ssr: false,
  loading: () => <Loader />,
});

const Login = () => {
  return (
    <>
      <LoginForm />
    </>
  );
};

export default Login;
