
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Send, Paperclip, Smile } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';

interface MobileChatInputBarProps {
  isDarkMode: boolean;
  onSendMessage: (message: string) => void;
}

export const MobileChatInputBar: React.FC<MobileChatInputBarProps> = ({
  isDarkMode,
  onSendMessage
}) => {
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojis(false);
  };

  return (
    <>
      <div className={cn(
        "absolute bottom-0 left-0 right-0 p-3 border-t",
        isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "flex-shrink-0 rounded-full",
              isDarkMode ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300" : "text-gray-500 hover:bg-gray-100 hover:text-gray-600"
            )}
          >
            <Paperclip size={20} />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite uma mensagem..."
              className={cn(
                "pr-12 rounded-full border-0 focus:ring-1",
                isDarkMode 
                  ? "bg-zinc-800 text-zinc-100 placeholder-zinc-500 focus:ring-zinc-600" 
                  : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-gray-300"
              )}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEmojis(!showEmojis)}
                className={cn(
                  "w-8 h-8 rounded-full",
                  isDarkMode ? "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300" : "text-gray-500 hover:bg-gray-200 hover:text-gray-600"
                )}
              >
                <Smile size={16} />
              </Button>
            </div>
          </div>

          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            size="icon"
            className={cn(
              "flex-shrink-0 rounded-full transition-all duration-200",
              message.trim()
                ? "bg-[#b5103c] hover:bg-[#9d0e34] text-white shadow-md"
                : isDarkMode 
                  ? "bg-zinc-800 text-zinc-500" 
                  : "bg-gray-200 text-gray-400"
            )}
          >
            <Send size={18} />
          </Button>
        </div>

        {showEmojis && (
          <EmojiPicker
            isDarkMode={isDarkMode}
            onEmojiSelect={onEmojiSelect}
            onClose={() => setShowEmojis(false)}
          />
        )}
      </div>
    </>
  );
};
