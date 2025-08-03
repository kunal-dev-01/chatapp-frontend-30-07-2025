import React from "react";
import Skeleton from "@/components/Layouts/Skeleton";
import dynamic from "next/dynamic";
import Link from "next/link";

const ItemsAndAuth = dynamic(() => import("./ItemsAndAuth"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width="md:w-[15vw] w-[23vh]"
      height="md:h-[3vw] h-[5.5vh]"
      rounded="rounded-lg"
      animation="shimmer"
    />
  ),
});

const HomeNavbar = () => {
  return (
    <nav className="w-full md:h-[4vw] h-[7vh] md:px-[10vw] px-[1vh] flex items-center justify-between sticky top-0 z-50 bg-transparent backdrop-blur-md">
      {/* Logo */}

      <div
        aria-label="nav-logo"
        className="md:text-[2.5vw] text-[4vh] cursor-pointer "
      >
        <Link
          href="/"
          className="font-prime text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500"
        >
          Sova
        </Link>
      </div>

      {/* Nav Items and Auth Button*/}

      <div aria-label="nav-items-and-auth" className="">
        <ItemsAndAuth />
      </div>
    </nav>
  );
};

export default HomeNavbar;
