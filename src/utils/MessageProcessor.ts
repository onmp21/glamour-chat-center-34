
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
    
    let messageContent: string;
    let messageType: 'human' | 'ai' = 'human';
    let timestamp = new Date().toISOString();
    
    // Se message é uma string simples, usar diretamente
    if (typeof rawMessage.message === 'string') {
      messageContent = rawMessage.message.trim();
      console.log(`📄 Mensagem ID ${rawMessage.id}: Formato string simples - "${messageContent}"`);
      
      // Para canal Yelena: detectar mensagens da IA baseado no session_id
      if (rawMessage.session_id.includes('Óticas Villa Glamour') || 
          rawMessage.session_id.includes('óticas villa glamour') ||
          rawMessage.session_id.includes('ÓTICAS VILLA GLAMOUR')) {
        messageType = 'ai';
        console.log(`🤖 Detectada mensagem da Yelena (Óticas Villa Glamour)`);
      }
    } else {
      const messageData = parseMessageData(rawMessage.message);
      
      if (!messageData) {
        console.log(`❌ Falha ao processar mensagem ID ${rawMessage.id}`);
        return null;
      }
      
      messageContent = messageData.content;
      messageType = messageData.type;
      timestamp = messageData.timestamp || timestamp;
    }

    if (!messageContent || messageContent.trim().length === 0) {
      console.log(`⚠️ Mensagem ID ${rawMessage.id} tem conteúdo vazio, ignorando`);
      return null;
    }

    // Extrair nome e telefone do session_id
    let contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
    let contactName = extractNameFromSessionId(rawMessage.session_id);
    
    // Normalizar para canal Yelena - sempre usar "Pedro Vila Nova"
    if (rawMessage.session_id.includes('Óticas Villa Glamour') || 
        rawMessage.session_id.includes('óticas villa glamour') ||
        rawMessage.session_id.includes('ÓTICAS VILLA GLAMOUR')) {
      contactName = 'Pedro Vila Nova';
      const phoneMatch = rawMessage.session_id.match(/(\d{10,15})/);
      if (phoneMatch) {
        contactPhone = phoneMatch[1];
      }
    }

    const sender = messageType === 'human' ? 'customer' : 'agent';

    console.log(`✅ Mensagem ID ${rawMessage.id} processada: ${messageType} -> ${sender}`);
    console.log(`📞 Contato: ${contactName} (${contactPhone})`);

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
    
    console.log(`✅ Processamento concluído: ${processed.length} mensagens válidas de ${rawMessages.length} brutas`);
    
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

    const sortedMessages = rawMessages.sort((a, b) => a.id - b.id);

    sortedMessages.forEach((rawMessage) => {
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

      let contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
      let contactName = extractNameFromSessionId(rawMessage.session_id);

      // Normalizar nomes baseado no session_id
      if (rawMessage.session_id.includes('Óticas Villa Glamour') || 
          rawMessage.session_id.includes('óticas villa glamour') ||
          rawMessage.session_id.includes('ÓTICAS VILLA GLAMOUR')) {
        // Canal Yelena: sempre "Pedro Vila Nova"
        contactName = 'Pedro Vila Nova';
        const phoneMatch = rawMessage.session_id.match(/(\d{10,15})/);
        contactPhone = phoneMatch ? phoneMatch[1] : '556292631631';
      } else if (rawMessage.session_id.includes('-andressa')) {
        // Canal Gerente Externo: extrair contato real (não andressa)
        contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
        // Usar um nome baseado no telefone para o contato
        contactName = `Cliente ${contactPhone.slice(-4)}`;
      }

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

      if (rawMessage.id >= group.lastRawMessage.id) {
        group.lastMessage = { content: messageContent };
        group.lastTimestamp = messageTimestamp;
        group.lastRawMessage = rawMessage;
        group.contactName = contactName;
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
    
    return result;
  }
}
