
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

export const useMessageSender = () => {
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (messageData: MessageData) => {
    setSending(true);
    try {
      // Para simplificar, vamos apenas atualizar a última mensagem da conversa
      // Em uma implementação real, você criaria uma tabela de mensagens separada
      
      const tableName = getTableNameForChannel(messageData.channelId);
      
      const { error } = await supabase
        .from(tableName)
        .update({
          last_message: messageData.content,
          last_message_time: new Date().toISOString(),
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', messageData.conversationId);

      if (error) {
        throw error;
      }

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

const getTableNameForChannel = (channelId: string) => {
  const channelToTableMap: Record<string, string> = {
    'af1e5797-edc6-4ba3-a57a-25cf7297c4d6': 'canarana_conversas',
    '011b69ba-cf25-4f63-af2e-4ad0260d9516': 'canarana_conversas',
    'b7996f75-41a7-4725-8229-564f31868027': 'souto_soares_conversas',
    '621abb21-60b2-4ff2-a0a6-172a94b4b65c': 'joao_dourado_conversas',
    '64d8acad-c645-4544-a1e6-2f0825fae00b': 'america_dourada_conversas',
    'd8087e7b-5b06-4e26-aa05-6fc51fd4cdce': 'gerente_lojas_conversas',
    'd2892900-ca8f-4b08-a73f-6b7aa5866ff7': 'gerente_externo_conversas',
    '1e233898-5235-40d7-bf9c-55d46e4c16a1': 'pedro_conversas',
  };
  
  return channelToTableMap[channelId] || 'canarana_conversas';
};
