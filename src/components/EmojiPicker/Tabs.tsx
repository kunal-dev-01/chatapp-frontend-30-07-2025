import { Smile } from "lucide-react";
import { Image } from "lucide-react";
import React from "react";

const Tabs = React.memo<{
  activeTab: 'emoji' | 'gif';
  onTabChange: (tab: 'emoji' | 'gif') => void;
}>(({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-zinc-700">
      <button
        onClick={() => onTabChange('emoji')}
        className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-medium transition-all duration-200 ${
          activeTab === 'emoji'
            ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/20'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
      >
        <Smile className="w-4 h-4" />
        Emoji
      </button>
      <button
        onClick={() => onTabChange('gif')}
        className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-medium transition-all duration-200 ${
          activeTab === 'gif'
            ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/20'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
      >
        <Image className="w-4 h-4" />
        GIF
      </button>
    </div>
  );
});

export default Tabs;