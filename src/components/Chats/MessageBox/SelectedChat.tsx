import dynamic from "next/dynamic";
import React from "react";

const SelectedUserLayout = dynamic(() => import("./SelectedUserLayout"),{
    ssr:false
})

const SelectedChat = () => {
  return (
    <SelectedUserLayout>
        <div className="w-full h-full absolute top-0 rounded-r-xl bg-[#22222236] md:pt-[3.5vw] md:pb-[3.7vw] overflow-y-scroll scrollbar-hide text-zinc-200">
         
        </div>
    </SelectedUserLayout>
  );
};

export default SelectedChat;
