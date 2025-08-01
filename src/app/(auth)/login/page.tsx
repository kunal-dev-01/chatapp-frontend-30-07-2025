"use client"
import React from 'react'
import dynamic from 'next/dynamic'

const LoginForm = dynamic(() => import("@/components/AuthForms/LoginForm"), { ssr: false });

const Login = () => {
  return (
    <>
      <LoginForm/>
    </>
  )
}

export default Login