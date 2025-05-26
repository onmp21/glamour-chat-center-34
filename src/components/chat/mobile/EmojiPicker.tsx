
import React from 'react';
import { cn } from '@/lib/utils';

interface EmojiPickerProps {
  isDarkMode: boolean;
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  isDarkMode,
  onEmojiSelect,
  onClose
}) => {
  const emojiCategories = [
    {
      name: 'Rostos',
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳']
    },
    {
      name: 'Gestos',
      emojis: ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👏', '🙌', '👐', '🤲', '🤝', '🙏']
    },
    {
      name: 'Objetos',
      emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️']
    }
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />
      
      {/* Emoji Picker */}
      <div className={cn(
        "absolute bottom-full left-0 right-0 mb-2 mx-3 rounded-xl border shadow-xl z-50 max-h-64 overflow-y-auto",
        isDarkMode ? "bg-zinc-900 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <div className="p-4">
          {emojiCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-4 last:mb-0">
              <h4 className={cn(
                "text-xs font-medium mb-3 uppercase tracking-wide",
                isDarkMode ? "text-zinc-400" : "text-gray-500"
              )}>
                {category.name}
              </h4>
              <div className="grid grid-cols-8 gap-1">
                {category.emojis.map((emoji, emojiIndex) => (
                  <button
                    key={emojiIndex}
                    onClick={() => onEmojiSelect(emoji)}
                    className={cn(
                      "w-9 h-9 flex items-center justify-center rounded-lg text-lg hover:scale-110 transition-all duration-200",
                      isDarkMode ? "hover:bg-zinc-800" : "hover:bg-gray-100"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
