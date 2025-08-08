import React from 'react';
import { Emoji } from './useEmojiData';

const EmojiGrid = React.memo<{
  emojis: Emoji[];
  onEmojiSelect: (emoji: Emoji) => void;
  showCategory?: boolean;
}>(({ emojis, onEmojiSelect, showCategory = false }) => {
  return (
    <div className="grid grid-cols-8 gap-1 p-2">
      {emojis.map((emoji, index) => (
        <button
          key={`${emoji.emoji}-${index}`}
          onClick={() => onEmojiSelect(emoji)}
          className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 dark:hover:bg-zinc-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 active:scale-95 hover:scale-110"
          title={`${emoji.name} ${emoji.shortcode}`}
        >
          {emoji.emoji}
        </button>
      ))}
    </div>
  );
});

export default EmojiGrid;