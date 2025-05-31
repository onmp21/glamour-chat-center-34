
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MessageSenderService } from '@/services/MessageSenderService';
import { ExtendedMessageData } from '@/types/messageTypes';

export const useMessageSenderExtended = () => {
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const messageSenderService = new MessageSenderService();

  const sendMessage = async (messageData: ExtendedMessageData): Promise<boolean> => {
    setSending(true);
    try {
      // Convert ExtendedMessageData to MessageData format
      const evolutionMessageData = {
        conversationId: messageData.conversationId,
        channelId: messageData.channelId,
        content: messageData.content,
        sender: messageData.sender,
        agentName: messageData.agentName,
        messageType: messageData.messageType || 'text',
        fileBase64: messageData.fileData?.base64,
        fileName: messageData.fileData?.fileName
      };

      await messageSenderService.sendMessage(evolutionMessageData);

      const messageType = messageData.messageType || 'text';
      const typeMessages = {
        text: 'Mensagem enviada',
        file: 'Arquivo enviado',
        audio: 'Áudio enviado',
        image: 'Imagem enviada',
        video: 'Vídeo enviado'
      };

      toast({
        title: "Sucesso",
        description: typeMessages[messageType] + " com sucesso",
      });

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
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
