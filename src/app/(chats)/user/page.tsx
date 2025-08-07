"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Skeleton from "@/components/Layouts/Skeleton";

import { useAppSelector } from "@/Redux/Hooks/reduxHook";

const ChatNavigate = dynamic(() => import("@/components/MainUi/ChatNavigate"), {
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

const ChatNavbar = dynamic(
  () => import("../../../components/Navbars/ChatNavbar/ChatNavbar"),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        width="w-full"
        height="h-[7vh] md:h-[3vw]"
        rounded="rounded-full"
        animation="shimmer"
      />
    ),
  }
);

const ChatIndex = dynamic(() => import("@/components/MainUi/MessageBox/ChatIndex"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width="w-full"
      height="h-[91vh] md:h-[75vh]"
      rounded="rounded-md"
      animation="shimmer"
      className="mt-2 md:mt-0"
    />
  ),
});

const ChatUsers = dynamic(() => import("@/components/MainUi/ChatUsers/ChatUsers"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width="w-full"
      height="h-[91vh] md:h-[75vh]"
      rounded="rounded-md"
      animation="shimmer"
      className="mt-2 md:mt-0"
    />
  ),
});

const Chats = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const {accessToken ,user} = useAppSelector((state) => state.auth);

  console.log(accessToken,user)


  return (
    <div className="w-full h-screen md:p-[1vw]">
      <div className="w-full md:p-[.5vw] md:rounded-2xl md:border-2 dark:border-zinc-600 border-gray-300 bg-zinc-200 dark:bg-zinc-800 md:shadow-[inset_0_0_8px_rgba(0,0,0,0.1)] md:dark:shadow-[inset_0_0_8px_rgba(255,255,255,0.05)]">


        <div className="w-full">
          {tab === "chats" || tab === "groups" ? (
              <ChatNavbar />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">
                  Please select a valid tab.
                </p>
              </div>
            )}
        </div>

        <div className="flex items-center md:mt-3 w-full md:w-[30vw]">
          <div className="">
            {tab === "chats" &&  <ChatUsers />}
          </div>

          <div className="hidden md:block">
            <ChatIndex />
          </div>
        </div>


      </div>
    </div>
  );
};

export default Chats;
