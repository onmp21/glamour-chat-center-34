
import { parseMessageData } from './messageParser';
import { extractNameFromSessionId, extractPhoneFromSessionId, normalizeSessionId } from './sessionIdParser';
import { ChannelMessage } from '@/hooks/useChannelMessages';
import { ChannelConversation } from '@/hooks/useChannelConversations';

export interface RawMessage {
  id: number;
  session_id: string;
  message: any;
}

export class MessageProcessor {
  static processMessage(rawMessage: RawMessage, channelId?: string): ChannelMessage | null {
    console.log(`🔄 [MESSAGE_PROCESSOR] Processing message ID ${rawMessage.id} from "${rawMessage.session_id}" for channel ${channelId}`);
    
    let messageContent: string;
    let messageType: 'human' | 'ai' = 'human';
    let timestamp = new Date().toISOString();
    
    // Se message é uma string simples, usar diretamente
    if (typeof rawMessage.message === 'string') {
      messageContent = rawMessage.message.trim();
      console.log(`📄 [MESSAGE_PROCESSOR] Message ID ${rawMessage.id}: Simple string format - "${messageContent}"`);
    } else {
      const messageData = parseMessageData(rawMessage.message);
      
      if (!messageData) {
        console.log(`❌ [MESSAGE_PROCESSOR] Failed to process message ID ${rawMessage.id}`);
        return null;
      }
      
      messageContent = messageData.content;
      messageType = messageData.type;
      timestamp = messageData.timestamp || timestamp;
    }

    if (!messageContent || messageContent.trim().length === 0) {
      console.log(`⚠️ [MESSAGE_PROCESSOR] Message ID ${rawMessage.id} has empty content, ignoring`);
      return null;
    }

    // Extrair telefone e nome do session_id
    const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
    const senderNameFromSessionId = extractNameFromSessionId(rawMessage.session_id);
    
    console.log(`📱 [MESSAGE_PROCESSOR] Extracted - Phone: "${contactPhone}", Sender: "${senderNameFromSessionId}"`);

    // Determinar se é agente ou cliente baseado no canal e nome do remetente
    let sender: 'customer' | 'agent' = 'customer';
    let contactName = senderNameFromSessionId;

    if (channelId === 'chat' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') {
      // Canal Yelena: Óticas Villa Glamour é o agente
      if (senderNameFromSessionId.toLowerCase().includes('óticas villa glamour') || 
          senderNameFromSessionId.toLowerCase().includes('villa glamour') ||
          senderNameFromSessionId.toLowerCase().includes('yelena')) {
        sender = 'agent';
        contactName = 'Pedro Vila Nova'; // O contato real é Pedro Vila Nova
      } else {
        sender = 'customer';
        contactName = 'Pedro Vila Nova'; // Normalizar nome do contato
      }
    } else if (channelId === 'gerente-externo' || channelId === 'd2892900-ca8f-4b08-a73f-6b7aa5866ff7') {
      // Canal Gerente Externo: Andressa é o agente
      if (senderNameFromSessionId.toLowerCase().includes('andressa')) {
        sender = 'agent';
        contactName = `Cliente ${contactPhone.slice(-4)}`; // Nome do contato baseado no telefone
      } else {
        sender = 'customer';
        contactName = senderNameFromSessionId;
      }
    } else {
      // Outros canais: usar lógica padrão
      if (messageType === 'ai') {
        sender = 'agent';
      } else {
        sender = 'customer';
      }
      contactName = senderNameFromSessionId;
    }

    console.log(`✅ [MESSAGE_PROCESSOR] Message ID ${rawMessage.id} processed: sender=${sender}, contactName=${contactName}`);

    return {
      id: rawMessage.id.toString(),
      content: messageContent,
      timestamp,
      sender,
      contactName,
      contactPhone,
      messageType: sender === 'agent' ? 'ai' : 'human'
    };
  }

  static processMessages(rawMessages: RawMessage[], channelId?: string): ChannelMessage[] {
    console.log(`📊 [MESSAGE_PROCESSOR] Starting processing of ${rawMessages.length} raw messages for channel ${channelId}`);

    const processed = rawMessages
      .map(msg => this.processMessage(msg, channelId))
      .filter((message): message is ChannelMessage => message !== null);
    
    console.log(`✅ [MESSAGE_PROCESSOR] Processing completed: ${processed.length} valid messages from ${rawMessages.length} raw`);
    
    return processed;
  }

  static groupMessagesByPhone(rawMessages: RawMessage[], channelId?: string): ChannelConversation[] {
    console.log(`📱 [MESSAGE_PROCESSOR] Grouping ${rawMessages.length} messages by phone for channel ${channelId}`);
    
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
          console.log(`⚠️ [MESSAGE_PROCESSOR] Ignoring message ID ${rawMessage.id} in grouping - invalid`);
          return;
        }
        messageContent = messageData.content;
        messageTimestamp = messageData.timestamp || messageTimestamp;
      }

      if (!messageContent.trim()) {
        console.log(`⚠️ [MESSAGE_PROCESSOR] Ignoring message ID ${rawMessage.id} in grouping - empty content`);
        return;
      }

      const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
      const senderNameFromSessionId = extractNameFromSessionId(rawMessage.session_id);
      
      // Determinar nome do contato baseado no canal
      let contactName = senderNameFromSessionId;
      
      if (channelId === 'chat' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') {
        // Canal Yelena: sempre Pedro Vila Nova
        contactName = 'Pedro Vila Nova';
      } else if (channelId === 'gerente-externo' || channelId === 'd2892900-ca8f-4b08-a73f-6b7aa5866ff7') {
        // Canal Gerente Externo: nome baseado no telefone se for Andressa falando
        if (senderNameFromSessionId.toLowerCase().includes('andressa')) {
          contactName = `Cliente ${contactPhone.slice(-4)}`;
        } else {
          contactName = senderNameFromSessionId;
        }
      }

      console.log(`📱 [MESSAGE_PROCESSOR] Grouping message for: ${contactName} (${contactPhone})`);

      if (!groupedConversations.has(contactPhone)) {
        groupedConversations.set(contactPhone, {
          messages: [],
          contactName,
          contactPhone,
          lastMessage: { content: messageContent },
          lastTimestamp: messageTimestamp,
          lastRawMessage: rawMessage
        });
        console.log(`➕ [MESSAGE_PROCESSOR] New conversation created for: ${contactPhone}`);
      }

      const group = groupedConversations.get(contactPhone)!;
      group.messages.push(rawMessage);

      if (rawMessage.id >= group.lastRawMessage.id) {
        group.lastMessage = { content: messageContent };
        group.lastTimestamp = messageTimestamp;
        group.lastRawMessage = rawMessage;
        group.contactName = contactName; // Manter nome consistente
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

    console.log(`✅ [MESSAGE_PROCESSOR] Grouping completed: ${result.length} valid conversations`);
    
    return result;
  }
}
