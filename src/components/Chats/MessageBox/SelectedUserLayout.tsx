import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Skeleton from "@/components/Layouts/Skeleton";

const SelectedUserInfo = dynamic(() => import("./SelectedUserInfo"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width="w-full"
      height="md:h-[3vw]"
      animation="shimmer"
    />
  ),
});

const MessageBar = dynamic(() => import("./MessageBar"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width="w-full"
      height="md:h-[3vw]"
      animation="shimmer"
    />
  ),
});


const SelectedUserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full relative ">
      <SelectedUserInfo />
      <div className="w-full h-full">
        <Image
          src={"/main.png"}
          width={1200}
          height={720}
          alt={"chat-image"}
          loading="eager"
          priority
          className="w-full h-full object-cover rounded-r-2xl select-none"
        />

        {children}
      </div>
      <MessageBar/>
    </div>
  );
};

export default SelectedUserLayout;
