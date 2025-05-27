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
    console.log(`🔄 Processando mensagem ID ${rawMessage.id} de ${rawMessage.session_id}`);
    console.log(`🔄 RAW MESSAGE DATA:`, JSON.stringify(rawMessage.message));
    
    // Log específico para tipos de dados que chegam
    if (typeof rawMessage.message === 'string') {
      console.log(`📄 Mensagem ID ${rawMessage.id}: Recebida como STRING`);
    } else if (typeof rawMessage.message === 'object') {
      console.log(`📋 Mensagem ID ${rawMessage.id}: Recebida como OBJECT`);
    }

    const messageData = parseMessageData(rawMessage.message);
    
    if (!messageData) {
      console.log(`❌ Falha ao processar mensagem ID ${rawMessage.id}`);
      console.log(`❌ Invalid message filtered out:`, rawMessage.message);
      console.log(`❌ REASON: parseMessageData returned null`);
      return null;
    }

    // Validação mais permissiva de conteúdo
    if (!messageData.content || messageData.content.trim().length === 0) {
      console.log(`⚠️ Mensagem ID ${rawMessage.id} tem conteúdo vazio, ignorando`);
      console.log(`⚠️ CONTENT WAS:`, JSON.stringify(messageData.content));
      return null;
    }

    const contactName = extractNameFromSessionId(rawMessage.session_id);
    const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
    
    // Mapeamento correto dos tipos
    const sender = messageData.type === 'human' ? 'customer' : 'agent';

    console.log(`✅ Mensagem ID ${rawMessage.id} processada: ${messageData.type} -> ${sender}`);
    console.log(`📞 Contato: ${contactName} (${contactPhone})`);
    console.log(`📝 Conteúdo final: "${messageData.content}"`);

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
    console.log(`📊 Iniciando processamento de ${rawMessages.length} mensagens brutas`);

    const processed = rawMessages
      .map(this.processMessage)
      .filter((message): message is ChannelMessage => message !== null);
    
    console.log(`📊 Filtered ${processed.length} valid messages from ${rawMessages.length} total messages`);
    console.log(`✅ Processamento concluído: ${processed.length} mensagens válidas de ${rawMessages.length} brutas`);
    
    // Log detalhado de cada mensagem processada
    processed.forEach((msg, index) => {
      console.log(`📋 Mensagem ${index + 1}: ID=${msg.id}, Sender=${msg.sender}, Content="${msg.content.substring(0, 50)}..."`);
    });
    
    return processed;
  }

  static groupMessagesByPhone(rawMessages: RawMessage[]): ChannelConversation[] {
    console.log(`📱 Agrupando ${rawMessages.length} mensagens por telefone`);
    
    const groupedConversations = new Map<string, {
      messages: RawMessage[];
      contactName: string;
      contactPhone: string;
      lastMessage: any;
      lastTimestamp: string;
      lastRawMessage: RawMessage;
    }>();

    // Ordenar mensagens por timestamp
    const sortedMessages = rawMessages.sort((a, b) => {
      const aData = parseMessageData(a.message);
      const bData = parseMessageData(b.message);
      const aTime = aData?.timestamp || '';
      const bTime = bData?.timestamp || '';
      return new Date(aTime).getTime() - new Date(bTime).getTime();
    });

    sortedMessages.forEach((rawMessage) => {
      const messageData = parseMessageData(rawMessage.message);
      if (!messageData || !messageData.content.trim()) {
        console.log(`⚠️ Ignorando mensagem ID ${rawMessage.id} no agrupamento - inválida`);
        return;
      }

      const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
      const contactName = extractNameFromSessionId(rawMessage.session_id);

      console.log(`📱 Agrupando mensagem para: ${contactName} (${contactPhone})`);

      if (!groupedConversations.has(contactPhone)) {
        groupedConversations.set(contactPhone, {
          messages: [],
          contactName,
          contactPhone,
          lastMessage: messageData,
          lastTimestamp: messageData.timestamp,
          lastRawMessage: rawMessage
        });
        console.log(`➕ Nova conversa criada para: ${contactPhone}`);
      }

      const group = groupedConversations.get(contactPhone)!;
      group.messages.push(rawMessage);

      // Atualizar com a mensagem mais recente
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
        last_message: group.lastMessage.content,
        last_message_time: group.lastTimestamp,
        status: 'unread' as const,
        assigned_to: null,
        created_at: group.lastTimestamp,
        updated_at: group.lastTimestamp
      }))
      .filter(conversation => conversation.last_message && conversation.last_message.trim().length > 0)
      .sort((a, b) => new Date(b.last_message_time || 0).getTime() - new Date(a.last_message_time || 0).getTime());

    console.log(`✅ Agrupamento concluído: ${result.length} conversas válidas`);
    result.forEach(conv => {
      console.log(`  - ${conv.contact_name} (${conv.contact_phone}): "${conv.last_message.substring(0, 50)}..."`);
    });
    
    return result;
  }
}
