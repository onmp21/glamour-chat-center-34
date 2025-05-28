
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
    console.log(`🔄 [MESSAGE_PROCESSOR] Processing message ID ${rawMessage.id} from ${rawMessage.session_id} for channel ${channelId}`);
    
    let messageContent: string;
    let messageType: 'human' | 'ai' = 'human';
    let timestamp = new Date().toISOString();
    
    // Se message é uma string simples, usar diretamente
    if (typeof rawMessage.message === 'string') {
      messageContent = rawMessage.message.trim();
      console.log(`📄 [MESSAGE_PROCESSOR] Message ID ${rawMessage.id}: Simple string format - "${messageContent}"`);
      
      // Para canal Yelena: detectar mensagens da IA baseado no session_id
      if (rawMessage.session_id.includes('Óticas Villa Glamour') || 
          rawMessage.session_id.includes('óticas villa glamour') ||
          rawMessage.session_id.includes('ÓTICAS VILLA GLAMOUR')) {
        messageType = 'ai';
        console.log(`🤖 [MESSAGE_PROCESSOR] Detected Yelena AI message`);
      }
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

    // Extrair nome e telefone do session_id usando as funções atualizadas
    let contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
    let contactName = extractNameFromSessionId(rawMessage.session_id);
    
    console.log(`📱 [MESSAGE_PROCESSOR] Extracted - Phone: "${contactPhone}", Name: "${contactName}"`);

    const sender = messageType === 'human' ? 'customer' : 'agent';

    console.log(`✅ [MESSAGE_PROCESSOR] Message ID ${rawMessage.id} processed: ${messageType} -> ${sender}`);

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

      // Usar as funções atualizadas para extrair contato
      let contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
      let contactName = extractNameFromSessionId(rawMessage.session_id);

      // Para canal Yelena: garantir que há apenas um Pedro Vila Nova
      if ((channelId === 'chat' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') && 
          contactName.toLowerCase().includes('pedro vila nova')) {
        contactPhone = '556292631631'; // Telefone fixo para Pedro Vila Nova
        contactName = 'Pedro Vila Nova';
        console.log(`🏪 [MESSAGE_PROCESSOR] Yelena - normalized to unique Pedro Vila Nova`);
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

    console.log(`✅ [MESSAGE_PROCESSOR] Grouping completed: ${result.length} valid conversations`);
    
    return result;
  }
}
