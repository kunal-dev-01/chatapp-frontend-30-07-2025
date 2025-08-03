import Link from "next/link";
import Image from "next/image";
import {addRipple} from "@/components/Layouts/RippleEffect";
import React, { useEffect, useRef } from "react";
import { Bell } from "lucide-react";

const ChatNavbar = () => {

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      addRipple(buttonRef.current);
    }
  }, []);

  return (
    <div className="w-full md:h-[3vw] h-[6.7vh] md:py-[.5vw] md:px-[.8vw] px-[1vh] md:rounded-full border-2 border-zinc-100/20 dark:border-zinc-700/50 flex items-center justify-between bg-zinc-200/10 dark:bg-zinc-800/20 backdrop-blur-md md:shadow-[0_0_20px_rgba(113,113,122,0.4)] md:dark:shadow-[0_0_20px_rgba(161,161,170,0.3)]">

      <h1 className="font-prime text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500 md:text-[2vw] text-[4vh] cursor-pointer select-none">
        Sova
      </h1>

      <div className="flex items-center gap-[1.2vh] md:gap-[.8vw]">

        <button ref={buttonRef} className="px-3 py-1.5 md:px-[.9vw] md:py-[.4vw] cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-full transition-all duration-200 ease-in-out">
          <Bell size={30} />
        </button>

        <div className="md:h-10 md:w-10 w-12 h-12 select-none cursor-pointer rounded-full">
          <Link href="/user/?tab=user-profile" className="w-full h-full">
            <Image
              src="/user.webp"
              alt="user-profile"
              width={40}
              height={40}
              loading="lazy"
              className="object-cover rounded-full w-full h-full"
            />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default ChatNavbar;
