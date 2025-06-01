
import React from 'react';
import { ArrowLeft, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { MoreOptionsDropdown } from './input/MoreOptionsDropdown';
import { ChannelConversation } from '@/hooks/useChannelConversations';

interface ChatHeaderProps {
  isDarkMode: boolean;
  conversation: ChannelConversation;
  channelId: string;
  onBack?: () => void;
  onStatusChange?: (status: 'unread' | 'in_progress' | 'resolved') => void;
  onRefresh?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  isDarkMode,
  conversation,
  channelId,
  onBack,
  onStatusChange,
  onRefresh
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-3 border-b",
      isDarkMode 
        ? "bg-zinc-900 border-zinc-800" 
        : "bg-white border-gray-200"
    )}>
      <div className="flex items-center space-x-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className={cn(
              "h-8 w-8 btn-animate",
              isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <ArrowLeft size={20} />
          </Button>
        )}
        
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-villa-primary text-white text-sm">
            {getInitials(conversation.contact_name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium truncate",
            isDarkMode ? "text-zinc-100" : "text-gray-900"
          )}>
            {conversation.contact_name}
          </h3>
          {conversation.contact_phone && (
            <p className={cn(
              "text-xs truncate",
              isDarkMode ? "text-zinc-400" : "text-gray-500"
            )}>
              {conversation.contact_phone}
            </p>
          )}
          <p className={cn(
            "text-xs",
            isDarkMode ? "text-zinc-500" : "text-gray-500"
          )}>
            {conversation.last_message_time ? `Última mensagem: ${new Date(conversation.last_message_time).toLocaleString()}` : 'Offline'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 btn-animate",
            isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <Phone size={18} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 btn-animate",
            isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <Video size={18} />
        </Button>
        
        <MoreOptionsDropdown
          isDarkMode={isDarkMode}
          conversationId={conversation.id}
          channelId={channelId}
          currentStatus={conversation.status}
          contactName={conversation.contact_name}
          contactPhone={conversation.contact_phone}
          lastActivity={conversation.last_message_time}
          onStatusChange={onStatusChange}
          onRefresh={onRefresh}
        />
      </div>
    </div>
  );
};
