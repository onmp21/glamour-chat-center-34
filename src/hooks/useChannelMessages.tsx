
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
        
        console.log('🔍 Buscando TODAS as mensagens da tabela:', tableName);
        console.log('📞 Filtro de conversa (opcional):', conversationId);
        
        // Buscar TODOS os registros da tabela ordenados por ID
        const { data: allData, error } = await supabase
          .from(tableName)
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error('❌ Erro ao buscar dados:', error);
          setMessages([]);
          return;
        }

        console.log('📊 TOTAL de registros na tabela:', allData?.length || 0);
        
        if (!allData || allData.length === 0) {
          console.log('⚠️ Nenhum dado encontrado na tabela');
          setMessages([]);
          return;
        }

        // Log de todos os session_ids únicos para debug
        const uniqueSessionIds = [...new Set(allData.map(row => row.session_id))];
        console.log('🔑 Session IDs únicos encontrados:', uniqueSessionIds);

        // Processar TODAS as mensagens ou filtrar por conversationId se fornecido
        let messagesToProcess = allData;
        
        if (conversationId) {
          messagesToProcess = allData.filter(row => {
            const phone = extractPhoneFromSessionId(row.session_id);
            const isMatch = phone === conversationId;
            
            if (isMatch) {
              console.log('✅ Mensagem da conversa encontrada:', {
                id: row.id,
                session_id: row.session_id,
                phone: phone,
                message_preview: JSON.stringify(row.message).substring(0, 100)
              });
            }
            
            return isMatch;
          });
          
          console.log(`📱 Mensagens filtradas para ${conversationId}:`, messagesToProcess.length);
        } else {
          console.log('📨 Processando TODAS as mensagens da tabela');
        }

        // Processar mensagens
        const processedMessages: ChannelMessage[] = [];
        
        for (const row of messagesToProcess) {
          const messageData = parseMessageData(row.message);
          
          if (!messageData) {
            console.log('⚠️ Falha ao processar mensagem ID:', row.id);
            continue;
          }

          const contactName = extractNameFromSessionId(row.session_id);
          const contactPhone = extractPhoneFromSessionId(row.session_id);
          
          // Determinar sender: 'human' = customer, 'ai' = agent
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
          
          console.log('✅ Mensagem processada:', {
            id: processedMessage.id,
            sender: processedMessage.sender,
            type: messageData.type,
            contactName: processedMessage.contactName,
            contactPhone: processedMessage.contactPhone,
            content: processedMessage.content.substring(0, 50) + '...'
          });
        }

        console.log('🎯 RESULTADO FINAL:');
        console.log(`📊 Total de mensagens processadas: ${processedMessages.length}`);
        
        // Agrupar por telefone para debug
        const messagesByPhone = processedMessages.reduce((acc, msg) => {
          if (!acc[msg.contactPhone]) {
            acc[msg.contactPhone] = [];
          }
          acc[msg.contactPhone].push(msg);
          return acc;
        }, {} as Record<string, ChannelMessage[]>);
        
        console.log('📞 Mensagens agrupadas por telefone:');
        Object.entries(messagesByPhone).forEach(([phone, msgs]) => {
          console.log(`${phone} (${msgs[0].contactName}): ${msgs.length} mensagens`);
        });
        
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
