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
    <div className="border-b border-gray-200 dark:border-gray-600 bg-zinc-50 dark:bg-zinc-700">
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll scrollbar-hide px-2 py-2 space-x-2 snap-x snap-mandatory"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        
        {/* Recent category */}
        {recentEmojis.length > 0 && (
          <div
            onClick={() => onCategoryClick('Recent')}
            className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 snap-center outline-none focus:outline-none ${
              activeCategory === 'Recent'
                ? 'bg-purple-100 dark:bg-green-900/30 border-2 border-purple-500 scale-110'
                : 'hover:bg-gray-100 dark:hover:bg-zinc-600 hover:scale-110'
            }`}
          >
            <Clock className={`w-4 h-4 ${
              activeCategory === 'Recent'
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-300'
            }`} />
          </div>
        )}

        {/* Category buttons */}
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div
              key={category.name}
              onClick={() => onCategoryClick(category.name)}
              className={`flex-shrink-0 flex items-center justify-center w-13 h-10 rounded-3xl transition-all duration-200 snap-center outline-none focus:outline-none ${
                activeCategory === category.name
                  ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500 scale-110'
                  : 'hover:bg-gray-100 dark:hover:bg-zinc-600 hover:scale-110'
              }`}
            >
              <IconComponent
                className={`w-6 h-6 ${
                  activeCategory === category.name
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default CategorySlider;