
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
    
    // Para o novo formato: session_id = "556292631631-andressa" e message = "a mensagem enviada"
    let messageContent: string;
    let messageType: 'human' | 'ai' = 'human'; // Default para human
    let timestamp = new Date().toISOString();
    
    // Se message é uma string simples, usar diretamente
    if (typeof rawMessage.message === 'string') {
      messageContent = rawMessage.message;
      console.log(`📄 Mensagem ID ${rawMessage.id}: Formato string simples - "${messageContent}"`);
    } else {
      // Tentar usar o parser existente como fallback
      const messageData = parseMessageData(rawMessage.message);
      
      if (!messageData) {
        console.log(`❌ Falha ao processar mensagem ID ${rawMessage.id}`);
        return null;
      }
      
      messageContent = messageData.content;
      // Converter 'assistant' para 'ai' para compatibilidade
      messageType = messageData.type === 'assistant' ? 'ai' : messageData.type;
      timestamp = messageData.timestamp || timestamp;
    }

    // Validação de conteúdo
    if (!messageContent || messageContent.trim().length === 0) {
      console.log(`⚠️ Mensagem ID ${rawMessage.id} tem conteúdo vazio, ignorando`);
      return null;
    }

    // Extrair nome e telefone do novo formato de session_id
    const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
    const contactName = extractNameFromSessionId(rawMessage.session_id);
    
    // Mapeamento correto dos tipos - no novo formato, a chave é o número e o nome é quem enviou
    const sender = messageType === 'human' ? 'customer' : 'agent';

    console.log(`✅ Mensagem ID ${rawMessage.id} processada: ${messageType} -> ${sender}`);
    console.log(`📞 Contato: ${contactName} (${contactPhone})`);
    console.log(`📝 Conteúdo final: "${messageContent}"`);

    return {
      id: rawMessage.id.toString(),
      content: messageContent,
      timestamp,
      sender,
      contactName,
      contactPhone,
      messageType
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

    // Ordenar mensagens por ID (mais recente primeiro)
    const sortedMessages = rawMessages.sort((a, b) => a.id - b.id);

    sortedMessages.forEach((rawMessage) => {
      // Para o novo formato, processar message como string ou objeto
      let messageContent: string;
      let messageTimestamp = new Date().toISOString();
      
      if (typeof rawMessage.message === 'string') {
        messageContent = rawMessage.message;
      } else {
        const messageData = parseMessageData(rawMessage.message);
        if (!messageData || !messageData.content.trim()) {
          console.log(`⚠️ Ignorando mensagem ID ${rawMessage.id} no agrupamento - inválida`);
          return;
        }
        messageContent = messageData.content;
        messageTimestamp = messageData.timestamp || messageTimestamp;
      }

      if (!messageContent.trim()) {
        console.log(`⚠️ Ignorando mensagem ID ${rawMessage.id} no agrupamento - conteúdo vazio`);
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
          lastMessage: { content: messageContent },
          lastTimestamp: messageTimestamp,
          lastRawMessage: rawMessage
        });
        console.log(`➕ Nova conversa criada para: ${contactPhone}`);
      }

      const group = groupedConversations.get(contactPhone)!;
      group.messages.push(rawMessage);

      // Atualizar com a mensagem mais recente (ID maior)
      if (rawMessage.id >= group.lastRawMessage.id) {
        group.lastMessage = { content: messageContent };
        group.lastTimestamp = messageTimestamp;
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
