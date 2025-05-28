
import React from 'react';
import { cn } from '@/lib/utils';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
import { ConversationsListHeader } from './ConversationsListHeader';
import { ConversationsListEmpty } from './ConversationsListEmpty';
import { ConversationItem } from './ConversationItem';

interface ConversationsListProps {
  channelId: string;
  activeConversation?: string | null;
  onConversationSelect: (conversationId: string) => void;
  isDarkMode: boolean;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({
  channelId,
  activeConversation,
  onConversationSelect,
  isDarkMode
}) => {
  const {
    conversations,
    loading,
    refreshing,
    refreshConversations,
    updateConversationStatus
  } = useChannelConversationsRefactored(channelId);
  
  const handleConversationClick = async (conversationId: string) => {
    onConversationSelect(conversationId);
    // Auto-marcar como lido quando abrir a conversa
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation && conversation.status === 'unread') {
      await updateConversationStatus(conversationId, 'in_progress');
    }
  };
  
  if (loading) {
    return (
      <div className={cn("h-full flex items-center justify-center", isDarkMode ? "bg-[#09090b]" : "bg-white")}>
        <div className={cn("animate-spin rounded-full h-6 w-6 border-b-2", isDarkMode ? "border-[#fafafa]" : "border-gray-900")}></div>
      </div>
    );
  }
  
  return (
    <div className={cn("h-full flex flex-col", isDarkMode ? "bg-[#09090b]" : "bg-white")}>
      <ConversationsListHeader
        isDarkMode={isDarkMode}
        refreshing={refreshing}
        onRefresh={refreshConversations}
      />

      {/* Lista de conversas */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <ConversationsListEmpty isDarkMode={isDarkMode} />
        ) : (
          conversations.map(conversation => (
            <ConversationItem
              key={`${channelId}-${conversation.id}`}
              conversation={conversation}
              channelId={channelId}
              isDarkMode={isDarkMode}
              isActive={activeConversation === conversation.id}
              onClick={() => handleConversationClick(conversation.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
