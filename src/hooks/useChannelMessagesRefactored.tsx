
import { useState, useEffect } from 'react';
import { ChannelService } from '@/services/ChannelService';
import { MessageProcessor } from '@/utils/MessageProcessor';
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

        const channelService = new ChannelService(channelId);
        const rawMessages = await channelService.fetchMessages();

        let messagesToProcess = rawMessages;
        
        if (conversationId) {
          messagesToProcess = rawMessages.filter(row => {
            const phone = extractPhoneFromSessionId(row.session_id);
            return phone === conversationId;
          });
          console.log(`📱 Filtered ${messagesToProcess.length} messages for ${conversationId}`);
        }

        const processedMessages = MessageProcessor.processMessages(messagesToProcess);
        console.log(`✅ Processed ${processedMessages.length} messages from ${channelService.getTableName()}`);
        
        setMessages(processedMessages);
      } catch (err) {
        console.error(`❌ Error loading messages for channel ${channelId}:`, err);
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
      .createRealtimeChannel(`-${conversationId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: channelService.getTableName(),
        },
        (payload) => {
          console.log(`🔴 New message via realtime:`, payload);
          
          if (conversationId) {
            const messagePhone = extractPhoneFromSessionId(payload.new.session_id);
            if (messagePhone !== conversationId) {
              console.log('⏭️ Message ignored - different phone');
              return;
            }
          }
          
          const newMessage = MessageProcessor.processMessage(payload.new);
          if (newMessage) {
            console.log(`✅ Adding new message:`, newMessage);
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [channelId, conversationId]);

  return {
    messages,
    loading,
    error
  };
};
