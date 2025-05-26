
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { extractPhoneFromSessionId, extractNameFromSessionId } from '@/utils/sessionIdParser';

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

  const getChannelNameById = (channelId: string): string => {
    const channelNames: Record<string, string> = {
      'af1e5797-edc6-4ba3-a57a-25cf7297c4d6': 'yelena',
      '011b69ba-cf25-4f63-af2e-4ad0260d9516': 'canarana',
      'b7996f75-41a7-4725-8229-564f31868027': 'souto-soares',
      '621abb21-60b2-4ff2-a0a6-172a94b4b65c': 'joao-dourado',
      '64d8acad-c645-4544-a1e6-2f0825fae00b': 'america-dourada',
      'd8087e7b-5b06-4e26-aa05-6fc51fd4cdce': 'gerente-lojas',
      'd2892900-ca8f-4b08-a73f-6b7aa5866ff7': 'gerente-externo',
      '1e233898-5235-40d7-bf9c-55d46e4c16a1': 'pedro',
    };
    
    return channelNames[channelId] || channelId;
  };

  const sendWebhook = async (messageData: MessageData) => {
    try {
      const webhookUrl = 'https://n8n.estudioonmp.com/webhook/3a0b2487-21d0-43c7-bc7f-07404879df5434232';
      
      // Extrair nome e número do cliente do conversationId (que é o session_id)
      const clientPhone = extractPhoneFromSessionId(messageData.conversationId);
      const clientName = extractNameFromSessionId(messageData.conversationId);
      const channelName = getChannelNameById(messageData.channelId);
      
      const webhookData = {
        numerodocliente: clientPhone,
        canal: channelName,
        nomedocliente: clientName
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
      
      const messagePayload = {
        content: messageData.content,
        sender: messageData.sender,
        agentName: messageData.agentName,
        timestamp: new Date().toISOString(),
        type: 'response'
      };

      const { error } = await supabase
        .from(tableName)
        .insert({
          session_id: `agent_${messageData.conversationId}_${Date.now()}`,
          message: messagePayload
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
