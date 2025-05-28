
import React from 'react';
import { cn } from '@/lib/utils';
import { ChannelConversation } from '@/hooks/useChannelConversations';
import { MessageHistory } from './MessageHistory';

interface ChatAreaProps {
  isDarkMode: boolean;
  conversation: ChannelConversation;
  channelId: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ isDarkMode, conversation, channelId }) => {
  return (
    <div className={cn(
      "flex-1 overflow-y-auto",
      isDarkMode ? "bg-zinc-950" : "bg-gray-50"
    )}>
      <MessageHistory
        channelId={channelId}
        conversationId={conversation.id}
        isDarkMode={isDarkMode}
        className="h-full"
      />
    </div>
  );
};
