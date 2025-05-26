
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Phone, Video, MoreVertical } from 'lucide-react';
import { ChannelConversation } from '@/hooks/useChannelConversations';

interface ChatHeaderProps {
  isDarkMode: boolean;
  conversation: ChannelConversation;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ isDarkMode, conversation }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-4 border-b",
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-blue-500 text-white">
            {getInitials(conversation.contact_name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className={cn("font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
            {conversation.contact_name}
          </h3>
          <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            {conversation.contact_phone}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className={cn("p-2", isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100")}>
          <Phone size={16} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
        </Button>
        <Button variant="ghost" size="sm" className={cn("p-2", isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100")}>
          <Video size={16} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
        </Button>
        <Button variant="ghost" size="sm" className={cn("p-2", isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100")}>
          <MoreVertical size={16} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
        </Button>
      </div>
    </div>
  );
};
