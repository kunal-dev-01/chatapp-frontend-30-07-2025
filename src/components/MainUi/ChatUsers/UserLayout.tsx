import React, { useState } from 'react';
import { useRipple } from '@/components/Layouts/UseRipple';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

const UserLayout = () => {
  const userRipple = useRipple<HTMLDivElement>();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      ref={userRipple} 
      className='w-full md:px-[.6vw] md:py-[.5vw] px-[1.5vh] py-[1vh] rounded-xl  hover:bg-zinc-300 dark:hover:bg-zinc-300 transition-all duration-200 cursor-pointer'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3 relative">
        {/* User Avatar */}
        <div className="w-12 h-12 select-none cursor-pointer rounded-full flex-shrink-0">
          <Image
            src="/user.webp"
            alt="chat-user"
            width={50}
            height={50}
            loading="lazy"
            className="object-cover rounded-full w-full h-full"
          />
        </div>

        {/* User Info Container */}
        <div className="flex-1 min-w-0 relative overflow-hidden">
          {/* Username */}
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-1 truncate">
            John Doe

            {/* User Status */}
            <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">
              @kunal_321
            </span>
          </h3>
          
          {/* Message Container with Fade Effect */}
          <div className="relative">
            <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate pr-8">
              Hey, how are you doing today? This is a long message that should be truncated...
            </p>
          
          </div>
        </div>

        {/* Time and Arrow Container */}
        <div className="flex flex-col items-end gap-1 ml-2">
          {/* Time */}
          <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
            12:30 PM
          </span>
          
          {/* Dropdown Arrow - Shows on Hover */}
          <div 
            className={`transition-all duration-300 ${
              isHovered 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-1'
            }`}
          >
            <ChevronDown 
              size={20} 
              className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors duration-200" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;