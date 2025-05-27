
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { parseMessageData } from '@/utils/messageParser';
import { extractNameFromSessionId, extractPhoneFromSessionId } from '@/utils/sessionIdParser';
import { getTableNameForChannel } from '@/utils/channelMapping';

export interface ChannelMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: 'customer' | 'agent';
  contactName: string;
  contactPhone: string;
  messageType: string;
}

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
        
        console.log('🔍 CARREGANDO MENSAGENS DA TABELA ESPECÍFICA:', tableName);
        console.log('📱 Canal:', channelId);
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

        console.log(`🎯 DADOS ENCONTRADOS NA TABELA ${tableName}:`, allData?.length || 0);
        
        if (!allData || allData.length === 0) {
          console.log(`⚠️ Nenhum dado encontrado na tabela ${tableName}`);
          setMessages([]);
          return;
        }

        // Log detalhado dos dados por tabela
        console.log(`📋 MENSAGENS DA TABELA ${tableName} POR ID:`);
        allData.forEach(row => {
          console.log(`ID ${row.id}: ${JSON.stringify(row.message).substring(0, 100)}...`);
        });

        let messagesToProcess = allData;
        
        if (conversationId) {
          messagesToProcess = allData.filter(row => {
            const phone = extractPhoneFromSessionId(row.session_id);
            return phone === conversationId;
          });
          console.log(`📱 Mensagens filtradas para ${conversationId} na tabela ${tableName}:`, messagesToProcess.length);
        }

        const processedMessages: ChannelMessage[] = [];
        
        for (const row of messagesToProcess) {
          const messageData = parseMessageData(row.message);
          
          if (!messageData) {
            console.log(`⚠️ Falha ao processar mensagem ID ${row.id} da tabela ${tableName}`);
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
          
          console.log(`✅ MENSAGEM PROCESSADA ID ${row.id} DA TABELA ${tableName}:`, {
            sender: processedMessage.sender,
            content: processedMessage.content.substring(0, 30) + '...'
          });
        }

        console.log(`🎯 TOTAL DE MENSAGENS PROCESSADAS DA TABELA ${tableName}:`, processedMessages.length);
        setMessages(processedMessages);
        
      } catch (error) {
        console.error('❌ Erro geral ao carregar mensagens:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllMessages();

    // Configurar subscription para novas mensagens na tabela específica do canal
    const tableName = getTableNameForChannel(channelId);
    const channel = supabase
      .channel(`realtime-messages-${channelId}-${conversationId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          console.log(`🔴 Nova mensagem via realtime na tabela ${tableName}:`, payload);
          
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

          console.log(`✅ Adicionando nova mensagem da tabela ${tableName}:`, newMessage);
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
