import React from "react";
import dynamic from "next/dynamic";

const NoChatSelected = dynamic(() => import("./NoChatSelected") , {
  ssr:false
})

const SelectedChat = dynamic(() => import("./SelectedChat") , {
  ssr:false
})

const ChatIndex = () => {
  return (
    <div className="w-[100vw] h-[calc(100vh-7vh)] md:w-[calc(100vw-33.3vw)] md:h-[75vh] md:rounded-r-2xl overflow-hidden md:shadow-[inset_0_8px_8px_-8px_rgba(0,0,0,0.1),inset_0_-8px_8px_-8px_rgba(0,0,0,0.1),inset_-8px_0_8px_-8px_rgba(0,0,0,0.1)]">

      <div className="w-full h-full">
        <SelectedChat/>
      </div>

    </div>
  );
};

export default ChatIndex;
