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

  // A função groupMessagesByPhone também usa a lógica de nome, 
  // mas parece ser apenas para exibir na lista de conversas, não afeta o alinhamento.
  // Mantendo a lógica original dela por enquanto.
  static groupMessagesByPhone(rawMessages: RawMessage[], channelId?: string): ChannelConversation[] {
    
    const groupedConversations = new Map<string, {
      messages: RawMessage[];
      contactName: string;
      contactPhone: string;
      lastMessage: string;
      lastTimestamp: string;
      lastRawMessage: RawMessage;
    }>();

    const sortedMessages = rawMessages.sort((a, b) => a.id - b.id);

    sortedMessages.forEach((rawMessage) => {
      const messageContent = rawMessage.message?.trim();
      if (!messageContent) {
        return;
      }

      const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
      const contactNameFromDB = rawMessage.Nome_do_contato || rawMessage.nome_do_contato;
      const fallbackName = extractNameFromSessionId(rawMessage.session_id);
      const rawContactName = contactNameFromDB || fallbackName;
      
      let contactName = rawContactName;
      // Aplicar lógica de nomes específica por canal para exibição na lista
      if (channelId === 'chat' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') {
        if (!agentNames.includes(contactNameFromDB || '')) { // Verifica se NÃO é agente
          contactName = rawContactName || 'Pedro Vila Nova';
        }
      } else if (channelId === 'gerente-externo' || channelId === 'd2892900-ca8f-4b08-a73f-6b7aa5866ff7') {
        if (!agentNames.includes(contactNameFromDB || '')) { // Verifica se NÃO é agente
          contactName = rawContactName || `Cliente ${contactPhone.slice(-4)}`;
        }
      } else {
         if (!agentNames.includes(contactNameFromDB || '')) { // Verifica se NÃO é agente
            contactName = rawContactName || 'Cliente';
         }
      }


      if (!groupedConversations.has(contactPhone)) {
        groupedConversations.set(contactPhone, {
          messages: [],
          contactName,
          contactPhone,
          lastMessage: messageContent,
          // ATENÇÃO: Usar timestamp real da última mensagem
          lastTimestamp: rawMessage.read_at || rawMessage.created_at || new Date().toISOString(), 
          lastRawMessage: rawMessage
        });
      }

      const group = groupedConversations.get(contactPhone)!;
      group.messages.push(rawMessage);

      // Usar ID para determinar a última mensagem, mas timestamp real para exibição
      if (rawMessage.id >= group.lastRawMessage.id) {
        group.lastMessage = messageContent;
        group.lastTimestamp = rawMessage.created_at || new Date().toISOString(); 
        group.lastRawMessage = rawMessage;
        group.contactName = contactName; // Atualizar nome caso a última msg defina melhor
      }
    });

    const result = Array.from(groupedConversations.entries())
      .map(([phone, group]) => ({
        id: phone,
        contact_name: group.contactName,
        contact_phone: phone,
        last_message: group.lastMessage,
        last_message_time: group.lastTimestamp, // Usar timestamp real
        status: 'unread' as const,
        assigned_to: null,
        created_at: group.lastTimestamp, // Usar timestamp real
        updated_at: group.lastTimestamp // Usar timestamp real
      }))
      .filter(conversation => conversation.last_message && conversation.last_message.trim().length > 0)
      .sort((a, b) => new Date(b.last_message_time || 0).getTime() - new Date(a.last_message_time || 0).getTime());

    
    return result;
  }
}

// Definir agentNames fora da classe para ser acessível em groupMessagesByPhone também
const agentNames = ["Óticas Villa Glamour", "andressa"];

