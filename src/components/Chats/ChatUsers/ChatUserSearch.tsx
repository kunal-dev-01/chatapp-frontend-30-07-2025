import { Search } from 'lucide-react';
import React from 'react'


const ChatUserSearch = () => {


  return (
    <div className="w-full cursor-pointer rounded-full bg-transparent relative">
      <input
        type="text"
        placeholder="Search chat users..."
        className="w-full md:pl-[3vw] pl-[7vh] pt-[.8vh] pb-[.6vh] outline-none rounded-full bg-transparent border-2 border-zinc-300 dark:border-zinc-500 placeholder:text-[2vh] relative"
      />

      <div className="absolute top-2 left-5">
        <Search size={25} className='text-zinc-400 dark:text-zinc-300'/>
      </div>

    </div>
  );
};

export default ChatUserSearch;
