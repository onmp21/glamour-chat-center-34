
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ChannelMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: 'customer' | 'agent';
  contactName: string;
  contactPhone: string;
}

type TableName = 
  | 'yelena_ai_conversas'
  | 'canarana_conversas'
  | 'souto_soares_conversas'
  | 'joao_dourado_conversas'
  | 'america_dourada_conversas'
  | 'gerente_lojas_conversas'
  | 'gerente_externo_conversas'
  | 'pedro_conversas';

const getTableNameForChannel = (channelId: string): TableName => {
  const channelToTableMap: Record<string, TableName> = {
    'af1e5797-edc6-4ba3-a57a-25cf7297c4d6': 'yelena_ai_conversas',
    '011b69ba-cf25-4f63-af2e-4ad0260d9516': 'canarana_conversas',
    'b7996f75-41a7-4725-8229-564f31868027': 'souto_soares_conversas',
    '621abb21-60b2-4ff2-a0a6-172a94b4b65c': 'joao_dourado_conversas',
    '64d8acad-c645-4544-a1e6-2f0825fae00b': 'america_dourada_conversas',
    'd8087e7b-5b06-4e26-aa05-6fc51fd4cdce': 'gerente_lojas_conversas',
    'd2892900-ca8f-4b08-a73f-6b7aa5866ff7': 'gerente_externo_conversas',
    '1e233898-5235-40d7-bf9c-55d46e4c16a1': 'pedro_conversas',
  };
  
  const nameToTableMap: Record<string, TableName> = {
    'chat': 'yelena_ai_conversas',
    'canarana': 'canarana_conversas',
    'souto-soares': 'souto_soares_conversas',
    'joao-dourado': 'joao_dourado_conversas',
    'america-dourada': 'america_dourada_conversas',
    'gerente-lojas': 'gerente_lojas_conversas',
    'gerente-externo': 'gerente_externo_conversas',
    'pedro': 'pedro_conversas'
  };
  
  return channelToTableMap[channelId] || nameToTableMap[channelId] || 'yelena_ai_conversas';
};

// Função para extrair telefone do session_id
const extractPhoneFromSessionId = (sessionId: string) => {
  const phoneMatch = sessionId.match(/(\d{10,15})/);
  return phoneMatch ? phoneMatch[1] : sessionId.split(/[-_]/)[0];
};

// Função para extrair nome do session_id
const extractNameFromSessionId = (sessionId: string) => {
  const nameMatch = sessionId.replace(/\d+/g, '').replace(/[-_]/g, ' ').trim();
  return nameMatch || 'Cliente';
};

// Função para extrair dados da mensagem JSON e determinar o remetente
const parseMessageData = (message: any) => {
  if (!message) return null;
  
  if (typeof message === 'string') {
    try {
      message = JSON.parse(message);
    } catch {
      return null;
    }
  }
  
  // Determinar o remetente baseado no tipo da mensagem
  const sender = message.type === 'human' ? 'customer' : 'agent';
  
  return {
    content: message.content || message.text || message.message || '',
    timestamp: message.timestamp || message.created_at || new Date().toISOString(),
    sender
  };
};

export const useChannelMessages = (channelId: string, conversationId?: string) => {
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      if (!channelId || !conversationId) {
        setMessages([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const tableName = getTableNameForChannel(channelId);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error('Erro ao carregar mensagens:', error);
          setMessages([]);
          return;
        }

        // Filtrar mensagens pelo telefone (conversationId)
        const filteredMessages = (data || [])
          .filter(row => {
            const phone = extractPhoneFromSessionId(row.session_id);
            return phone === conversationId;
          })
          .map(row => {
            const messageData = parseMessageData(row.message);
            if (!messageData) return null;

            const contactName = extractNameFromSessionId(row.session_id);
            const contactPhone = extractPhoneFromSessionId(row.session_id);

            return {
              id: row.id.toString(),
              content: messageData.content,
              timestamp: messageData.timestamp,
              sender: messageData.sender,
              contactName,
              contactPhone
            } as ChannelMessage;
          })
          .filter(Boolean) as ChannelMessage[];

        console.log('Mensagens filtradas para:', conversationId, filteredMessages);
        setMessages(filteredMessages);
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('yelena-realtime-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'yelena_ai_conversas',
          filter: `session_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('New message received:', payload);
          const messageData = parseMessageData(payload.new.message);
          if (!messageData) return;

          const newMessage: ChannelMessage = {
            id: payload.new.id.toString(),
            content: messageData.content,
            timestamp: messageData.timestamp,
            sender: messageData.type === 'human' ? 'customer' : 'agent',
            contactName: extractNameFromSessionId(payload.new.session_id),
            contactPhone: extractPhoneFromSessionId(payload.new.session_id)
          };

          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, conversationId]);

  return {
    messages,
    loading
  };
};
