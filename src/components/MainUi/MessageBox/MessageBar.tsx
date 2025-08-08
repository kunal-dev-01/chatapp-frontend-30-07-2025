import { Plus, SendHorizonal, Smile } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useClickOutside } from "@/Redux/Hooks/ClickOutside";
import EmojiPicker from "@/components/EmojiPicker/EmojiPicker";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const openEmoji = useRef<HTMLButtonElement>(null);
  const closeEmoji = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: closeEmoji,
    onOutsideClick: () => setShowEmojiPicker(false),
    ignoreRefs: [openEmoji],
  })

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    // Focus back to textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";
      // Set height based on scrollHeight with max limit
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; // Max 5-6 lines
      textareaRef.current.style.height =
        Math.min(scrollHeight, maxHeight) + "px";
    }
  }, [message]);

  return (
    <div className="w-full absolute bottom-0 h-auto bg-transparent flex items-end justify-center px-4 md:px-6 py-3 ">
      <div className="w-full bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-lg relative flex items-end transition-all duration-200 ease-in-out min-h-[2.5rem] md:min-h-[3rem]">
        {/* Left Icons */}
        <div className="flex items-center pb-1.5 pl-3 space-x-1">
          <button className="p-1 hover:bg-white/20 dark:hover:bg-white/10 rounded-full transition-all duration-200 text-zinc-300 dark:text-zinc-500 cursor-pointer">
            <Plus size={25} />
          </button>

          <button ref={openEmoji} onClick={() => setShowEmojiPicker((prev) => !prev)} className="p-1 hover:bg-white/20 dark:hover:bg-white/10 rounded-full transition-all duration-200 text-zinc-200 dark:text-zinc-500 cursor-pointer">
            <Smile size={25} />
          </button>

          {showEmojiPicker && (
            <div ref={closeEmoji} className="absolute bottom-full left-0  z-50 rounded-lg shadow-lg p-2">
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            </div>
          )}

        </div>

        {/* Textarea Field */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send message..."
          className="flex-1 px-3 py-2 md:py-2.5 text-sm md:text-base text-zinc-300 dark:text-zinc-200 placeholder-zinc-500 dark:placeholder-zinc-400 bg-transparent outline-none border-none resize-none overflow-y-auto min-h-[1.5rem] max-h-[120px] leading-relaxed"
          style={{ height: "1.5rem" }}
          rows={1}
        />

        {/* Send Button */}
        <div className="pb-1 pr-3">
          <button className="px-2.5 py-1.5 rounded-full transition-all duration-200 text-zinc-300 dark:text-zinc-500 cursor-pointer hover:bg-gradient-to-l from-pink-500 to-purple-500">
            <SendHorizonal size={25} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBar;
