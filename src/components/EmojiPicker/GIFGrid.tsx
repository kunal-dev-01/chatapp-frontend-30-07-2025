import React from "react";
import { useMemo } from "react";
import { Image } from "lucide-react";

const GIFGrid = React.memo(() => {
  const placeholderGifs = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: `gif-${i}`,
      thumbnail: `https://via.placeholder.com/150x150/10b981/ffffff?text=GIF+${i + 1}`,
      title: `GIF ${i + 1}`
    })), []
  );

  return (
    <div className="p-4">
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg mb-2 font-medium">GIF search coming soon!</p>
        <p className="text-sm">Integration ready for Tenor/Giphy API</p>
      </div>
      
      <div className="grid grid-cols-4 gap-3 opacity-30">
        {placeholderGifs.map((gif) => (
          <button
            key={gif.id}
            className="aspect-square bg-gray-200 dark:bg-zinc-600 rounded-xl overflow-hidden hover:opacity-80 transition-opacity"
            disabled
          >
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
              GIF
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});

export default GIFGrid;