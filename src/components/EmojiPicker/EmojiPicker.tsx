import { Smile } from "lucide-react";
import GIFGrid from "./GIFGrid";
import EmojiGrid from "./EmojiGrid";
import CategoryLabel from "./CategoryLabel";
import CategorySlider from "./CategorySidebar";
import SearchBar from "./SearchBar";
import Tabs from "./Tabs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {  Emoji, EmojiCategory, RecentEmoji, EmojiSkeleton } from "./useEmojiData";

import useEmojiData from "./useEmojiData";

const EmojiPicker: React.FC<{
  onEmojiSelect?: (emoji: string) => void;
  onClose?: () => void;
}> = ({ onEmojiSelect, onClose }) => {
  const [activeTab, setActiveTab] = useState<'emoji' | 'gif'>('emoji');
  const [searchTerm, setSearchTerm] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<RecentEmoji[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { emojiData, loading } = useEmojiData();

  // Initialize recent emojis and active category
  useEffect(() => {
    const savedRecent: RecentEmoji[] = [];
    setRecentEmojis(savedRecent);
    
    if (emojiData.length > 0 && !activeCategory) {
      setActiveCategory(emojiData[0].name);
    }
  }, [emojiData, activeCategory]);

  // Memoized filtered emojis for performance
  const filteredEmojis = useMemo(() => {
    if (!searchTerm.trim()) return emojiData;

    const searchLower = searchTerm.toLowerCase();
    const filtered: EmojiCategory[] = [];

    emojiData.forEach(category => {
      const matchingEmojis = category.emojis.filter(emoji =>
        emoji.name.toLowerCase().includes(searchLower) ||
        emoji.shortcode.toLowerCase().includes(searchLower) ||
        emoji.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
      );

      if (matchingEmojis.length > 0) {
        filtered.push({
          name: category.name,
          emojis: matchingEmojis,
          icon: category.icon
        });
      }
    });

    return filtered;
  }, [emojiData, searchTerm]);

  // Optimized emoji selection handler
  const handleEmojiSelect = useCallback((emoji: Emoji) => {
    setRecentEmojis(prev => {
      const existing = prev.find(item => item.emoji === emoji.emoji);
      let updated: RecentEmoji[];

      if (existing) {
        updated = prev.map(item =>
          item.emoji === emoji.emoji
            ? { ...item, count: item.count + 1, lastUsed: Date.now() }
            : item
        );
      } else {
        updated = [
          { emoji: emoji.emoji, count: 1, lastUsed: Date.now() },
          ...prev
        ];
      }

      return updated
        .sort((a, b) => b.lastUsed - a.lastUsed)
        .slice(0, 20);
    });

    if (onEmojiSelect) {
      onEmojiSelect(emoji.emoji);
    }
  }, [onEmojiSelect]);

  // Optimized category navigation
  const handleCategoryClick = useCallback((categoryName: string) => {
    setActiveCategory(categoryName);
    
    if (categoryName === 'Recent') {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      const categoryRef = categoryRefs.current[categoryName];
      if (categoryRef && scrollContainerRef.current) {
        const containerRect = scrollContainerRef.current.getBoundingClientRect();
        const categoryRect = categoryRef.getBoundingClientRect();
        const scrollTop = scrollContainerRef.current.scrollTop;
        const targetScroll = scrollTop + categoryRect.top - containerRect.top;
        
        scrollContainerRef.current.scrollTo({ 
          top: targetScroll, 
          behavior: 'smooth' 
        });
      }
    }
  }, []);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const scrollTop = scrollContainerRef.current.scrollTop;
    
    if (scrollTop < 50 && recentEmojis.length > 0) {
      if (activeCategory !== 'Recent') {
        setActiveCategory('Recent');
      }
      return;
    }

    let maxVisibility = 0;
    let mostVisibleCategory = '';

    Object.entries(categoryRefs.current).forEach(([categoryName, ref]) => {
      if (!ref || categoryName === 'Recent') return;

      const rect = ref.getBoundingClientRect();
      const containerRect = scrollContainerRef.current!.getBoundingClientRect();
      
      const visibleTop = Math.max(rect.top, containerRect.top);
      const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibility = visibleHeight / rect.height;

      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        mostVisibleCategory = categoryName;
      }
    });

    if (mostVisibleCategory && mostVisibleCategory !== activeCategory) {
      setActiveCategory(mostVisibleCategory);
    }
  }, [activeCategory, recentEmojis.length]);

  // Memoized recent emoji objects
  const recentEmojiObjects: Emoji[] = useMemo(() => 
    recentEmojis.map(recent => ({
      emoji: recent.emoji,
      name: 'recently used',
      shortcode: ':recent:',
      category: 'Recent',
      keywords: ['recent']
    })), [recentEmojis]
  );

  // Show skeleton while loading
  if (loading) {
    return <EmojiSkeleton />;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-100 dark:bg-zinc-700 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-xl overflow-hidden">
      {/* Header with tabs */}
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Search bar */}
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Category slider - only show for emoji tab and when not searching */}
      {activeTab === 'emoji' && !searchTerm && (
        <CategorySlider 
          categories={emojiData}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
          recentEmojis={recentEmojis}
        />
      )}

      {/* Content area */}
      <div className="md:h-[14vw] overflow-hidden">
        {activeTab === 'emoji' ? (
          <div
            ref={scrollContainerRef}
            className="h-full overflow-y-auto"
            onScroll={handleScroll}
          >
            {/* Recent emojis section */}
            {!searchTerm && recentEmojis.length > 0 && (
              <div ref={el => { categoryRefs.current['Recent'] = el; }}>
                <CategoryLabel category="Recently Used" />
                <EmojiGrid 
                  emojis={recentEmojiObjects} 
                  onEmojiSelect={handleEmojiSelect}
                />
              </div>
            )}

            {/* Emoji categories */}
            {filteredEmojis.map((category: EmojiCategory) => (
              <div key={category.name} ref={el => { categoryRefs.current[category.name] = el; }}>
                <CategoryLabel category={category.name} />
                <EmojiGrid 
                  emojis={category.emojis} 
                  onEmojiSelect={handleEmojiSelect}
                  showCategory={!!searchTerm}
                />
              </div>
            ))}

            {/* No results state */}
            {searchTerm && filteredEmojis.length === 0 && (
              <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Smile className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No emojis found</p>
                  <p className="text-xs opacity-75 mt-1">Try a different search term</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* GIF tab content */
          <div className="h-full overflow-y-auto">
            <GIFGrid />
          </div>
        )}
      </div>

      {/* Mobile-friendly bottom indicator */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-zinc-800 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-center">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;