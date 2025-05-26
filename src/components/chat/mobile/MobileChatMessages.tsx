
import React from 'react';
import { cn } from '@/lib/utils';
import { MessageHistory } from '@/components/chat/MessageHistory';

interface MobileChatMessagesProps {
  isDarkMode: boolean;
  channelId?: string;
  conversationId?: string;
}

export const MobileChatMessages: React.FC<MobileChatMessagesProps> = ({
  isDarkMode,
  channelId,
  conversationId
}) => {
  return (
    <div 
      className={cn(
        "absolute inset-0 overflow-y-auto chat-messages",
        isDarkMode ? "bg-zinc-950" : "bg-gray-50"
      )}
      style={{
        paddingBottom: "100px"
      }}
    >
      {channelId && conversationId ? (
        <MessageHistory
          channelId={channelId}
          conversationId={conversationId}
          isDarkMode={isDarkMode}
          className="h-full"
        />
      ) : (
        <div className="p-4 space-y-4">
          <div className="text-center">
            <span className={cn(
              "text-xs px-3 py-1 rounded-full",
              isDarkMode ? "bg-zinc-800 text-zinc-500" : "bg-gray-200 text-gray-600"
            )}>
              Selecione uma conversa para ver as mensagens
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
