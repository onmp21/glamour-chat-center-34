import React, { useState, useEffect, useCallback } from 'react';
import { ConversationItem } from './chat/ConversationItem';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { ChannelService } from '@/services/ChannelService';
import { MessageProcessor } from '@/utils/MessageProcessor';
import { ChannelConversation } from '@/hooks/useChannelConversations';

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
  const { channels } = useChannels();
  const { getAccessibleChannels } = usePermissions();
  const [conversations, setConversations] = useState<UnifiedConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllConversations = useCallback(async () => {
    console.log('🔄 [ChannelsPageLayout DEBUG] Starting loadAllConversations...');
    setLoading(true);
    setError(null);

    try {
      console.log('🔑 [ChannelsPageLayout DEBUG] Calling getAccessibleChannels...');
      const accessibleChannelIds = getAccessibleChannels();
      console.log(`🔑 [ChannelsPageLayout DEBUG] Accessible channel IDs: ${accessibleChannelIds.join(', ')}`);

      if (accessibleChannelIds.length === 0) {
        console.log('🚫 [ChannelsPageLayout DEBUG] No accessible channels found. Setting loading to false.');
        setConversations([]);
        setLoading(false);
        return;
      }

      console.log('⏳ [ChannelsPageLayout DEBUG] Starting Promise mapping for each channel...');
      const allConversationsPromises = accessibleChannelIds.map(async (channelId) => {
        console.log(`  ➡️ [ChannelsPageLayout DEBUG] Processing channel: ${channelId}`);
        try {
          console.log(`    🛠️ [ChannelsPageLayout DEBUG] Creating ChannelService for ${channelId}...`);
          const channelService = new ChannelService(channelId);
          console.log(`    📡 [ChannelsPageLayout DEBUG] Fetching messages for ${channelId}...`);
          const rawMessages = await channelService.fetchMessages();
          console.log(`    📨 [ChannelsPageLayout DEBUG] Fetched ${rawMessages.length} raw messages for ${channelId}`);
          console.log(`    ⚙️ [ChannelsPageLayout DEBUG] Grouping messages for ${channelId}...`);
          const grouped = MessageProcessor.groupMessagesByPhone(rawMessages, channelId);
          console.log(`    ✅ [ChannelsPageLayout DEBUG] Grouped ${grouped.length} conversations for ${channelId}`);
          return grouped.map(conv => ({ ...conv, channelId }));
        } catch (channelError) {
          console.error(`❌ [ChannelsPageLayout DEBUG] Error loading conversations for channel ${channelId}:`, channelError);
          return []; // Return empty array on error for this specific channel
        }
      });

      console.log('⏳ [ChannelsPageLayout DEBUG] Waiting for all promises to resolve...');
      const results = await Promise.all(allConversationsPromises);
      console.log(`🏁 [ChannelsPageLayout DEBUG] All promises resolved. Results length: ${results.length}`);
      const flattenedConversations = results.flat();
      console.log(`📊 [ChannelsPageLayout DEBUG] Total conversations fetched across all channels: ${flattenedConversations.length}`);

      console.log('🔄 [ChannelsPageLayout DEBUG] Sorting conversations...');
      const sortedConversations = flattenedConversations.sort((a, b) => {
        const timeA = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
        const timeB = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
        return timeB - timeA;
      });
      console.log(`✅ [ChannelsPageLayout DEBUG] Successfully loaded and sorted ${sortedConversations.length} conversations.`);
      setConversations(sortedConversations);

    } catch (err) {
      console.error('❌ [ChannelsPageLayout DEBUG] General error in loadAllConversations:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setConversations([]);
    } finally {
      console.log('🔚 [ChannelsPageLayout DEBUG] Setting loading to false in finally block.');
      setLoading(false);
    }
  }, [getAccessibleChannels]);

  useEffect(() => {
    console.log('🚀 [ChannelsPageLayout DEBUG] useEffect triggered. Calling loadAllConversations.');
    loadAllConversations();
  }, [loadAllConversations]);

  const handleConversationClick = (channelId: string, conversationId: string) => {
    console.log(`🖱️ [ChannelsPageLayout DEBUG] Unified list item clicked: Channel ${channelId}, Conversation ${conversationId}. Navigating...`);
    onNavigateToChat(channelId, conversationId);
  };

  console.log(`🎨 [ChannelsPageLayout DEBUG] Rendering component. Loading: ${loading}, Error: ${error}, Conversations: ${conversations.length}`);

  return (
    <div className={cn(
      "flex h-full flex-col",
      isDarkMode ? "bg-[#09090b]" : "bg-white"
    )}>
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

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
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
            <div className="space-y-1 p-2">
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

