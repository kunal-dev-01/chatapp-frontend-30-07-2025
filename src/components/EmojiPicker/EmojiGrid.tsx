import React from 'react';
import { Emoji } from './useEmojiData';

const EmojiGrid = React.memo<{
  emojis: Emoji[];
  onEmojiSelect: (emoji: Emoji) => void;
  showCategory?: boolean;
}>(({ emojis, onEmojiSelect }) => {
  return (
    <div className="grid grid-cols-8 gap-1 p-2">
      {emojis.map((emoji, index) => (
        <button
          key={`${emoji.emoji}-${index}`}
          onClick={() => onEmojiSelect(emoji)}
          className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 active:scale-95"
          title={`${emoji.name} ${emoji.shortcode}`}
        >
          {emoji.emoji}
        </button>
      ))}
    </div>
  );
});

export default EmojiGrid;