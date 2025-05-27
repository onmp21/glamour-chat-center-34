
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
import { useToast } from '@/hooks/use-toast';
import { ConversationsList } from './ConversationsList';
import { ChatHeader } from './ChatHeader';
import { ChatArea } from './ChatArea';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';

interface WhatsAppChatProps {
  isDarkMode: boolean;
  channelId: string;
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ isDarkMode, channelId }) => {
  const { 
    conversations, 
    loading: conversationsLoading, 
    updateConversationStatus, 
    refreshConversations 
  } = useChannelConversationsRefactored(channelId);
  
  // Estado separado por canal para evitar conflitos
  const [selectedConversations, setSelectedConversations] = useState<Record<string, string | null>>({});
  const { toast } = useToast();

  // Resetar conversa selecionada quando mudar de canal
  useEffect(() => {
    if (!selectedConversations[channelId]) {
      setSelectedConversations(prev => ({
        ...prev,
        [channelId]: null
      }));
    }
  }, [channelId, selectedConversations]);

  const selectedConversation = selectedConversations[channelId] || null;

  const handleConversationSelect = async (conversationId: string) => {
    // Definir conversa selecionada específica para este canal
    setSelectedConversations(prev => ({
      ...prev,
      [channelId]: conversationId
    }));
    
    // Auto-marcar como lido quando abrir a conversa
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation && conversation.status === 'unread') {
      await updateConversationStatus(conversationId, 'in_progress');
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className={cn(
      "flex h-screen w-full border-0 overflow-hidden",
      isDarkMode ? "bg-zinc-950" : "bg-white"
    )}>
      {/* Lista de Conversas */}
      <div className={cn(
        "w-80 flex-shrink-0 border-r",
        isDarkMode ? "border-zinc-800" : "border-gray-200"
      )}>
        <ConversationsList
          channelId={channelId}
          activeConversation={selectedConversation}
          onConversationSelect={handleConversationSelect}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Área Principal do Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConv ? (
          <>
            <ChatHeader isDarkMode={isDarkMode} conversation={selectedConv} />
            <ChatArea 
              isDarkMode={isDarkMode} 
              conversation={selectedConv} 
              channelId={channelId} 
            />
            <ChatInput
              channelId={channelId}
              conversationId={selectedConversation!}
              isDarkMode={isDarkMode}
              onMessageSent={refreshConversations}
            />
          </>
        ) : (
          <EmptyState isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  );
};
