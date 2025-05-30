
import { useState, useEffect } from 'react';
import { MessageService } from '@/services/MessageService';
import { ChannelMessage } from './useChannelMessages';

export const useChannelMessagesRefactored = (channelId: string, conversationId?: string) => {
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!channelId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const loadMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        const messageService = new MessageService(channelId);
        
        let loadedMessages: ChannelMessage[];
        if (conversationId) {
          loadedMessages = await messageService.getMessagesByConversation(conversationId);
        } else {
          loadedMessages = await messageService.getAllMessages();
        }

        // Ordenar mensagens por timestamp
        const sortedMessages = loadedMessages.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        setMessages(sortedMessages);
      } catch (err) {
        console.error(`❌ [MESSAGES_HOOK_V2] Error loading messages:`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Setup realtime subscription
    const messageService = new MessageService(channelId);
    const channel = messageService.createRealtimeSubscription((payload) => {
      console.log(`🔴 [MESSAGES_HOOK_V2] New message via realtime:`, payload);
      
      if (conversationId) {
        const messagePhone = messageService.extractPhoneFromSessionId(payload.new.session_id);
        if (messagePhone !== conversationId) {
          return;
        }
      }
      
      // Recarregar mensagens quando nova mensagem chegar
      setTimeout(() => {
        loadMessages();
      }, 1000);
    }, conversationId);

    channel.subscribe();

    return () => {
      console.log(`🔌 [MESSAGES_HOOK_V2] Unsubscribing from channel ${channelId}`);
      channel.unsubscribe();
    };
  }, [channelId, conversationId]);

  return {
    messages,
    loading,
    error
  };
};
