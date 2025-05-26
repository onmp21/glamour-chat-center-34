
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
      "flex items-center justify-between p-4 border-b bg-white",
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center space-x-3">
        <div>
          <h3 className={cn("font-semibold text-lg", isDarkMode ? "text-white" : "text-gray-900")}>
            {conversation.contact_name}
          </h3>
          <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            {conversation.contact_phone}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100")}
        >
          <MoreVertical size={18} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
        </Button>
      </div>
    </div>
  );
};
