"use client";
import React from "react";
import Loader from "@/components/Layouts/Loader";
import dynamic from "next/dynamic";
import { useParams } from 'next/navigation';

const ResetForm = dynamic(() => import("@/components/AuthForms/ResetForm"), {
  ssr: false,
  loading: () => <Loader />,
});

const ResetPassword = () => {
  const params = useParams();
  const token = params?.token as string;

  return (
    <ResetForm token={token} />
  );
};

export default ResetPassword;