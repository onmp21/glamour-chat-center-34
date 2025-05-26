
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useChannels } from '@/contexts/ChannelContext';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

interface MobileConversationsListProps {
  isDarkMode: boolean;
  mobileChannelId: string | null;
  onBack: () => void;
  onConversationSelect: (conversationId: string) => void;
}

export const MobileConversationsList: React.FC<MobileConversationsListProps> = ({
  isDarkMode,
  mobileChannelId,
  onBack,
  onConversationSelect
}) => {
  const { channels } = useChannels();
  const { getTabConversations } = useChat();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-red-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'unread':
        return 'Não lida';
      case 'in_progress':
        return 'Em andamento';
      case 'resolved':
        return 'Resolvida';
      default:
        return status;
    }
  };

  const mobileConversations = mobileChannelId ? getTabConversations(mobileChannelId) : [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center px-2 py-3 border-b gap-2"
           style={{ borderColor: isDarkMode ? "#2a2a2a" : "#ececec" }}>
        <Button size="icon" variant="ghost" className="mr-2" onClick={onBack}>
          <ArrowLeft size={22} />
        </Button>
        <span className={cn("text-base font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
          {mobileChannelId ? channels.find((c) => c.id === mobileChannelId)?.name : ''}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 pb-20">
        {mobileConversations.map(conversation => (
          <div
            key={conversation.id}
            onClick={() => onConversationSelect(conversation.id)}
            className={cn(
              "p-4 rounded-xl mb-3 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200",
              isDarkMode ? "bg-[#232323] text-white border border-[#2a2a2a]" : "bg-white text-gray-900 border border-gray-100"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-base">{conversation.contactName}</span>
              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs", getStatusColor(conversation.status))}>
                  {getStatusLabel(conversation.status)}
                </Badge>
                <span className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  {conversation.lastMessageTime}
                </span>
              </div>
            </div>
            <div className={cn("text-sm truncate", isDarkMode ? "text-gray-300" : "text-gray-600")}>
              {conversation.lastMessage}
            </div>
          </div>
        ))}
        {mobileConversations.length === 0 &&
          <div className="text-center text-gray-400 py-8">Nenhuma conversa neste canal.</div>}
      </div>
    </div>
  );
};
