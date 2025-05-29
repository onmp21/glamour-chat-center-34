import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
import { useConversationStatus } from '@/hooks/useConversationStatus';
import { useAuditLogger } from '@/hooks/useAuditLogger';
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
  initialConversationId?: string | null; // Adicionar prop
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ 
  isDarkMode, 
  channelId, 
  onToggleSidebar, 
  initialConversationId = null // Receber prop
}) => {
  const { 
    conversations, 
    loading: conversationsLoading, 
    refreshConversations 
  } = useChannelConversationsRefactored(channelId);
  
  const { updateConversationStatus, getConversationStatus } = useConversationStatus();
  const { logChannelAction, logConversationAction } = useAuditLogger();
  
  // Usar initialConversationId para definir o estado inicial
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConversationId);
  const [selectedChannelFromSection, setSelectedChannelFromSection] = useState<string | null>(channelId);
  const { toast } = useToast();

  // Log de acesso ao chat
  useEffect(() => {
    logChannelAction('chat_interface_accessed', channelId, {
      conversations_count: conversations.length,
      loading: conversationsLoading,
      initial_conversation: initialConversationId // Logar se veio com ID inicial
    });
  }, [channelId, initialConversationId]); // Adicionar initialConversationId à dependência

  // Resetar conversa selecionada quando mudar de canal
  useEffect(() => {
    console.log(`🔄 [WHATSAPP_CHAT] Channel changed to: ${channelId}, resetting selected conversation`);
    
    logChannelAction('channel_changed', channelId, {
      previous_channel: selectedChannelFromSection,
      previous_conversation: selectedConversationId
    });
    
    // Se o canal mudou, mas não veio com um ID inicial, limpa a seleção
    // Se veio com ID inicial, o useState já cuidou disso
    if (!initialConversationId) {
        setSelectedConversationId(null);
    }
    setSelectedChannelFromSection(channelId);

  }, [channelId, initialConversationId]); // Adicionar initialConversationId à dependência

  // Selecionar a conversa inicial se ela ainda não estiver selecionada e as conversas carregaram
  useEffect(() => {
    if (initialConversationId && !selectedConversationId && conversations.length > 0) {
      const exists = conversations.some(c => c.id === initialConversationId);
      if (exists) {
        console.log(`[WHATSAPP_CHAT] Selecting initial conversation ID: ${initialConversationId}`);
        setSelectedConversationId(initialConversationId);
        // Marcar como lido se necessário (lógica similar ao handleConversationSelect)
        const currentStatus = getConversationStatus(channelId, initialConversationId);
        if (currentStatus === 'unread') {
            updateConversationStatus(channelId, initialConversationId, 'in_progress');
            // Opcional: refresh para UI, mas pode causar re-renderização extra
            // setTimeout(() => refreshConversations(), 500);
        }
      }
    }
  }, [initialConversationId, selectedConversationId, conversations, channelId, getConversationStatus, updateConversationStatus]);

  // Determinar o ID do canal ativo
  const activeChannelId = selectedChannelFromSection || channelId;

  const handleConversationSelect = useCallback(async (conversationId: string) => {
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
  }, [conversations, updateConversationStatus, getConversationStatus, refreshConversations, activeChannelId]);

  const handleChannelSelect = (newChannelId: string) => {
    console.log(`🔄 [WHATSAPP_CHAT] Channel selected: ${newChannelId}`);
    
    logChannelAction('channel_selected_from_sidebar', newChannelId, {
      previous_channel: selectedChannelFromSection,
      source: 'channels_section'
    });
    
    setSelectedChannelFromSection(newChannelId);
    setSelectedConversationId(null); // Limpar ao selecionar canal manualmente
  };

  const selectedConv = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="flex h-screen w-full relative">      
      <div className={cn(
        "flex h-screen w-full border-0 overflow-hidden",
        isDarkMode ? "bg-zinc-950" : "bg-white"
      )}>
        {/* Seção de Canais - com scroll independente */}
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

        {/* Lista de Conversas - com scroll independente */}
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

        {/* Área Principal do Chat - com scroll independente */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {selectedConv ? (
            <ChatArea 
              key={selectedConversationId} // Manter key para forçar remount se necessário
              isDarkMode={isDarkMode} 
              conversation={selectedConv} 
              channelId={activeChannelId} 
            />
          ) : (
            // Mostrar loading se as conversas estiverem carregando e um ID inicial foi fornecido
            conversationsLoading && initialConversationId ? (
              <div className="flex items-center justify-center h-full">
                <div className={cn("animate-spin rounded-full h-6 w-6 border-b-2", isDarkMode ? "border-[#fafafa]" : "border-gray-900")}></div>
                <span className={cn("ml-2", isDarkMode ? "text-[#a1a1aa]" : "text-gray-600")}>Carregando conversa...</span>
              </div>
            ) : (
              <EmptyState isDarkMode={isDarkMode} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

