
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Send, Paperclip, Smile } from 'lucide-react';

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
  return (
    <div className={cn(
      "p-4 border-t",
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    )}>
      <form onSubmit={onSendMessage} className="flex items-end space-x-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("p-2", isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100")}
        >
          <Paperclip size={20} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite uma mensagem"
            className={cn(
              "rounded-full pr-12 py-3 border-0 focus:ring-2 focus:ring-blue-500",
              isDarkMode
                ? "bg-gray-700 text-white placeholder:text-gray-400"
                : "bg-gray-100 text-gray-900 placeholder:text-gray-500"
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
          >
            <Smile size={16} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
          </Button>
        </div>
        
        <Button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="rounded-full p-3 bg-blue-500 hover:bg-blue-600 text-white border-0"
        >
          {sending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Send size={16} />
          )}
        </Button>
      </form>
    </div>
  );
};
