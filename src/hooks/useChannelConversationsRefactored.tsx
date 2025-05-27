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
      
      console.log(`🔍 [CONVERSATIONS] Loading for channel: ${channelId}`);
      
      const channelService = new ChannelService(channelId);
      const rawMessages = await channelService.fetchMessages();
      
      console.log(`🔍 [CONVERSATIONS] Raw messages from DB:`, rawMessages.length);
      rawMessages.forEach((msg, index) => {
        console.log(`🔍 [CONVERSATIONS] Raw Message ${index + 1}:`, {
          id: msg.id,
          session_id: msg.session_id,
          message: msg.message
        });
      });
      
      // Filtrar mensagens válidas usando o parser atualizado
      const validMessages = rawMessages.filter(message => {
        if (!message.message) {
          console.log(`❌ [CONVERSATIONS] Message ${message.id} - No message field`);
          return false;
        }
        
        // Usar o parser para verificar se a mensagem é válida
        const parsedMessage = parseMessageData(message.message);
        if (!parsedMessage) {
          console.log(`❌ [CONVERSATIONS] Message ${message.id} - Parser returned null for:`, message.message);
          return false;
        }
        
        // Verificar se tem conteúdo válido
        const hasValidContent = parsedMessage.content && parsedMessage.content.trim().length > 0;
        if (!hasValidContent) {
          console.log(`❌ [CONVERSATIONS] Message ${message.id} - No valid content. Content was:`, JSON.stringify(parsedMessage.content));
          return false;
        }
        
        console.log(`✅ [CONVERSATIONS] Message ${message.id} - Valid! Content: "${parsedMessage.content}"`);
        return true;
      });
      
      console.log(`📊 [CONVERSATIONS] Filtered ${validMessages.length} valid messages from ${rawMessages.length} total messages`);
      
      if (validMessages.length === 0) {
        console.log(`⚠️ [CONVERSATIONS] NO VALID MESSAGES FOUND for channel ${channelId}`);
        setConversations([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      const groupedConversations = MessageProcessor.groupMessagesByPhone(validMessages);
      console.log(`📊 [CONVERSATIONS] Grouped into ${groupedConversations.length} conversations`);
      
      groupedConversations.forEach((conv, index) => {
        console.log(`📋 [CONVERSATIONS] Conversation ${index + 1}:`, {
          id: conv.id,
          contact_name: conv.contact_name,
          contact_phone: conv.contact_phone,
          last_message: conv.last_message
        });
      });
      
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
      
      console.log(`✅ [CONVERSATIONS] Final result: ${conversationsWithUnreadCount.length} conversations with unread counts`);
      setConversations(conversationsWithUnreadCount);
    } catch (err) {
      console.error(`❌ [CONVERSATIONS] Error loading conversations for channel ${channelId}:`, err);
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
