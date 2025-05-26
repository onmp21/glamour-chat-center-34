
import { parseMessageData } from './messageParser';
import { extractPhoneFromSessionId, extractNameFromSessionId } from './sessionIdParser';
import { ChannelConversation } from '@/hooks/useChannelConversations';

export const groupMessagesByPhone = (data: any[]): ChannelConversation[] => {
  // Agrupar mensagens por número de telefone extraído do session_id
  const groupedConversations = new Map<string, {
    messages: any[];
    contactName: string;
    contactPhone: string;
    lastMessage: any;
    lastTimestamp: string;
  }>();

  (data || []).forEach((row) => {
    const messageData = parseMessageData(row.message);
    if (!messageData) return;

    const contactPhone = extractPhoneFromSessionId(row.session_id);
    const contactName = extractNameFromSessionId(row.session_id);

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
    group.messages.push({ ...row, messageData });

    // Atualizar última mensagem se for mais recente
    if (new Date(messageData.timestamp) > new Date(group.lastTimestamp)) {
      group.lastMessage = messageData;
      group.lastTimestamp = messageData.timestamp;
    }
  });

  // Converter grupos em conversas
  const typedConversations: ChannelConversation[] = Array.from(groupedConversations.entries())
    .map(([phone, group]) => ({
      id: phone, // Usar o telefone como ID único da conversa
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

  return typedConversations;
};
