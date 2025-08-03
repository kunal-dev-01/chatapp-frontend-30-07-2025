import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MessageSquareText, UsersRound, User, Settings } from 'lucide-react';

interface LinkItem {
  icon: React.ComponentType<any>;
  url: string;
  tab: string;
}

const ChatNavigate: React.FC = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  const links: LinkItem[] = [
    {
      icon: MessageSquareText,
      url: "/user?tab=chats",
      tab: "chats",
    },
    {
      icon: UsersRound,
      url: "/user?tab=groups",
      tab: "groups",
    },
  ];

  return (
    <>
      <div className="glass-nav md:w-[50vw] w-full h-[6vh] md:h-[3vh] rounded-full p-4 bg-white/20 dark:bg-zinc-800/30 border border-white/10 dark:border-zinc-700/50 flex flex-col justify-between">
        {/* Navigation Links */}
        <div className="flex gap-3">
          {links.map((link, index) => {
            const isActive = activeTab === link.tab;
            const IconComponent = link.icon;

            return (
              <Link
                key={index}
                href={link.url}
                className={`nav-item w-full text-gray-700 dark:text-gray-200 
                  md:px-[1vw] md:py-[.5vw] px-3 py-2 rounded-xl 
                  flex items-center justify-center group
                  bg-white/30 dark:bg-zinc-700/50 
                  hover:bg-white/50 dark:hover:bg-zinc-600/60
                  border-white/20 dark:border-zinc-600/50
                  ${isActive ? 'bg-indigo-500/30 dark:bg-indigo-600/40 border-indigo-400/50' : ''}`}
              >
                <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </Link>
            );
          })}
        </div>

        {/* User Profile Section */}
        <div className="w-full md:flex gap-3 hidden">
          {/* User Avatar */}
          <Link
            href="/profile"
            className="nav-item w-full text-gray-700 dark:text-gray-200 
              md:px-[1vw] md:py-[.5vw] px-3 py-2 rounded-xl 
              flex items-center justify-center group
              bg-white/30 dark:bg-zinc-700/50 
              hover:bg-white/50 dark:hover:bg-zinc-600/60
              border-white/20 dark:border-zinc-600/50"
          >
            <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </Link>

          {/* Settings */}
          <Link
            href="/settings"
            className="nav-item w-full text-gray-700 dark:text-gray-200 
              md:px-[1vw] md:py-[.5vw] px-3 py-2 rounded-xl 
              flex items-center justify-center group
              bg-white/30 dark:bg-zinc-700/50 
              hover:bg-white/50 dark:hover:bg-zinc-600/60
              border-white/20 dark:border-zinc-600/50"
          >
            <Settings className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default ChatNavigate;