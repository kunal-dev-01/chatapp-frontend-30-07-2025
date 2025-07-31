import Image from "next/image";
import Link from "next/link";
import React from "react";

const ItemsAndAuth = () => {
  return (
    <div className="flex items-center md:gap-[.5vw] gap-[1vh]">
      <div aria-label="nav-items" title="github" className="cursor-pointer">
        <Image
          src="/github.avif"
          width={50}
          height={50}
          alt="github"
          loading="lazy"
          className="md:h-[2vw] md:w-[2vw] h-[3.5vh] w-[3.5vh] rounded-lg"
        />
      </div>

      <div aria-label="nav-items" title="linkdin" className="cursor-pointer">
        <Image
          src="/message.avif"
          width={50}
          height={50}
          loading="lazy"
          alt="linkdin"
          className="md:h-[2vw] md:w-[2vw] h-[3.5vh] w-[3.5vh] rounded-lg"
        />
      </div>

      <div aria-label="auth-button" className="inline-block pl-3">
        <Link href="/login" passHref>
          <button
            type="button"
            aria-label="auth-button"
            className="group relative inline-flex items-center justify-center cursor-pointer select-none rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-[3vh] py-[.8vh] text-sm font-semibold text-white transition-all duration-300 ease-out hover:shadow-xl hover:shadow-indigo-500/50 md:px-[2vw] md:py-[.4vw] focus:outline-none focus:ring-4 focus:ring-indigo-500/40 active:scale-95 overflow-hidden"
          >
            {/* Continuous sweep */}
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/60 to-transparent animate-[sweep_1.5s_linear_infinite]"
              />
            </span>

            <span className="relative z-10 md:text-[1vw] text-[1.7vh]">Login</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ItemsAndAuth;
