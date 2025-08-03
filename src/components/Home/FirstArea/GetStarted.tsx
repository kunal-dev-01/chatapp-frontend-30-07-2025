import React, { useEffect, useRef } from "react";
import { addRipple } from "../../Layouts/RippleEffect";
import { ArrowRight } from "lucide-react";

const GetStarted = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      addRipple(buttonRef.current);
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      className="group relative overflow-hidden px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out focus:outline-none mt-5 cursor-pointer"
    >
      {/* Background gradient overlay for hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Text with subtle animation */}
      <span className="relative z-10 flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
        Get Started
        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
      </span>

      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out"></div>
    </button>
  );
};

export default GetStarted;
