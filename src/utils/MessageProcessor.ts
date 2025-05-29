import { parseMessageData, getChannelSenderName } from './messageParser';
import { extractNameFromSessionId, extractPhoneFromSessionId } from './sessionIdParser';
import { ChannelMessage } from '@/hooks/useChannelMessages';
import { ChannelConversation } from '@/hooks/useChannelConversations';

export interface RawMessage {
  id: number;
  session_id: string;
  message: string; // Agora é sempre string
  Nome_do_contato?: string; // Nova coluna no banco
  nome_do_contato?: string; // Pode variar entre tabelas
  created_at?: string; // Timestamp de criação
  read_at?: string; // Timestamp de leitura/envio a ser usado 
}

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
    

    // --- CORREÇÃO INÍCIO: Determinar sender baseado em Nome_do_contato --- 
    let sender: 'customer' | 'agent' = 'customer'; // Default to customer
    let contactName = rawContactName; // Use the name from DB or fallback initially

    // Lista de nomes conhecidos de agentes
    const agentNames = ["Óticas Villa Glamour", "andressa"];

    // Verificar se o nome do contato no banco de dados corresponde a um agente conhecido
    if (contactNameFromDB && agentNames.includes(contactNameFromDB)) {
        sender = 'agent';
        // Usar o nome específico do agente vindo do banco
        contactName = contactNameFromDB;
    } else {
        // Se não for um agente conhecido, é um cliente
        sender = 'customer';
        // Definir o nome do cliente, aplicando padrões específicos do canal se necessário
        if (channelId === 'chat' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') {
            // Canal Yelena: usar nome do DB/fallback ou "Pedro Vila Nova" como padrão
            contactName = rawContactName || 'Pedro Vila Nova'; 
        } else if (channelId === 'gerente-externo' || channelId === 'd2892900-ca8f-4b08-a73f-6b7aa5866ff7') {
            // Canal Gerente Externo: usar nome do DB/fallback ou padrão com final do telefone
            contactName = rawContactName || `Cliente ${contactPhone.slice(-4)}`; 
        } else {
            // Outros canais: usar nome do DB/fallback ou "Cliente" como padrão
            contactName = rawContactName || 'Cliente'; 
        }
    }
    // --- CORREÇÃO FIM --- 


    // ATENÇÃO: Usar o timestamp real da mensagem se disponível (ex: rawMessage.created_at)
    // A lógica atual com new Date().toISOString() está provavelmente incorreta.
    const messageTimestamp = rawMessage.read_at || rawMessage.created_at || new Date().toISOString();

    return {
      id: rawMessage.id.toString(),
      content: messageContent,
      timestamp: messageTimestamp, // Usar timestamp real
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

  // A função groupMessagesByPhone foi refatorada para determinar corretamente o nome do contato
  static groupMessagesByPhone(rawMessages: RawMessage[], channelId?: string): ChannelConversation[] {
    const groupedByPhone = new Map<string, RawMessage[]>();

    // 1. Agrupar todas as mensagens pelo número de telefone primeiro
    rawMessages.forEach((rawMessage) => {
      const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
      if (!groupedByPhone.has(contactPhone)) {
        groupedByPhone.set(contactPhone, []);
      }
      groupedByPhone.get(contactPhone)!.push(rawMessage);
    });

    const conversations: ChannelConversation[] = [];

    // 2. Processar cada grupo para criar um objeto de conversa
    groupedByPhone.forEach((messagesInGroup, contactPhone) => {
      if (messagesInGroup.length === 0) return;

      // Ordenar mensagens dentro do grupo por ID (assumindo que o ID incrementa de forma confiável)
      const sortedMessagesInGroup = messagesInGroup.sort((a, b) => a.id - b.id);

      // Encontrar o nome real do contato (primeiro nome não-agente encontrado na conversa)
      let actualContactName = `Cliente ${contactPhone.slice(-4)}`; // Fallback padrão
      for (const msg of sortedMessagesInGroup) {
        const nameFromDB = msg.Nome_do_contato || msg.nome_do_contato;
        if (nameFromDB && !agentNames.includes(nameFromDB)) {
          actualContactName = nameFromDB;
          break; // Encontrou o nome do contato
        }
        // Se não houver nome no DB, tentar extrair do session_id como fallback
        const fallbackName = extractNameFromSessionId(msg.session_id);
        if (fallbackName && fallbackName !== contactPhone && !agentNames.includes(fallbackName)) {
           actualContactName = fallbackName;
           // Não interromper imediatamente, preferir nome do DB se encontrado depois
        }
      }
      
      // Aplicar sobreposições específicas do canal se necessário (a lógica acima pode ser suficiente)
      // if (channelId === 'chat' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') {
      //    // Lógica do canal Yelena se necessário
      // }

      const lastMessage = sortedMessagesInGroup[sortedMessagesInGroup.length - 1];
      const lastMessageContent = lastMessage.message?.trim() || 'Sem mensagens';
      // Usar read_at primariamente para timestamp
      const lastTimestamp = lastMessage.read_at || lastMessage.created_at || new Date().toISOString();
      const firstTimestamp = sortedMessagesInGroup[0].read_at || sortedMessagesInGroup[0].created_at || new Date().toISOString(); // Timestamp da primeira mensagem
      // Função auxiliar para obter status do localStorage (replicando lógica do hook)
      const getStoredStatus = (channelId: string, conversationId: string): 'unread' | 'in_progress' | 'resolved' => {
        try {
          const statusKey = `conversation_status_${channelId}_${conversationId}`;
          const savedStatus = localStorage.getItem(statusKey);
          return (savedStatus as 'unread' | 'in_progress' | 'resolved') || 'unread';
        } catch (e) {
          // localStorage pode não estar disponível em alguns ambientes (SSR, etc.)
          return 'unread';
        }
      };

      conversations.push({
        id: contactPhone, // Usar telefone como ID da conversa
        contact_name: actualContactName, // Usar o nome do contato determinado
        contact_phone: contactPhone,
         last_message: lastMessageContent,
        last_message_time: lastTimestamp,
        status: getStoredStatus(channelId || 
, contactPhone) // Obter status do localStorage - Remover vírgula final
        // assigned_to: null, // Remover propriedade desconhecida
        // created_at: firstTimestamp, // Remover propriedade desconhecida
        // updated_at: lastTimestamp // Remover propriedade desconhecidam
      }); // End of conversations.push
    }); // End of groupedByPhone.forEach

    // Ordenar conversas finais pelo horário da última mensagem (fora do forEach)
    const sortedConversations = conversations
      .filter(conversation => conversation.last_message && conversation.last_message.trim().length > 0)
      .sort((a, b) => new Date(b.last_message_time || 0).getTime() - new Date(a.last_message_time || 0).getTime());

    return sortedConversations;
  } // End of groupMessagesByPhone method
} // End of MessageProcessor class

// Definir agentNames fora da classe para ser acessível em groupMessagesByPhone também
const agentNames = ["Óticas Villa Glamour", "andressa"];

