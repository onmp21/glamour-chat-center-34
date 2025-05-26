
import { useState, useEffect } from 'react';
import { useChannelConversations } from '@/hooks/useChannelConversations';

export interface ChannelMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: 'customer' | 'agent';
  contactName: string;
  contactPhone: string;
}

export const useChannelMessages = (channelId: string, conversationId?: string) => {
  const { conversations, loading } = useChannelConversations(channelId);
  const [messages, setMessages] = useState<ChannelMessage[]>([]);

  useEffect(() => {
    if (!loading && conversations.length > 0) {
      // Se temos um conversationId específico, pegar apenas essa conversa
      const targetConversations = conversationId 
        ? conversations.filter(conv => conv.id === conversationId)
        : conversations;

      // Converter conversas em mensagens para exibição
      const channelMessages: ChannelMessage[] = targetConversations
        .filter(conv => conv.last_message)
        .map(conv => ({
          id: conv.id,
          content: conv.last_message || '',
          timestamp: conv.last_message_time || conv.updated_at,
          sender: 'customer' as const,
          contactName: conv.contact_name,
          contactPhone: conv.contact_phone
        }))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      setMessages(channelMessages);
    } else {
      setMessages([]);
    }
  }, [conversations, loading, conversationId]);

  return {
    messages,
    loading
  };
};
