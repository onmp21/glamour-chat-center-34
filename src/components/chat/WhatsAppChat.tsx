
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
import { useConversationStatus } from '@/hooks/useConversationStatus';
import { useToast } from '@/hooks/use-toast';
import { ConversationsList } from './ConversationsList';
import { ChatArea } from './ChatArea';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { ChannelsSection } from './ChannelsSection';

interface WhatsAppChatProps {
  isDarkMode: boolean;
  channelId: string;
  onToggleSidebar?: () => void;
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ 
  isDarkMode, 
  channelId, 
  onToggleSidebar 
}) => {
  const { 
    conversations, 
    loading: conversationsLoading, 
    refreshConversations 
  } = useChannelConversationsRefactored(channelId);
  
  const { updateConversationStatus, getConversationStatus } = useConversationStatus();
  
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedChannelFromSection, setSelectedChannelFromSection] = useState<string | null>(channelId);
  const { toast } = useToast();

  // Resetar conversa selecionada quando mudar de canal
  useEffect(() => {
    console.log(`🔄 Channel changed to: ${channelId}, resetting selected conversation`);
    setSelectedConversationId(null);
    setSelectedChannelFromSection(channelId);
  }, [channelId]);

  const handleConversationSelect = useCallback(async (conversationId: string) => {
    console.log(`📱 Selecting conversation: ${conversationId}`);
    setSelectedConversationId(conversationId);
    
    // Auto-marcar como lido APENAS quando abrir a conversa no chat
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      const currentStatus = getConversationStatus(activeChannelId, conversationId);
      
      if (currentStatus === 'unread') {
        console.log(`📖 Marking conversation ${conversationId} as in_progress (read)`);
        const success = await updateConversationStatus(activeChannelId, conversationId, 'in_progress');
        
        if (success) {
          // Refresh conversations to update UI
          setTimeout(() => {
            refreshConversations();
          }, 1000);
        }
      }
    }
  }, [conversations, updateConversationStatus, getConversationStatus, refreshConversations]);

  const handleChannelSelect = (newChannelId: string) => {
    setSelectedChannelFromSection(newChannelId);
    setSelectedConversationId(null);
  };

  const selectedConv = conversations.find(c => c.id === selectedConversationId);
  const activeChannelId = selectedChannelFromSection || channelId;

  return (
    <div className="flex h-screen w-full relative">      
      <div className={cn(
        "flex h-screen w-full border-0 overflow-hidden",
        isDarkMode ? "bg-zinc-950" : "bg-white"
      )}>
        {/* Seção de Canais */}
        <div className={cn(
          "w-80 flex-shrink-0 border-r",
          isDarkMode ? "border-zinc-800" : "border-gray-200"
        )}>
          <ChannelsSection
            isDarkMode={isDarkMode}
            activeChannel={activeChannelId}
            onChannelSelect={handleChannelSelect}
          />
        </div>

        {/* Lista de Conversas */}
        <div className={cn(
          "w-96 flex-shrink-0 border-r",
          isDarkMode ? "border-zinc-800" : "border-gray-200"
        )}>
          <ConversationsList
            channelId={activeChannelId}
            activeConversation={selectedConversationId}
            onConversationSelect={handleConversationSelect}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Área Principal do Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedConv ? (
            <>
              <ChatArea 
                isDarkMode={isDarkMode} 
                conversation={selectedConv} 
                channelId={activeChannelId} 
              />
              <ChatInput
                channelId={activeChannelId}
                conversationId={selectedConversationId!}
                isDarkMode={isDarkMode}
                onMessageSent={refreshConversations}
              />
            </>
          ) : (
            <EmptyState isDarkMode={isDarkMode} />
          )}
        </div>
      </div>
    </div>
  );
};
