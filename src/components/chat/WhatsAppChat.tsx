import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
import { useConversationStatus } from '@/hooks/useConversationStatus';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { useToast } from '@/hooks/use-toast';
import { ConversationsList } from './ConversationsList';
import { ChatArea } from './ChatArea';
// import { ChatInput } from './ChatInput'; // REMOVIDO - Já está dentro de ChatArea
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
  const { logChannelAction, logConversationAction } = useAuditLogger();
  
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedChannelFromSection, setSelectedChannelFromSection] = useState<string | null>(channelId);
  const { toast } = useToast();

  // Log de acesso ao chat
  useEffect(() => {
    logChannelAction('chat_interface_accessed', channelId, {
      conversations_count: conversations.length,
      loading: conversationsLoading
    });
  }, [channelId]);

  // Resetar conversa selecionada quando mudar de canal
  useEffect(() => {
    console.log(`🔄 [WHATSAPP_CHAT] Channel changed to: ${channelId}, resetting selected conversation`);
    
    logChannelAction('channel_changed', channelId, {
      previous_channel: selectedChannelFromSection,
      previous_conversation: selectedConversationId
    });
    
    setSelectedConversationId(null);
    setSelectedChannelFromSection(channelId);
  }, [channelId]);

  const handleConversationSelect = useCallback(async (conversationId: string) => {
    const activeChannelId = selectedChannelFromSection || channelId; // Usar o canal ativo correto
    console.log(`📱 [WHATSAPP_CHAT] Selecting conversation: ${conversationId} in channel: ${activeChannelId}`);
    
    const conversation = conversations.find(c => c.id === conversationId);
    const currentStatus = getConversationStatus(activeChannelId, conversationId);
    
    logConversationAction('conversation_selected', conversationId, {
      channel_id: activeChannelId,
      contact_name: conversation?.contact_name,
      contact_phone: conversation?.contact_phone,
      previous_status: currentStatus,
      conversation_data: conversation
    });
    
    setSelectedConversationId(conversationId);
    
    // Auto-marcar como lido APENAS quando abrir a conversa no chat
    if (conversation && currentStatus === 'unread') {
      console.log(`📖 [WHATSAPP_CHAT] Auto-marking conversation ${conversationId} as in_progress`);
      
      logConversationAction('conversation_auto_marked_viewed', conversationId, {
        channel_id: activeChannelId,
        previous_status: 'unread',
        new_status: 'in_progress',
        auto_action: true
      });
      
      const success = await updateConversationStatus(activeChannelId, conversationId, 'in_progress');
      
      if (success) {
        // Refresh conversations to update UI after a short delay
        setTimeout(() => {
          refreshConversations();
        }, 500);
      }
    }
  }, [conversations, updateConversationStatus, getConversationStatus, refreshConversations, selectedChannelFromSection, channelId]); // Adicionar dependências

  const handleChannelSelect = (newChannelId: string) => {
    console.log(`🔄 [WHATSAPP_CHAT] Channel selected: ${newChannelId}`);
    
    logChannelAction('channel_selected_from_sidebar', newChannelId, {
      previous_channel: selectedChannelFromSection,
      source: 'channels_section'
    });
    
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
          "w-80 flex-shrink-0 border-r h-full flex flex-col",
          isDarkMode ? "border-zinc-800" : "border-gray-200"
        )}>
          <div className="h-full overflow-hidden">
            <ChannelsSection
              isDarkMode={isDarkMode}
              activeChannel={activeChannelId}
              onChannelSelect={handleChannelSelect}
            />
          </div>
        </div>

        {/* Lista de Conversas */}
        <div className={cn(
          "w-96 flex-shrink-0 border-r h-full flex flex-col",
          isDarkMode ? "border-zinc-800" : "border-gray-200"
        )}>
          <div className="h-full overflow-hidden">
            <ConversationsList
              channelId={activeChannelId}
              activeConversation={selectedConversationId}
              onConversationSelect={handleConversationSelect}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Área Principal do Chat */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {selectedConv ? (
            // --- CORREÇÃO: Renderizar apenas ChatArea, que já contém ChatInput --- 
            <ChatArea 
              isDarkMode={isDarkMode} 
              conversation={selectedConv} 
              channelId={activeChannelId} 
            />
            // --- FIM CORREÇÃO ---
          ) : (
            <EmptyState isDarkMode={isDarkMode} />
          )}
        </div>
      </div>
    </div>
  );
};

