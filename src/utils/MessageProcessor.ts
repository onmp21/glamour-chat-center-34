
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
      console.log(`⚠️ Failed to process message ID ${rawMessage.id}`);
      return null;
    }

    const contactName = extractNameFromSessionId(rawMessage.session_id);
    const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
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
    }>();

    rawMessages.forEach((rawMessage) => {
      const messageData = parseMessageData(rawMessage.message);
      if (!messageData) return;

      const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
      const contactName = extractNameFromSessionId(rawMessage.session_id);

      if (!groupedConversations.has(contactPhone)) {
        groupedConversations.set(contactPhone, {
          messages: [],
          contactName,
          contactPhone,
          lastMessage: messageData,
          lastTimestamp: messageData.timestamp
        });
      }

      const group = groupedConversations.get(contactPhone)!;
      group.messages.push(rawMessage);

      if (new Date(messageData.timestamp) > new Date(group.lastTimestamp)) {
        group.lastMessage = messageData;
        group.lastTimestamp = messageData.timestamp;
      }
    });

    return Array.from(groupedConversations.entries())
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
      .sort((a, b) => new Date(b.last_message_time || 0).getTime() - new Date(a.last_message_time || 0).getTime());
  }
}
