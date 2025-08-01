"use client";
import React from "react";
import Loader from "@/components/Layouts/Loader";
import dynamic from "next/dynamic";

const ResetForm = dynamic(() => import("@/components/AuthForms/ResetForm"), {
  ssr: false,
  loading: () => <Loader />,
});

const ResetPassword = () => {
  return (
    <>
      <ResetForm />
    </>
  );
};

export default ResetPassword;
