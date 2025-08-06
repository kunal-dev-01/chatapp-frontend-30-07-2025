import React from "react";
import dynamic from "next/dynamic";
import Skeleton from "@/components/Layouts/Skeleton";

const ChatUserSearch = dynamic(
  () => import("@/components/Chats/ChatUserSearch"),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        width="w-full"
        height="h-12"
        rounded="rounded-md"
        animation="shimmer"
      />
    ),
  }
);

const ChatUsers = () => {
  return (
    <div
      className="w-[100vw] md:w-[30vw] h-[calc(100vh-7vh)] md:h-[75vh] md:rounded-l-xl md:p-[1vw] p-[1vh] bg-zinc-200"
      style={{
        boxShadow:
          window.innerWidth >= 768
            ? "inset 0 8px 8px -8px rgba(0,0,0,0.1), inset 0 -8px 8px -8px rgba(0,0,0,0.1), inset 8px 0 8px -8px rgba(0,0,0,0.1)"
            : "none",
      }}
    >
      <div className="w-full flex items-center justify-center">
        <ChatUserSearch />
      </div>
    </div>
  );
};

export default ChatUsers;
