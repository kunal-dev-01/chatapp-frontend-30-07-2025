import React from "react";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";
import { useRipple } from "@/components/Layouts/UseRipple";

const SelectedUserInfo = () => {
  const selectedChatRef = useRipple<HTMLDivElement>();

  return (
    <div className="w-full md:h-[3.2vw] absolute z-2 top-0 rounded-tr-xl backdrop-blur-xl flex items-center justify-between md:px-[1vw] ">
      <div className="flex items-center md:gap-[.8vw]">
        <div className="w-12 h-12 select-none cursor-pointer rounded-full flex-shrink-0 border-2 border-purple-400">
          <Image
            src="/user.webp"
            alt="chat-user"
            width={50}
            height={50}
            loading="lazy"
            className="object-cover rounded-full w-full h-full"
          />
        </div>

        <div className=" min-w-0 relative overflow-hidden">
          {/* Username */}
          <h3 className="text-md font-semibold text-zinc-100 dark:text-zinc-200 truncate">
            John Doe
            {/* User Status */}
            <span className="text-xs text-zinc-200 dark:text-zinc-400 ml-1.5">
              @kunal_321
            </span>
          </h3>

          {/* Message Container with Fade Effect */}
          <div className="relative">
            <p className="text-[.7vw] text-purple-300  truncate">Typing...</p>
          </div>
        </div>
      </div>

      <div
        ref={selectedChatRef}
        className="p-2 rounded-lg hover:bg-zinc-300/20 transition-colors duration-200 cursor-pointer"
      >
        <EllipsisVertical size={25} className="text-zinc-200"/>
      </div>
    </div>
  );
};

export default SelectedUserInfo;
