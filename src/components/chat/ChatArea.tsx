
import React from 'react';
import { cn } from '@/lib/utils';
import { ChannelConversation } from '@/hooks/useChannelConversations';
import { MessageHistory } from './MessageHistory';
import { YelenaChatArea } from './YelenaChatArea';
import { useResponsive } from '@/hooks/useResponsive';

interface ChatAreaProps {
  isDarkMode: boolean;
  conversation: ChannelConversation;
  channelId: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ isDarkMode, conversation, channelId }) => {
  const { isMobile } = useResponsive();
  
  // Se for canal 'chat' (yelena) e não for mobile, usar layout dividido
  const shouldUseSplitLayout = channelId === 'chat' && !isMobile;

  return (
    <div className={cn(
      "flex-1 overflow-y-auto",
      isDarkMode ? "bg-zinc-950" : "bg-gray-50"
    )}>
      {shouldUseSplitLayout ? (
        <YelenaChatArea
          channelId={channelId}
          conversationId={conversation.id}
          isDarkMode={isDarkMode}
          className="h-full"
        />
      ) : (
        <MessageHistory
          channelId={channelId}
          conversationId={conversation.id}
          isDarkMode={isDarkMode}
          className="h-full"
        />
      )}
    </div>
  );
};
