
import { parseMessageData, getChannelSenderName } from './messageParser';
import { extractNameFromSessionId, extractPhoneFromSessionId } from './sessionIdParser';
import { ChannelMessage } from '@/hooks/useChannelMessages';
import { ChannelConversation } from '@/hooks/useChannelConversations';

export interface RawMessage {
  id: number;
  session_id: string;
  message: string;
  Nome_do_contato?: string;
  nome_do_contato?: string;
  created_at?: string;
  read_at?: string;
}

// Lista de nomes conhecidos de agentes
const agentNames = ["Óticas Villa Glamour", "andressa"];

export class MessageProcessor {
  static processMessage(rawMessage: RawMessage, channelId?: string): ChannelMessage | null {
    const messageContent = rawMessage.message?.trim();
    if (!messageContent) {
      return null;
    }

    // Usar a nova coluna Nome_do_contato se disponível
    const contactNameFromDB = rawMessage.Nome_do_contato || rawMessage.nome_do_contato;
    
    const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
    const fallbackName = extractNameFromSessionId(rawMessage.session_id);
    const rawContactName = contactNameFromDB || fallbackName;
    
    // Determinar sender baseado em Nome_do_contato
    let sender: 'customer' | 'agent' = 'customer';
    let contactName = rawContactName;

    // Verificar se o nome do contato no banco de dados corresponde a um agente conhecido
    if (contactNameFromDB && agentNames.includes(contactNameFromDB)) {
        sender = 'agent';
        contactName = contactNameFromDB;
    } else {
        sender = 'customer';
        // Definir o nome do cliente, aplicando padrões específicos do canal se necessário
        if (channelId === 'chat' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') {
            contactName = rawContactName || 'Pedro Vila Nova'; 
        } else if (channelId === 'gerente-externo' || channelId === 'd2892900-ca8f-4b08-a73f-6b7aa5866ff7') {
            contactName = rawContactName || `Cliente ${contactPhone.slice(-4)}`; 
        } else {
            contactName = rawContactName || 'Cliente'; 
        }
    }

    const messageTimestamp = rawMessage.read_at || rawMessage.created_at || new Date().toISOString();

    return {
      id: rawMessage.id.toString(),
      content: messageContent,
      timestamp: messageTimestamp,
      sender,
      contactName,
      contactPhone,
      messageType: sender === 'agent' ? 'ai' : 'human'
    };
  }

  static processMessages(rawMessages: RawMessage[], channelId?: string): ChannelMessage[] {
    const processed = rawMessages
      .map(msg => this.processMessage(msg, channelId))
      .filter((message): message is ChannelMessage => message !== null);
    
    return processed;
  }

  static groupMessagesByPhone(rawMessages: RawMessage[], channelId?: string): ChannelConversation[] {
    const groupedByPhone = new Map<string, RawMessage[]>();

    // Agrupar todas as mensagens pelo número de telefone primeiro
    rawMessages.forEach((rawMessage) => {
      const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
      if (!groupedByPhone.has(contactPhone)) {
        groupedByPhone.set(contactPhone, []);
      }
      groupedByPhone.get(contactPhone)!.push(rawMessage);
    });

    const conversations: ChannelConversation[] = [];

    // Processar cada grupo para criar um objeto de conversa
    groupedByPhone.forEach((messagesInGroup, contactPhone) => {
      if (messagesInGroup.length === 0) return;

      // Ordenar mensagens dentro do grupo por ID
      const sortedMessagesInGroup = messagesInGroup.sort((a, b) => a.id - b.id);

      // Encontrar o nome real do contato
      let actualContactName = `Cliente ${contactPhone.slice(-4)}`;
      for (const msg of sortedMessagesInGroup) {
        const nameFromDB = msg.Nome_do_contato || msg.nome_do_contato;
        if (nameFromDB && !agentNames.includes(nameFromDB)) {
          actualContactName = nameFromDB;
          break;
        }
        const fallbackName = extractNameFromSessionId(msg.session_id);
        if (fallbackName && fallbackName !== contactPhone && !agentNames.includes(fallbackName)) {
           actualContactName = fallbackName;
        }
      }

      const lastMessage = sortedMessagesInGroup[sortedMessagesInGroup.length - 1];
      const lastMessageContent = lastMessage.message?.trim() || 'Sem mensagens';
      const lastTimestamp = lastMessage.read_at || lastMessage.created_at || new Date().toISOString();
      
      // Função auxiliar para obter status do localStorage
      const getStoredStatus = (channelId: string, conversationId: string): 'unread' | 'in_progress' | 'resolved' => {
        try {
          const statusKey = `conversation_status_${channelId}_${conversationId}`;
          const savedStatus = localStorage.getItem(statusKey);
          return (savedStatus as 'unread' | 'in_progress' | 'resolved') || 'unread';
        } catch (e) {
          return 'unread';
        }
      };

      conversations.push({
        id: contactPhone,
        contact_name: actualContactName,
        contact_phone: contactPhone,
        last_message: lastMessageContent,
        last_message_time: lastTimestamp,
        status: getStoredStatus(channelId || '', contactPhone)
      });
    });

    // Ordenar conversas finais pelo horário da última mensagem
    const sortedConversations = conversations
      .filter(conversation => conversation.last_message && conversation.last_message.trim().length > 0)
      .sort((a, b) => new Date(b.last_message_time || 0).getTime() - new Date(a.last_message_time || 0).getTime());

    return sortedConversations;
  }
}
