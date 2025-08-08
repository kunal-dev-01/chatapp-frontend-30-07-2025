import { Gift, Smile } from "lucide-react";
import React from "react";

const Tabs = React.memo<{
  activeTab: 'emoji' | 'gif';
  onTabChange: (tab: 'emoji' | 'gif') => void;
}>(({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center p-1 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-zinc-700">
      <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-full border border-gray-200 dark:border-gray-600 p-1">
        <button
          onClick={() => onTabChange('emoji')}
          className={`flex items-center justify-center px-2 py-0.5 rounded-full transition-all duration-300 outline-none ${
            activeTab === 'emoji'
              ? 'bg-white dark:bg-zinc-700 shadow-sm border border-gray-200 dark:border-gray-600 text-purple-600 dark:text-purple-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Smile size={25} />
        </button>
        
        <button
          onClick={() => onTabChange('gif')}
          className={`flex items-center justify-center px-2 py-0.5 rounded-full transition-all duration-200 outline-none ${
            activeTab === 'gif'
              ? 'bg-white dark:bg-zinc-700 shadow-sm border border-gray-200 dark:border-gray-600 text-purple-600 dark:text-purple-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Gift size={25} />
        </button>
      </div>
    </div>
  );
});

export default Tabs;