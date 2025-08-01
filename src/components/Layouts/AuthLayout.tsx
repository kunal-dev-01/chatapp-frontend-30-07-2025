import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div aria-label="web-logo" onClick={() => window.location.href = "/"} className="absolute md:top-[2vw] top-[1vh] md:left-[2vw] left-[1vh]">
        <h1 className="md:text-[2.2vw] text-[3.5vh] font-prime font-[700] cursor-pointer bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500 text-transparent">
          Sova
        </h1>
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;