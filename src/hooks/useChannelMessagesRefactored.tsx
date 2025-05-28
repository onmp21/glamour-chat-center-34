
import { useState, useEffect } from 'react';
import { ChannelService } from '@/services/ChannelService';
import { MessageProcessor, RawMessage } from '@/utils/MessageProcessor';
import { ChannelMessage } from './useChannelMessages';
import { extractPhoneFromSessionId } from '@/utils/sessionIdParser';

export const useChannelMessagesRefactored = (channelId: string, conversationId?: string) => {
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      if (!channelId) {
        console.log('❌ No channelId provided');
        setMessages([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(`🔄 [MESSAGES_HOOK] Loading messages for channel: ${channelId}, conversation: ${conversationId}`);

        const channelService = new ChannelService(channelId);
        const rawMessages = await channelService.fetchMessages();

        console.log(`📨 [MESSAGES_HOOK] Fetched ${rawMessages.length} raw messages`);

        let messagesToProcess = rawMessages;
        
        if (conversationId) {
          messagesToProcess = rawMessages.filter(row => {
            const phone = extractPhoneFromSessionId(row.session_id);
            const matches = phone === conversationId;
            if (matches) {
              console.log(`✅ [MESSAGES_HOOK] Message ${row.id} matches conversation ${conversationId}`);
            }
            return matches;
          });
          console.log(`📱 [MESSAGES_HOOK] Filtered ${messagesToProcess.length} messages for conversation ${conversationId}`);
        }

        const processedMessages = MessageProcessor.processMessages(messagesToProcess, channelId);
        console.log(`✅ [MESSAGES_HOOK] Processed ${processedMessages.length} messages from ${channelService.getTableName()}`);
        
        // Ordenar mensagens por timestamp
        const sortedMessages = processedMessages.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        setMessages(sortedMessages);
      } catch (err) {
        console.error(`❌ [MESSAGES_HOOK] Error loading messages for channel ${channelId}:`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Setup realtime subscription
    const channelService = new ChannelService(channelId);
    const channel = channelService
      .createRealtimeChannel(`-messages-${conversationId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: channelService.getTableName(),
        },
        (payload) => {
          console.log(`🔴 [MESSAGES_HOOK] New message via realtime for ${channelId}:`, payload);
          
          if (conversationId) {
            const messagePhone = extractPhoneFromSessionId(payload.new.session_id);
            if (messagePhone !== conversationId) {
              console.log(`⏭️ [MESSAGES_HOOK] Message ignored - different phone (${messagePhone} vs ${conversationId})`);
              return;
            }
          }
          
          // Properly cast the payload to RawMessage type
          const rawMessage: RawMessage = {
            id: payload.new.id,
            session_id: payload.new.session_id,
            message: payload.new.message
          };
          
          const newMessage = MessageProcessor.processMessage(rawMessage, channelId);
          if (newMessage) {
            console.log(`✅ [MESSAGES_HOOK] Adding new message:`, newMessage);
            setMessages(prev => {
              // Evitar duplicatas
              const exists = prev.some(msg => msg.id === newMessage.id);
              if (exists) {
                console.log(`⚠️ [MESSAGES_HOOK] Message ${newMessage.id} already exists, skipping`);
                return prev;
              }
              const updated = [...prev, newMessage].sort((a, b) => 
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              );
              console.log(`📨 [MESSAGES_HOOK] Updated messages count: ${updated.length}`);
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log(`🔌 [MESSAGES_HOOK] Unsubscribing from channel ${channelId}`);
      channel.unsubscribe();
    };
  }, [channelId, conversationId]);

  return {
    messages,
    loading,
    error
  };
};
