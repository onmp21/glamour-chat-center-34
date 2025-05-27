
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MoreVertical } from 'lucide-react';
import { ChannelConversation } from '@/hooks/useChannelConversations';

interface ChatHeaderProps {
  isDarkMode: boolean;
  conversation: ChannelConversation;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ isDarkMode, conversation }) => {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 border-b chat-header-height",
      isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center space-x-3">
        <div>
          <h3 className={cn("font-semibold text-lg", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
            {conversation.contact_name}
          </h3>
          <p className={cn("text-sm", isDarkMode ? "text-zinc-500" : "text-gray-500")}>
            {conversation.contact_phone}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "rounded-full",
            isDarkMode ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300" : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
          )}
        >
          <MoreVertical size={18} />
        </Button>
      </div>
    </div>
  );
};
