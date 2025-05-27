
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChannelService } from '@/services/ChannelService';
import { MessageProcessor } from '@/utils/MessageProcessor';
import { ChannelConversation } from './useChannelConversations';

export const useChannelConversationsRefactored = (channelId?: string, autoRefresh = false) => {
  const [conversations, setConversations] = useState<ChannelConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadConversations = useCallback(async () => {
    if (!channelId) {
      console.log('❌ No channelId provided');
      setLoading(false);
      setConversations([]);
      return;
    }
    
    try {
      setLoading(false); // Don't show loading on auto-refresh
      setError(null);
      
      const channelService = new ChannelService(channelId);
      const rawMessages = await channelService.fetchMessages();
      const groupedConversations = MessageProcessor.groupMessagesByPhone(rawMessages);
      
      console.log(`✅ Loaded ${groupedConversations.length} conversations from ${channelService.getTableName()}`);
      setConversations(groupedConversations);
    } catch (err) {
      console.error(`❌ Error loading conversations for channel ${channelId}:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setConversations([]);
      
      toast({
        title: "Erro",
        description: "Erro ao carregar conversas. Verifique sua conexão.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [channelId, toast]);

  const updateConversationStatus = useCallback(async (
    conversationId: string, 
    status: 'unread' | 'in_progress' | 'resolved'
  ) => {
    if (!channelId) {
      console.error('❌ No channelId provided for updateConversationStatus');
      return;
    }
    
    try {
      console.log(`🔄 Updating conversation ${conversationId} status to ${status}`);
      
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, status, updated_at: new Date().toISOString() } 
          : conv
      ));
      
      console.log('✅ Conversation status updated locally');
    } catch (err) {
      console.error('❌ Error updating conversation status:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da conversa",
        variant: "destructive"
      });
    }
  }, [channelId, toast]);

  useEffect(() => {
    loadConversations();

    if (!channelId) return;

    // Setup realtime subscription
    const channelService = new ChannelService(channelId);
    const channel = channelService
      .createRealtimeChannel()
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: channelService.getTableName(),
        },
        async (payload) => {
          console.log(`🔴 New conversation via realtime:`, payload);
          await loadConversations();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [channelId, loadConversations]);

  // Auto refresh setup
  useEffect(() => {
    if (!autoRefresh || !channelId) return;

    const interval = setInterval(() => {
      console.log(`🔄 Auto refresh - loading conversations for channel ${channelId}...`);
      loadConversations();
    }, 60000);

    return () => clearInterval(interval);
  }, [autoRefresh, channelId, loadConversations]);

  return {
    conversations,
    loading,
    error,
    loadConversations,
    updateConversationStatus
  };
};
