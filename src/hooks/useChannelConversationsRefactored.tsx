
import { useState, useEffect, useCallback } from 'react';
import { ConversationService } from '@/services/ConversationService';
import { useConversationRealtime } from './useConversationRealtime';
import { useSmartRefresh } from './useSmartRefresh';
import { ChannelConversation } from './useChannelConversations';

export const useChannelConversationsRefactored = (channelId: string) => {
  const [conversations, setConversations] = useState<ChannelConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  const loadConversations = useCallback(async () => {
    if (!channelId) {
      console.log('❌ No channelId provided');
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      console.log(`🔄 [HOOK] Loading conversations for channel: ${channelId}`);
      
      const conversationService = new ConversationService(channelId);
      const loadedConversations = await conversationService.loadConversations();
      
      console.log(`✅ [HOOK] Loaded ${loadedConversations.length} conversations for ${channelId}`);
      setConversations(loadedConversations);
    } catch (error) {
      console.error(`❌ [HOOK] Error loading conversations for ${channelId}:`, error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  const refreshConversations = useCallback(async () => {
    if (!channelId) return;
    
    console.log(`🔄 [HOOK] Manual refresh for channel: ${channelId}`);
    setRefreshing(true);
    
    try {
      const conversationService = new ConversationService(channelId);
      const loadedConversations = await conversationService.loadConversations();
      setConversations(loadedConversations);
    } catch (error) {
      console.error(`❌ [HOOK] Error refreshing conversations:`, error);
    } finally {
      setRefreshing(false);
    }
  }, [channelId]);

  const updateConversationStatus = useCallback(async (
    conversationId: string, 
    status: 'unread' | 'in_progress' | 'resolved'
  ) => {
    if (!channelId) return;

    try {
      console.log(`🔄 [HOOK] Updating conversation ${conversationId} status to ${status}`);
      
      const conversationService = new ConversationService(channelId);
      await conversationService.updateConversationStatus(conversationId, status);
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, status, unread_count: status === 'unread' ? conv.unread_count : 0 }
            : conv
        )
      );
      
      console.log(`✅ [HOOK] Conversation status updated successfully`);
    } catch (error) {
      console.error(`❌ [HOOK] Error updating conversation status:`, error);
    }
  }, [channelId]);

  // Initial load
  useEffect(() => {
    console.log(`🚀 [HOOK] useChannelConversationsRefactored initialized for channel: ${channelId}`);
    loadConversations();
  }, [loadConversations]);

  // Setup realtime subscription
  useConversationRealtime({
    channelId,
    onNewMessage: loadConversations
  });

  // Setup smart auto-refresh with exponential backoff
  useSmartRefresh({
    enabled: autoRefreshEnabled,
    channelId,
    onRefresh: loadConversations,
    baseInterval: 60000, // 1 minute
    maxInterval: 300000, // 5 minutes max
    backoffMultiplier: 1.5
  });

  return {
    conversations,
    loading,
    refreshing,
    refreshConversations,
    updateConversationStatus,
    autoRefreshEnabled,
    setAutoRefreshEnabled
  };
};
