
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MoreVertical } from 'lucide-react';
import { ChannelConversation } from '@/hooks/useChannelConversations';
import { useAuditLogger } from '@/hooks/useAuditLogger';

interface ChatHeaderProps {
  isDarkMode: boolean;
  conversation: ChannelConversation;
  channelId?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ isDarkMode, conversation, channelId }) => {
  const { logChannelAction } = useAuditLogger();
  
  console.log(`🎯 [CHAT_HEADER] Rendering for channel: ${channelId}, conversation: ${conversation.contact_name}`);

  const handleMoreOptions = () => {
    logChannelAction('chat_header_options_clicked', channelId, {
      conversation_id: conversation.id,
      contact_name: conversation.contact_name
    });
  };

  // Determinar nome de exibição baseado no canal - usar o nome da conversa diretamente
  const displayName = conversation.contact_name || conversation.contact_phone;

  return (
    <div className={cn(
      "flex items-center justify-between p-4 border-b",
      isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center flex-1 min-w-0">
        <div className="flex flex-col min-w-0">
          <h3 className={cn("font-semibold text-lg truncate", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
            {displayName}
          </h3>
          <p className={cn("text-sm truncate", isDarkMode ? "text-zinc-500" : "text-gray-500")}>
            {conversation.contact_phone}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleMoreOptions}
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
