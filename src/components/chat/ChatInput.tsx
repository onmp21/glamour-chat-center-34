
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import { EmojiDropdown } from './input/EmojiDropdown';
import { TagDropdown } from './input/TagDropdown';
import { FileUploadButton } from './input/FileUploadButton';
import { MoreOptionsDropdown } from './input/MoreOptionsDropdown';

interface ChatInputProps {
  isDarkMode: boolean;
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  sending: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  isDarkMode,
  newMessage,
  setNewMessage,
  onSendMessage,
  sending
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const addEmoji = (emoji: string) => {
    const input = inputRef.current;
    if (input) {
      const cursorPosition = input.selectionStart || 0;
      const textBefore = newMessage.substring(0, cursorPosition);
      const textAfter = newMessage.substring(cursorPosition);
      const newText = textBefore + emoji + textAfter;
      
      setNewMessage(newText);
      
      setTimeout(() => {
        if (input) {
          input.selectionStart = input.selectionEnd = cursorPosition + emoji.length;
          input.focus();
        }
      }, 10);
    }
  };

  const addTag = (tag: string) => {
    const input = inputRef.current;
    if (input) {
      const cursorPosition = input.selectionStart || 0;
      const textBefore = newMessage.substring(0, cursorPosition);
      const textAfter = newMessage.substring(cursorPosition);
      const newText = textBefore + tag + ' ' + textAfter;
      
      setNewMessage(newText);
      
      setTimeout(() => {
        if (input) {
          input.selectionStart = input.selectionEnd = cursorPosition + tag.length + 1;
          input.focus();
        }
      }, 10);
    }
  };

  return (
    <div className={cn(
      "p-4 border-t",
      isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
    )}>
      <form onSubmit={onSendMessage} className="flex items-center space-x-2">
        <EmojiDropdown 
          isDarkMode={isDarkMode}
          onEmojiSelect={addEmoji}
        />

        <TagDropdown 
          isDarkMode={isDarkMode}
          onTagSelect={addTag}
        />

        <Input
          ref={inputRef}
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSendMessage(e);
            }
          }}
          className={cn(
            "flex-1",
            isDarkMode 
              ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-red-500"
              : "bg-gray-50 border-gray-200 focus:border-red-500"
          )}
        />

        <FileUploadButton isDarkMode={isDarkMode} />

        <MoreOptionsDropdown isDarkMode={isDarkMode} />

        <Button 
          type="submit"
          disabled={!newMessage.trim() || sending}
          className={cn(
            "px-4 transition-all duration-200",
            !newMessage.trim() || sending
              ? isDarkMode 
                ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-white"
          )}
        >
          {sending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Send size={16} className="mr-2" />
          )}
          Enviar
        </Button>
      </form>
    </div>
  );
};
