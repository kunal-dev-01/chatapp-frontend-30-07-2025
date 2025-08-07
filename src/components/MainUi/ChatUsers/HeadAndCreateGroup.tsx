import React, { useState, useRef } from "react";
import { EllipsisVertical, Plus } from "lucide-react";
import { useRipple } from "@/components/Layouts/UseRipple";
import { useClickOutside } from "@/Redux/Hooks/ClickOutside";
import dynamic from "next/dynamic";
import ChatMenu from "./ChatMenu";


const chatMenu = dynamic(() => import("./ChatMenu"), {
  ssr: false,
});

const HeadAndCreateGroup = () => {
  const plusRef = useRipple<HTMLDivElement>();
  const menuRef = useRipple<HTMLDivElement>();

  const chatRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [chatMenu, setChatMenu] = useState(false);

  useClickOutside({
    ref: panelRef,
    onOutsideClick: () => setChatMenu(false),
    ignoreRefs: [chatRef],
  });

  return (
    <div className="w-full flex items-center justify-between">
      <h1 className="md:text-[1.2vw] text-[2.5vh] text-zinc-600 dark:text-zinc-200 font-semibold">
        Chats
      </h1>

      <div className="flex items-center gap-1">
        <div
          ref={plusRef}
          className="p-2 rounded-lg hover:bg-zinc-300 transition-colors duration-200 cursor-pointer"
        >
          <Plus size={25} />
        </div>

        <div
          ref={menuRef}
          className={`p-2 rounded-lg  ${chatMenu  ? "bg-zinc-300 dark:bg-zinc-700" : "hover:bg-zinc-300 dark:hover:bg-zinc-700"} transition-colors duration-200 cursor-pointer relative`}
        >
          <div
            ref={chatRef}
            onClick={()=> setChatMenu((prev) => !prev)}
            className="relative"
          >
            <EllipsisVertical size={25} />
          </div>

          {chatMenu && <ChatMenu />}
        </div>
      </div>
    </div>
  );
};

export default HeadAndCreateGroup;
