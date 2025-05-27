
import { parseMessageData } from './messageParser';
import { extractNameFromSessionId, extractPhoneFromSessionId } from './sessionIdParser';
import { ChannelMessage } from '@/hooks/useChannelMessages';
import { ChannelConversation } from '@/hooks/useChannelConversations';

export interface RawMessage {
  id: number;
  session_id: string;
  message: any;
}

export class MessageProcessor {
  static processMessage(rawMessage: RawMessage): ChannelMessage | null {
    const messageData = parseMessageData(rawMessage.message);
    
    if (!messageData) {
      console.log(`⚠️ Failed to process message ID ${rawMessage.id}:`, rawMessage.message);
      return null;
    }

    // Verificar se o conteúdo não está vazio
    if (!messageData.content || messageData.content.trim().length === 0) {
      console.log(`⚠️ Empty content message ID ${rawMessage.id}, skipping`);
      return null;
    }

    const contactName = extractNameFromSessionId(rawMessage.session_id);
    const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
    // Corrigir mapeamento: 'ia' deve ser 'agent', 'human' deve ser 'customer'
    const sender = messageData.type === 'human' ? 'customer' : 'agent';

    return {
      id: rawMessage.id.toString(),
      content: messageData.content,
      timestamp: messageData.timestamp || new Date().toISOString(),
      sender,
      contactName,
      contactPhone,
      messageType: messageData.type
    };
  }

  static processMessages(rawMessages: RawMessage[]): ChannelMessage[] {
    return rawMessages
      .map(this.processMessage)
      .filter((message): message is ChannelMessage => message !== null);
  }

  static groupMessagesByPhone(rawMessages: RawMessage[]): ChannelConversation[] {
    const groupedConversations = new Map<string, {
      messages: RawMessage[];
      contactName: string;
      contactPhone: string;
      lastMessage: any;
      lastTimestamp: string;
      lastRawMessage: RawMessage;
    }>();

    // Ordenar mensagens por timestamp para garantir ordem correta
    const sortedMessages = rawMessages.sort((a, b) => {
      const aData = parseMessageData(a.message);
      const bData = parseMessageData(b.message);
      const aTime = aData?.timestamp || '';
      const bTime = bData?.timestamp || '';
      return new Date(aTime).getTime() - new Date(bTime).getTime();
    });

    sortedMessages.forEach((rawMessage) => {
      const messageData = parseMessageData(rawMessage.message);
      if (!messageData) {
        console.log(`⚠️ Skipping message ID ${rawMessage.id} - failed to parse:`, rawMessage.message);
        return;
      }

      // Verificar se o conteúdo não está vazio
      if (!messageData.content || messageData.content.trim().length === 0) {
        console.log(`⚠️ Skipping message ID ${rawMessage.id} - empty content`);
        return;
      }

      const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
      const contactName = extractNameFromSessionId(rawMessage.session_id);

      if (!groupedConversations.has(contactPhone)) {
        groupedConversations.set(contactPhone, {
          messages: [],
          contactName,
          contactPhone,
          lastMessage: messageData,
          lastTimestamp: messageData.timestamp,
          lastRawMessage: rawMessage
        });
      }

      const group = groupedConversations.get(contactPhone)!;
      group.messages.push(rawMessage);

      // Sempre atualizar com a mensagem mais recente (independente de quem enviou)
      if (new Date(messageData.timestamp) >= new Date(group.lastTimestamp)) {
        group.lastMessage = messageData;
        group.lastTimestamp = messageData.timestamp;
        group.lastRawMessage = rawMessage;
      }
    });

    const result = Array.from(groupedConversations.entries())
      .map(([phone, group]) => ({
        id: phone,
        contact_name: group.contactName,
        contact_phone: phone,
        last_message: group.lastMessage.content, // Exibir sempre a última mensagem, seja de quem for
        last_message_time: group.lastTimestamp,
        status: 'unread' as const,
        assigned_to: null,
        created_at: group.lastTimestamp,
        updated_at: group.lastTimestamp
      }))
      .filter(conversation => conversation.last_message && conversation.last_message.trim().length > 0) // Filtrar conversas sem última mensagem válida
      .sort((a, b) => new Date(b.last_message_time || 0).getTime() - new Date(a.last_message_time || 0).getTime());

    console.log(`📊 Grouped ${rawMessages.length} messages into ${result.length} valid conversations`);
    return result;
  }
}
