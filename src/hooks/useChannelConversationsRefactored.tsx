
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChannelService } from '@/services/ChannelService';
import { MessageProcessor } from '@/utils/MessageProcessor';
import { ChannelConversation } from './useChannelConversations';
import { supabase } from '@/integrations/supabase/client';
import { parseMessageData } from '@/utils/messageParser';

export const useChannelConversationsRefactored = (channelId?: string, autoRefresh = false) => {
  const [conversations, setConversations] = useState<ChannelConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadConversations = useCallback(async (showRefreshLoader = false) => {
    if (!channelId) {
      console.log('❌ No channelId provided');
      setLoading(false);
      setConversations([]);
      return;
    }
    
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const channelService = new ChannelService(channelId);
      const rawMessages = await channelService.fetchMessages();
      
      // Filtrar mensagens válidas usando o parser atualizado
      const validMessages = rawMessages.filter(message => {
        if (!message.message) return false;
        
        // Usar o parser para verificar se a mensagem é válida
        const parsedMessage = parseMessageData(message.message);
        if (!parsedMessage) {
          console.log('❌ Invalid message filtered out:', message.message);
          return false;
        }
        
        // Verificar se tem conteúdo válido
        return parsedMessage.content && parsedMessage.content.trim().length > 0;
      });
      
      console.log(`📊 Filtered ${validMessages.length} valid messages from ${rawMessages.length} total messages`);
      
      const groupedConversations = MessageProcessor.groupMessagesByPhone(validMessages);
      
      // Adicionar contagem de mensagens não lidas para cada conversa
      const conversationsWithUnreadCount = await Promise.all(
        groupedConversations.map(async (conversation) => {
          try {
            const { data: unreadCount } = await supabase
              .rpc('count_unread_messages', {
                table_name: channelService.getTableName(),
                p_session_id: conversation.contact_phone
              });

            return {
              ...conversation,
              unread_count: unreadCount || 0
            };
          } catch (error) {
            console.error('Error counting unread messages:', error);
            return {
              ...conversation,
              unread_count: 0
            };
          }
        })
      );
      
      console.log(`✅ Loaded ${conversationsWithUnreadCount.length} valid conversations from ${channelService.getTableName()}`);
      setConversations(conversationsWithUnreadCount);
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
      setRefreshing(false);
    }
  }, [channelId, toast]);

  const refreshConversations = useCallback(() => {
    loadConversations(true);
  }, [loadConversations]);

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
      
      // Marcar mensagens como lidas se o status for 'in_progress' ou 'resolved'
      if (status === 'in_progress' || status === 'resolved') {
        const channelService = new ChannelService(channelId);
        await supabase.rpc('mark_messages_as_read', {
          table_name: channelService.getTableName(),
          p_session_id: conversationId
        });
      }
      
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { 
              ...conv, 
              status, 
              updated_at: new Date().toISOString(),
              unread_count: status === 'in_progress' || status === 'resolved' ? 0 : (conv.unread_count || 0)
            } 
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
          
          // Verificar se a nova mensagem é válida antes de recarregar
          const parsedMessage = parseMessageData(payload.new.message);
          if (parsedMessage && parsedMessage.content.trim().length > 0) {
            console.log('✅ Valid new message, reloading conversations');
            await loadConversations();
          } else {
            console.log('⏭️ Invalid message ignored, not reloading');
          }
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
    refreshing,
    error,
    loadConversations,
    refreshConversations,
    updateConversationStatus
  };
};
