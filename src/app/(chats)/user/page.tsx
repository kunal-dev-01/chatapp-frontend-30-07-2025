"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Skeleton from "@/components/Layouts/Skeleton";

const ChatNavigate = dynamic(() => import("@/components/Chats/ChatNavigate"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width="w-full"
      height="h-12"
      rounded="rounded-md"
      animation="shimmer"
    />
  ),
});

const ChatNavbar = dynamic(() => import("../../../components/Navbars/ChatNavbar/ChatNavbar"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width="w-full"
      height="h-[6vh] md:h-[3vw]"
      rounded="rounded-full"
      animation="shimmer"
    />
  ),
});

const Chats = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  return (
    <div className="w-full h-screen md:p-3">
      <div className="w-full md:p-3 md:rounded-2xl md:border-2 dark:border-zinc-600 border-gray-300 bg-zinc-200 dark:bg-zinc-800 md:shadow-[inset_0_0_8px_rgba(0,0,0,0.1)] md:dark:shadow-[inset_0_0_8px_rgba(255,255,255,0.05)]">

        <div className="w-full">
          <ChatNavbar />
        </div>

        <div className="">
          <div className=""></div>

          {/* <div className="md:py-[.5vw] md:px-[1vw] p-1 ">
            {tab === "chats" || tab === "groups" ? (
              <ChatNavigate />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">
                  Please select a valid tab.
                </p>
              </div>
            )}
          </div> */}
        </div>


      </div>
    </div>
  );
};

export default Chats;
