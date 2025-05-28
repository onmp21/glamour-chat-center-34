
import { useState, useEffect } from 'react';
import { ChannelService } from '@/services/ChannelService';
import { MessageProcessor } from '@/utils/MessageProcessor';
import { ChannelConversation } from './useChannelConversations';
import { useConversationStatus } from './useConversationStatus';

export const useChannelConversationsRefactored = (channelId: string) => {
  const [conversations, setConversations] = useState<ChannelConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { updateConversationStatus: updateStatus } = useConversationStatus();

  const loadConversations = async (isRefresh = false) => {
    if (!channelId) {
      console.log('❌ [CONVERSATIONS_HOOK] No channelId provided');
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log(`🔄 [CONVERSATIONS_HOOK] Loading conversations for channel: ${channelId}`);

      const channelService = new ChannelService(channelId);
      const rawMessages = await channelService.fetchMessages();

      console.log(`📨 [CONVERSATIONS_HOOK] Fetched ${rawMessages.length} raw messages`);

      const groupedConversations = MessageProcessor.groupMessagesByPhone(rawMessages, channelId);
      console.log(`📱 [CONVERSATIONS_HOOK] Grouped into ${groupedConversations.length} conversations`);

      setConversations(groupedConversations);
    } catch (err) {
      console.error(`❌ [CONVERSATIONS_HOOK] Error loading conversations for channel ${channelId}:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setConversations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshConversations = () => {
    console.log(`🔄 [CONVERSATIONS_HOOK] Manual refresh triggered for channel: ${channelId}`);
    loadConversations(true);
  };

  const updateConversationStatus = async (
    conversationId: string, 
    status: 'unread' | 'in_progress' | 'resolved'
  ) => {
    // Update local state immediately for better UX
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { 
            ...conv, 
            status, 
            updated_at: new Date().toISOString(),
            unread_count: status === 'in_progress' || status === 'resolved' ? 0 : conv.unread_count || 0
          } 
        : conv
    ));

    // Call the backend update
    await updateStatus(channelId, conversationId, status);
  };

  useEffect(() => {
    loadConversations();

    // Setup realtime subscription
    const channelService = new ChannelService(channelId);
    const channel = channelService
      .createRealtimeChannel('-conversations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: channelService.getTableName(),
        },
        (payload) => {
          console.log(`🔴 [CONVERSATIONS_HOOK] New message via realtime for ${channelId}:`, payload);
          // Refresh conversations when new message arrives
          setTimeout(() => {
            refreshConversations();
          }, 1000);
        }
      )
      .subscribe();

    return () => {
      console.log(`🔌 [CONVERSATIONS_HOOK] Unsubscribing from channel ${channelId}`);
      channel.unsubscribe();
    };
  }, [channelId]);

  return {
    conversations,
    loading,
    refreshing,
    error,
    refreshConversations,
    updateConversationStatus
  };
};
