import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { parseMessageData } from '@/utils/messageParser';
import { extractNameFromSessionId, extractPhoneFromSessionId } from '@/utils/sessionIdParser';

export interface ChannelMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: 'customer' | 'agent';
  contactName: string;
  contactPhone: string;
  messageType: string;
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
  // SEMPRE buscar na tabela yelena_ai_conversas onde estão as mensagens reais do Pedro
  console.log('🔥 FORÇANDO BUSCA NA TABELA YELENA_AI_CONVERSAS - onde estão as mensagens reais!');
  return 'yelena_ai_conversas';
};

export const useChannelMessages = (channelId: string, conversationId?: string) => {
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllMessages = async () => {
      if (!channelId) {
        console.log('❌ Faltam parâmetros:', { channelId });
        setMessages([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const tableName = getTableNameForChannel(channelId);
        
        console.log('🔍 BUSCANDO MENSAGENS REAIS NA TABELA:', tableName);
        console.log('📞 Filtro de conversa (opcional):', conversationId);
        
        const { data: allData, error } = await supabase
          .from(tableName)
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error('❌ Erro ao buscar dados:', error);
          setMessages([]);
          return;
        }

        console.log('🎯 DADOS REAIS ENCONTRADOS:', allData?.length || 0);
        
        if (!allData || allData.length === 0) {
          console.log('⚠️ Nenhum dado encontrado na tabela');
          setMessages([]);
          return;
        }

        // Log detalhado dos dados reais
        console.log('📋 MENSAGENS REAIS POR ID:');
        allData.forEach(row => {
          console.log(`ID ${row.id}: ${JSON.stringify(row.message).substring(0, 100)}...`);
        });

        let messagesToProcess = allData;
        
        if (conversationId) {
          messagesToProcess = allData.filter(row => {
            const phone = extractPhoneFromSessionId(row.session_id);
            return phone === conversationId;
          });
          console.log(`📱 Mensagens filtradas para ${conversationId}:`, messagesToProcess.length);
        }

        const processedMessages: ChannelMessage[] = [];
        
        for (const row of messagesToProcess) {
          const messageData = parseMessageData(row.message);
          
          if (!messageData) {
            console.log('⚠️ Falha ao processar mensagem ID:', row.id);
            continue;
          }

          const contactName = extractNameFromSessionId(row.session_id);
          const contactPhone = extractPhoneFromSessionId(row.session_id);
          const sender = messageData.type === 'human' ? 'customer' : 'agent';

          const processedMessage: ChannelMessage = {
            id: row.id.toString(),
            content: messageData.content,
            timestamp: messageData.timestamp || new Date().toISOString(),
            sender,
            contactName,
            contactPhone,
            messageType: messageData.type
          };

          processedMessages.push(processedMessage);
          
          console.log(`✅ MENSAGEM REAL PROCESSADA ID ${row.id}:`, {
            sender: processedMessage.sender,
            content: processedMessage.content.substring(0, 30) + '...'
          });
        }

        console.log('🎯 TOTAL DE MENSAGENS REAIS PROCESSADAS:', processedMessages.length);
        setMessages(processedMessages);
        
      } catch (error) {
        console.error('❌ Erro geral ao carregar mensagens:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllMessages();

    // Configurar subscription para novas mensagens
    const channel = supabase
      .channel(`realtime-messages-${channelId}-${conversationId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: getTableNameForChannel(channelId),
        },
        (payload) => {
          console.log('🔴 Nova mensagem via realtime:', payload);
          
          // Se temos filtro de conversa, verificar se a mensagem é da conversa atual
          if (conversationId) {
            const messagePhone = extractPhoneFromSessionId(payload.new.session_id);
            if (messagePhone !== conversationId) {
              console.log('⏭️ Mensagem ignorada - telefone diferente');
              return;
            }
          }
          
          const messageData = parseMessageData(payload.new.message);
          if (!messageData) {
            console.log('⚠️ Falha ao processar nova mensagem');
            return;
          }

          const newMessage: ChannelMessage = {
            id: payload.new.id.toString(),
            content: messageData.content,
            timestamp: messageData.timestamp || new Date().toISOString(),
            sender: messageData.type === 'human' ? 'customer' : 'agent',
            contactName: extractNameFromSessionId(payload.new.session_id),
            contactPhone: extractPhoneFromSessionId(payload.new.session_id),
            messageType: messageData.type
          };

          console.log('✅ Adicionando nova mensagem:', newMessage);
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
