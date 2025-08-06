import React,{useRef,useEffect} from "react";
import { addRipple } from "../Layouts/RippleEffect";

const ChatUserSearch = () => {

  const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (divRef.current) {
        addRipple(divRef.current);
      }
    }, []);

  return (
    <div ref={divRef} className="w-full bg-transparent cursor-pointer rounded-full">
      <input
        type="text"
        placeholder="Search chat users..."
        className="w-full md:pl-[3vw] pl-[7vh] pt-[.8vh] pb-[.6vh] outline-none rounded-full bg-zinc-300 placeholder:text-[2vh]"
      />
    </div>
  );
};

export default ChatUserSearch;
