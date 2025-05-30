import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageSenderService } from '@/services/MessageSenderService'; // Import the service

// Define MessageType
export type MessageType = 'text' | 'file' | 'audio' | 'image' | 'video'; // Add other types as needed

export interface MessageData {
  conversationId: string;
  channelId: string;
  content: string; // For text messages or captions for media
  sender: 'customer' | 'agent';
  agentName?: string;
  messageType?: MessageType; // Optional: type of message
  fileBase64?: string; // Optional: base64 encoded file data
  fileName?: string; // Optional: name of the file
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
  const messageSenderService = new MessageSenderService(); // Instantiate the service

  // Keep sendWebhook if it's still needed for other purposes, but API sending is primary
  const sendWebhook = async (messageData: MessageData) => {
    // ... (webhook logic remains the same for now)
    try {
      const webhookUrl = 'https://n8n.estudioonmp.com/webhook/3a0b2487-21d0-43c7-bc7f-07404879df5434232';
      const phoneNumber = messageData.conversationId;
      const tableName = getTableNameForChannel(messageData.channelId);
      let clientName = '';
      
      try {
        const { data: conversations, error } = await supabase
          .from(tableName)
          .select('session_id, Nome_do_contato')
          .ilike('session_id', `%${phoneNumber}%`)
          .order('id', { ascending: false })
          .limit(1);
        
        if (!error && conversations && conversations.length > 0) {
          const conversation = conversations[0] as any;
          if (conversation.Nome_do_contato) {
            clientName = conversation.Nome_do_contato;
          } else if (conversation.session_id) {
            const sessionId = conversation.session_id;
            if (sessionId.includes('-') && !sessionId.startsWith('agent_')) {
              clientName = sessionId.split('-').slice(1).join('-');
            }
          }
        } else {
          const { data: fallbackConversations } = await supabase
            .from(tableName)
            .select('session_id')
            .ilike('session_id', `%${phoneNumber}%`)
            .order('id', { ascending: false })
            .limit(1);
          
          if (fallbackConversations && fallbackConversations.length > 0) {
            const sessionId = fallbackConversations[0].session_id;
            if (sessionId.includes('-') && !sessionId.startsWith('agent_')) {
              clientName = sessionId.split('-').slice(1).join('-');
            }
          }
        }
      } catch (error) {
        console.log('Erro ao buscar nome do cliente:', error);
      }
      
      const channelName = getChannelDisplayName(messageData.channelId);
      
      const webhookData = {
        numerodocliente: phoneNumber,
        canal: channelName,
        nomedocliente: clientName || 'Cliente',
        // Send only text content to webhook for now, or adjust as needed
        conteudo: messageData.messageType === 'text' || !messageData.messageType ? messageData.content : `[${messageData.messageType}: ${messageData.fileName}]`
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
      // Ensure messageType is set, default to 'text'
      const dataToSend: MessageData = {
        ...messageData,
        messageType: messageData.messageType || 'text',
      };

      // Use the MessageSenderService to send via Evolution API
      const success = await messageSenderService.sendMessage(dataToSend);

      if (!success) {
        throw new Error('Failed to send message via Evolution API');
      }

      // Optional: Save agent message to Supabase (consider if Evolution API handles this)
      // If saving locally, adjust to handle different message types
      /*
      const tableName = getTableNameForChannel(messageData.channelId);
      const insertData: any = {
        session_id: `agent_${messageData.conversationId}_${Date.now()}`,
        message: dataToSend.messageType === 'text' ? dataToSend.content : `[${dataToSend.messageType}] ${dataToSend.fileName || ''}`,
        read_at: new Date().toISOString(),
        // Add fields for media if needed (e.g., file_url, media_type)
      };
      try {
        insertData.Nome_do_contato = messageData.agentName || 'Atendente';
        const { error } = await supabase.from(tableName).insert(insertData);
        if (error) throw error;
      } catch (error: any) {
        if (error.message?.includes('Nome_do_contato')) {
          delete insertData.Nome_do_contato;
          const { error: fallbackError } = await supabase.from(tableName).insert(insertData);
          if (fallbackError) throw fallbackError;
        } else {
          throw error;
        }
      }
      */

      // Send webhook after successful API send (if still required)
      // await sendWebhook(dataToSend);

      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso",
      });

      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: `Erro ao enviar mensagem: ${error.message}`,
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
    'af1e5797-edc6-4ba3-a57a-25cf7297c4d6': 'Óticas Villa Glamour',
    '011b69ba-cf25-4f63-af2e-4ad0260d9516': 'canarana',
    'b7996f75-41a7-4725-8229-564f31868027': 'souto-soares',
    '621abb21-60b2-4ff2-a0a6-172a94b4b65c': 'joao-dourado',
    '64d8acad-c645-4544-a1e6-2f0825fae00b': 'america-dourada',
    'd8087e7b-5b06-4e26-aa05-6fc51fd4cdce': 'gerente-lojas',
    'd2892900-ca8f-4b08-a73f-6b7aa5866ff7': 'andressa',
    '1e233898-5235-40d7-bf9c-55d46e4c16a1': 'pedro',
    'chat': 'Óticas Villa Glamour',
    'canarana': 'canarana',
    'souto-soares': 'souto-soares',
    'joao-dourado': 'joao-dourado',
    'america-dourada': 'america-dourada',
    'gerente-lojas': 'gerente-lojas',
    'gerente-externo': 'andressa',
    'pedro': 'pedro'
  };
  
  return channelDisplayMap[channelId] || 'Óticas Villa Glamour';
};
