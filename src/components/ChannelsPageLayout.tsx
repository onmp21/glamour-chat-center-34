import React, { useState, useEffect, useCallback } from 'react';
import { ConversationItem } from './chat/ConversationItem';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
// Importações necessárias que estavam no hook
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { ChannelService } from '@/services/ChannelService';
import { MessageProcessor } from '@/utils/MessageProcessor';
import { ChannelConversation } from '@/hooks/useChannelConversations'; // Reutilizar a interface

// Interface para conversa unificada (antes estava no hook)
interface UnifiedConversation extends ChannelConversation {
  channelId: string;
}

interface ChannelsPageLayoutProps {
  isDarkMode: boolean;
  onNavigateToChat: (channelId: string, conversationId: string) => void;
}

export const ChannelsPageLayout: React.FC<ChannelsPageLayoutProps> = ({
  isDarkMode,
  onNavigateToChat
}) => {
  // Lógica do hook movida para cá
  const { channels } = useChannels();
  const { getAccessibleChannels } = usePermissions();
  const [conversations, setConversations] = useState<UnifiedConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('🔄 [ChannelsPageLayout] Loading conversations for all accessible channels...');

    try {
      const accessibleChannelIds = getAccessibleChannels();
      console.log(`🔑 [ChannelsPageLayout] Accessible channel IDs: ${accessibleChannelIds.join(', ')}`);

      if (accessibleChannelIds.length === 0) {
        console.log('🚫 [ChannelsPageLayout] No accessible channels found.');
        setConversations([]);
        setLoading(false);
        return;
      }

      const allConversationsPromises = accessibleChannelIds.map(async (channelId) => {
        try {
          const channelService = new ChannelService(channelId);
          const rawMessages = await channelService.fetchMessages();
          console.log(`📨 [ChannelsPageLayout] Fetched ${rawMessages.length} raw messages for channel ${channelId}`);
          const grouped = MessageProcessor.groupMessagesByPhone(rawMessages, channelId);
          return grouped.map(conv => ({ ...conv, channelId }));
        } catch (channelError) {
          console.error(`❌ [ChannelsPageLayout] Error loading conversations for channel ${channelId}:`, channelError);
          return [];
        }
      });

      const results = await Promise.all(allConversationsPromises);
      const flattenedConversations = results.flat();
      console.log(`📊 [ChannelsPageLayout] Total conversations fetched across all channels: ${flattenedConversations.length}`);

      const sortedConversations = flattenedConversations.sort((a, b) => {
        const timeA = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
        const timeB = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
        return timeB - timeA;
      });

      console.log(`✅ [ChannelsPageLayout] Successfully loaded and sorted ${sortedConversations.length} conversations.`);
      setConversations(sortedConversations);

    } catch (err) {
      console.error('❌ [ChannelsPageLayout] General error loading all conversations:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [getAccessibleChannels]);

  useEffect(() => {
    loadAllConversations();
  }, [loadAllConversations]);
  // Fim da lógica movida do hook

  const handleConversationClick = (channelId: string, conversationId: string) => {
    console.log(`Unified list item clicked: Channel ${channelId}, Conversation ${conversationId}. Navigating...`);
    onNavigateToChat(channelId, conversationId);
  };

  return (
    <div className={cn(
      "flex h-full flex-col",
      isDarkMode ? "bg-[#09090b]" : "bg-white"
    )}>
      {/* Título da Seção */}
      <div className={cn(
        "p-4 border-b",
        isDarkMode ? "border-[#3f3f46]" : "border-gray-200"
      )}>
        <h2 className={cn("text-xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
          Conversas Recentes (Todos os Canais)
        </h2>
        <p className={cn("text-sm mt-1", isDarkMode ? "text-gray-400" : "text-gray-600")}>
          Veja as últimas interações de todos os seus canais.
        </p>
      </div>

      {/* Lista Unificada de Conversas */}
      <div className="flex-1 overflow-hidden"> {/* Container para ScrollArea */}
        <ScrollArea className="h-full"> {/* Adicionar ScrollArea */}
          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className={cn("animate-spin rounded-full h-6 w-6 border-b-2", isDarkMode ? "border-[#fafafa]" : "border-gray-900")}></div>
              <span className={cn("ml-2", isDarkMode ? "text-[#a1a1aa]" : "text-gray-600")}>Carregando conversas...</span>
            </div>
          )}
          {!loading && error && (
            <div className="flex items-center justify-center p-8 text-red-500">
              Erro ao carregar conversas: {error}
            </div>
          )}
          {!loading && !error && conversations.length === 0 && (
            <div className="flex items-center justify-center p-8">
              <p className={cn("text-center", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                Nenhuma conversa recente encontrada em seus canais.
              </p>
            </div>
          )}
          {!loading && !error && conversations.length > 0 && (
            <div className="space-y-1 p-2"> {/* Padding para os itens */}
              {conversations.map(conversation => (
                <ConversationItem
                  key={`${conversation.channelId}-${conversation.id}`}
                  conversation={conversation}
                  channelId={conversation.channelId}
                  isDarkMode={isDarkMode}
                  isActive={false}
                  onClick={() => handleConversationClick(conversation.channelId, conversation.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

