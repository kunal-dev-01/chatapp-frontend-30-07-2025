import { Clock } from "lucide-react";
import { EmojiCategory, RecentEmoji } from "./useEmojiData";
import React, { useRef } from "react";

const CategorySlider = React.memo<{
  categories: EmojiCategory[];
  activeCategory: string;
  onCategoryClick: (categoryName: string) => void;
  recentEmojis: RecentEmoji[];
}>(({ categories, activeCategory, onCategoryClick, recentEmojis }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-zinc-700">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide px-2 py-3 space-x-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {/* Recent category */}
        {recentEmojis.length > 0 && (
          <button
            onClick={() => onCategoryClick('Recent')}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
              activeCategory === 'Recent'
                ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500 scale-105'
                : 'hover:bg-gray-100 dark:hover:bg-zinc-600 hover:scale-105'
            }`}
          >
            <Clock className={`w-5 h-5 ${
              activeCategory === 'Recent' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-gray-600 dark:text-gray-300'
            }`} />
            <span className="text-xs text-gray-600 dark:text-gray-300 mt-1">Recent</span>
          </button>
        )}

        {/* Category buttons */}
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.name}
              onClick={() => onCategoryClick(category.name)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
                activeCategory === category.name
                  ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500 scale-105'
                  : 'hover:bg-gray-100 dark:hover:bg-zinc-600 hover:scale-105'
              }`}
            >
              <IconComponent 
                className={`w-5 h-5 ${
                  activeCategory === category.name 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-600 dark:text-gray-300'
                }`} 
              />
              <span className="text-xs text-gray-600 dark:text-gray-300 mt-1 truncate w-full px-1">
                {category.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default CategorySlider;
