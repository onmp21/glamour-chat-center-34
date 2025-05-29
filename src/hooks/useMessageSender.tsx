
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MessageData {
  conversationId: string;
  channelId: string;
  content: string;
  sender: 'customer' | 'agent';
  agentName?: string;
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

export const useMessageSender = () => {
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const sendWebhook = async (messageData: MessageData) => {
    try {
      const webhookUrl = 'https://n8n.estudioonmp.com/webhook/3a0b2487-21d0-43c7-bc7f-07404879df5434232';
      
      // Extrair número e nome do cliente do conversationId
      const phoneNumber = messageData.conversationId;
      
      // Buscar o nome do cliente nas conversas da tabela correspondente
      const tableName = getTableNameForChannel(messageData.channelId);
      let clientName = '';
      
      try {
        const { data: conversations } = await supabase
          .from(tableName)
          .select('session_id, Nome_do_contato')
          .ilike('session_id', `%${phoneNumber}%`)
          .order('id', { ascending: false })
          .limit(1);
        
        if (conversations && conversations.length > 0) {
          // Usar a nova coluna Nome_do_contato se disponível
          clientName = conversations[0].Nome_do_contato || '';
          
          if (!clientName) {
            const sessionId = conversations[0].session_id;
            // Extrair nome do session_id (formato: "numero-Nome" ou "agent_numero_timestamp")
            if (sessionId.includes('-') && !sessionId.startsWith('agent_')) {
              clientName = sessionId.split('-').slice(1).join('-');
            }
          }
        }
      } catch (error) {
        console.log('Erro ao buscar nome do cliente:', error);
      }
      
      // Mapear canal para nome
      const channelName = getChannelDisplayName(messageData.channelId);
      
      const webhookData = {
        numerodocliente: phoneNumber,
        canal: channelName,
        nomedocliente: clientName || 'Cliente',
        conteudo: messageData.content
      };

      console.log('🔥 Enviando para webhook:', webhookData);

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(webhookData),
      });

      console.log('✅ Webhook enviado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao enviar webhook:', error);
    }
  };

  const sendMessage = async (messageData: MessageData) => {
    setSending(true);
    try {
      const tableName = getTableNameForChannel(messageData.channelId);
      
      // Agora inserimos com o novo formato da tabela
      const { error } = await supabase
        .from(tableName)
        .insert({
          session_id: `agent_${messageData.conversationId}_${Date.now()}`,
          message: messageData.content, // Agora é texto simples
          Nome_do_contato: messageData.agentName || 'Atendente',
          read_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      // Enviar webhook apenas quando a mensagem for salva com sucesso
      await sendWebhook(messageData);

      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso",
      });

      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem",
        variant: "destructive"
      });
      return false;
    } finally {
      setSending(false);
    }
  };

  return {
    sendMessage,
    sending
  };
};

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

const getChannelDisplayName = (channelId: string): string => {
  const channelDisplayMap: Record<string, string> = {
    'af1e5797-edc6-4ba3-a57a-25cf7297c4d6': 'yelena',
    '011b69ba-cf25-4f63-af2e-4ad0260d9516': 'canarana',
    'b7996f75-41a7-4725-8229-564f31868027': 'souto-soares',
    '621abb21-60b2-4ff2-a0a6-172a94b4b65c': 'joao-dourado',
    '64d8acad-c645-4544-a1e6-2f0825fae00b': 'america-dourada',
    'd8087e7b-5b06-4e26-aa05-6fc51fd4cdce': 'gerente-lojas',
    'd2892900-ca8f-4b08-a73f-6b7aa5866ff7': 'gerente-externo',
    '1e233898-5235-40d7-bf9c-55d46e4c16a1': 'pedro',
    'chat': 'yelena',
    'canarana': 'canarana',
    'souto-soares': 'souto-soares',
    'joao-dourado': 'joao-dourado',
    'america-dourada': 'america-dourada',
    'gerente-lojas': 'gerente-lojas',
    'gerente-externo': 'gerente-externo',
    'pedro': 'pedro'
  };
  
  return channelDisplayMap[channelId] || 'yelena';
};
