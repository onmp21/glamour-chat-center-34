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
  tipo_remetente?: 'CONTATO_EXTERNO' | 'USUARIO_INTERNO';
  mensagemType?: string;
}

const agentNames = ["Yelena", "andressa", "Atendente"];

export class MessageProcessor {
  static processMessage(rawMessage: RawMessage, channelId?: string): ChannelMessage | null {
    const messageContent = rawMessage.message?.trim();
    if (!messageContent) {
      return null;
    }

    const contactNameFromDB = rawMessage.Nome_do_contato || rawMessage.nome_do_contato;
    const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
    const fallbackName = extractNameFromSessionId(rawMessage.session_id);
    let rawContactName = contactNameFromDB || fallbackName;
    
    // Determinar sender baseado em tipo_remetente ou Nome_do_contato
    let sender: 'customer' | 'agent' = 'customer';
    let contactName = rawContactName;

    // Verificar se existe tipo_remetente explícito
    if (rawMessage.tipo_remetente) {
      sender = rawMessage.tipo_remetente === 'USUARIO_INTERNO' ? 'agent' : 'customer';
    } else if (contactNameFromDB && agentNames.includes(contactNameFromDB)) {
      sender = 'agent';
    }

    // Melhorar a lógica de nomes para diferentes canais
    if (sender === 'customer') {
      if (channelId === 'chat' || channelId === 'yelena' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') {
        // Para Yelena, usar nome específico do contato
        if (rawContactName && rawContactName !== contactPhone && !agentNames.includes(rawContactName)) {
          contactName = rawContactName;
        } else {
          // Extrair nome real do session_id se possível
          const nameFromSession = extractNameFromSessionId(rawMessage.session_id);
          if (nameFromSession && nameFromSession !== contactPhone && !agentNames.includes(nameFromSession)) {
            contactName = nameFromSession;
          } else {
            contactName = 'Cliente Vila Glamour';
          }
        }
      } else if (channelId === '1e233898-5235-40d7-bf9c-55d46e4c16a1' || channelId === 'pedro') {
        contactName = 'Pedro Vila Nova';
      } else {
        // Para outros canais, usar nome real do contato
        if (rawContactName && rawContactName !== contactPhone && !agentNames.includes(rawContactName)) {
          contactName = rawContactName;
        } else {
          contactName = `Cliente ${contactPhone.slice(-4)}`;
        }
      }
    } else {
      // Para agentes
      contactName = contactNameFromDB || 'Atendente';
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

    rawMessages.forEach((rawMessage) => {
      const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
      if (!groupedByPhone.has(contactPhone)) {
        groupedByPhone.set(contactPhone, []);
      }
      groupedByPhone.get(contactPhone)!.push(rawMessage);
    });

    const conversations: ChannelConversation[] = [];

    groupedByPhone.forEach((messagesInGroup, contactPhone) => {
      if (messagesInGroup.length === 0) return;

      const sortedMessagesInGroup = messagesInGroup.sort((a, b) => a.id - b.id);

      // Encontrar o nome real do contato mais recente que não seja de agente
      let actualContactName = `Cliente ${contactPhone.slice(-4)}`;
      
      for (let i = sortedMessagesInGroup.length - 1; i >= 0; i--) {
        const msg = sortedMessagesInGroup[i];
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

      // Aplicar regras específicas por canal
      if (channelId === 'chat' || channelId === 'yelena' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') {
        // Manter nome encontrado ou usar padrão
        if (!actualContactName || actualContactName === `Cliente ${contactPhone.slice(-4)}`) {
          actualContactName = 'Cliente Vila Glamour';
        }
      } else if (channelId === '1e233898-5235-40d7-bf9c-55d46e4c16a1' || channelId === 'pedro') {
        actualContactName = 'Pedro Vila Nova';
      }

      const lastMessage = sortedMessagesInGroup[sortedMessagesInGroup.length - 1];
      const lastMessageContent = lastMessage.message?.trim() || 'Sem mensagens';
      const lastTimestamp = lastMessage.read_at || lastMessage.created_at || new Date().toISOString();
      
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
        status: getStoredStatus(channelId || '', contactPhone),
        updated_at: lastTimestamp
      });
    });

    const sortedConversations = conversations
      .filter(conversation => conversation.last_message && conversation.last_message.trim().length > 0)
      .sort((a, b) => new Date(b.last_message_time || 0).getTime() - new Date(a.last_message_time || 0).getTime());

    return sortedConversations;
  }
}
