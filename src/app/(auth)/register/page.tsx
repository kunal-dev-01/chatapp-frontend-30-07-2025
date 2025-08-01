"use client";
import React from 'react'
import Loader from "@/components/Layouts/Loader";
import dynamic from "next/dynamic";

const RegisterForm  = dynamic(() => import("@/components/AuthForms/RegisterForm"), {
  ssr: false,
  loading: () => <Loader />
})

const Register = () => {
  return (
    <>
      <RegisterForm />
    </>
  )
}

export default Register