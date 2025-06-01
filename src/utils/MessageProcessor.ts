
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

    // Usar a nova coluna Nome_do_contato se disponível, senão usar nome_do_contato
    const contactNameFromDB = rawMessage.Nome_do_contato || rawMessage.nome_do_contato;
    
    const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
    const fallbackName = extractNameFromSessionId(rawMessage.session_id);
    let rawContactName = contactNameFromDB || fallbackName;
    
    // Determinar sender baseado em Nome_do_contato
    let sender: 'customer' | 'agent' = 'customer';
    let contactName = rawContactName;

    // Verificar se o nome do contato no banco de dados corresponde a um agente conhecido
    if (contactNameFromDB && agentNames.includes(contactNameFromDB)) {
        sender = 'agent';
        contactName = contactNameFromDB;
    } else {
        sender = 'customer';
        
        // Melhorar a lógica de extração de nomes para diferentes canais
        if (channelId === 'chat' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') {
            // Para Yelena AI, usar nome específico ou extrair do session_id
            if (rawContactName && rawContactName !== contactPhone) {
                contactName = rawContactName;
            } else {
                contactName = 'Cliente Vila Glamour';
            }
        } else if (channelId === 'gerente-externo' || channelId === 'd2892900-ca8f-4b08-a73f-6b7aa5866ff7') {
            // Para gerente externo, usar nome real do contato se disponível
            if (rawContactName && rawContactName !== contactPhone) {
                contactName = rawContactName;
            } else {
                contactName = `Cliente ${contactPhone.slice(-4)}`;
            }
        } else if (channelId === '1e233898-5235-40d7-bf9c-55d46e4c16a1') {
            // Para Pedro, sempre tentar usar o nome real
            if (rawContactName && rawContactName !== contactPhone) {
                contactName = rawContactName;
            } else {
                contactName = 'Pedro Vila Nova';
            }
        } else {
            // Para outros canais, usar nome do contato ou fallback baseado no nome do canal
            if (rawContactName && rawContactName !== contactPhone) {
                contactName = rawContactName;
            } else {
                contactName = 'Cliente';
            }
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

      // Encontrar o nome real do contato mais recente que não seja de agente
      let actualContactName = `Cliente ${contactPhone.slice(-4)}`;
      
      // Procurar de trás para frente para pegar o nome mais recente
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

      // Aplicar regras específicas por canal para nomes padrão
      if (!actualContactName || actualContactName === `Cliente ${contactPhone.slice(-4)}`) {
        if (channelId === 'chat' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') {
          actualContactName = 'Cliente Vila Glamour';
        } else if (channelId === '1e233898-5235-40d7-bf9c-55d46e4c16a1') {
          actualContactName = 'Pedro Vila Nova';
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
        status: getStoredStatus(channelId || '', contactPhone),
        updated_at: lastTimestamp
      });
    });

    // Ordenar conversas finais pelo horário da última mensagem
    const sortedConversations = conversations
      .filter(conversation => conversation.last_message && conversation.last_message.trim().length > 0)
      .sort((a, b) => new Date(b.last_message_time || 0).getTime() - new Date(a.last_message_time || 0).getTime());

    return sortedConversations;
  }
}
