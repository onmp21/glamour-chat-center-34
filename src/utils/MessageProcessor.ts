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
}

export class MessageProcessor {
  static processMessage(rawMessage: RawMessage, channelId?: string): ChannelMessage | null {
    console.log(`🔄 [MESSAGE_PROCESSOR] Processing message ID ${rawMessage.id} from "${rawMessage.session_id}" for channel ${channelId}`);
    
    // Agora message é sempre string
    const messageContent = rawMessage.message?.trim();
    if (!messageContent) {
      console.log(`⚠️ [MESSAGE_PROCESSOR] Message ID ${rawMessage.id} has empty content, ignoring`);
      return null;
    }

    // Usar a nova coluna Nome_do_contato se disponível
    const contactNameFromDB = rawMessage.Nome_do_contato || rawMessage.nome_do_contato;
    
    // Extrair telefone do session_id
    const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
    
    // Se não temos nome no banco, extrair do session_id
    const fallbackName = extractNameFromSessionId(rawMessage.session_id);
    const rawContactName = contactNameFromDB || fallbackName;
    
    console.log(`📱 [MESSAGE_PROCESSOR] Contact info - Phone: "${contactPhone}", Raw Name: "${rawContactName}"`);

    // Determinar se é agente ou cliente baseado no session_id e canal
    let sender: 'customer' | 'agent' = 'customer';
    let contactName = rawContactName;
    
    // Lógica específica por canal
    if (channelId === 'chat' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') {
      // Canal Yelena: mensagens do agente começam com "agent_"
      if (rawMessage.session_id.startsWith('agent_')) {
        sender = 'agent';
        contactName = 'Óticas Villa Glamour';
      } else {
        // Cliente - usar nome do session_id ou "Pedro Vila Nova" como padrão
        contactName = rawContactName || 'Pedro Vila Nova';
      }
    } else if (channelId === 'gerente-externo' || channelId === 'd2892900-ca8f-4b08-a73f-6b7aa5866ff7') {
      // Canal Gerente Externo: mensagens do agente começam com "agent_"
      if (rawMessage.session_id.startsWith('agent_')) {
        sender = 'agent';
        contactName = 'andressa';
      } else {
        // Cliente - usar nome real do session_id, não "andressa"
        contactName = rawContactName || `Cliente ${contactPhone.slice(-4)}`;
      }
    } else {
      // Outros canais: mensagens do agente começam com "agent_"
      if (rawMessage.session_id.startsWith('agent_')) {
        sender = 'agent';
        contactName = 'Atendente';
      } else {
        contactName = rawContactName || 'Cliente';
      }
    }

    console.log(`✅ [MESSAGE_PROCESSOR] Message ID ${rawMessage.id} processed: sender=${sender}, contactName=${contactName}`);

    return {
      id: rawMessage.id.toString(),
      content: messageContent,
      timestamp: new Date().toISOString(),
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
      lastMessage: string;
      lastTimestamp: string;
      lastRawMessage: RawMessage;
    }>();

    const sortedMessages = rawMessages.sort((a, b) => a.id - b.id);

    sortedMessages.forEach((rawMessage) => {
      const messageContent = rawMessage.message?.trim();
      if (!messageContent) {
        console.log(`⚠️ [MESSAGE_PROCESSOR] Ignoring message ID ${rawMessage.id} in grouping - empty content`);
        return;
      }

      const contactPhone = extractPhoneFromSessionId(rawMessage.session_id);
      
      // Usar a nova coluna Nome_do_contato se disponível
      const contactNameFromDB = rawMessage.Nome_do_contato || rawMessage.nome_do_contato;
      const fallbackName = extractNameFromSessionId(rawMessage.session_id);
      const rawContactName = contactNameFromDB || fallbackName;
      
      // Aplicar lógica de nomes específica por canal (sem aplicar mapeamento aqui)
      let contactName = rawContactName;
      
      if (channelId === 'chat' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') {
        // Canal Yelena: usar "Pedro Vila Nova" como padrão para clientes
        if (!rawMessage.session_id.startsWith('agent_')) {
          contactName = rawContactName || 'Pedro Vila Nova';
        }
      } else if (channelId === 'gerente-externo' || channelId === 'd2892900-ca8f-4b08-a73f-6b7aa5866ff7') {
        // Canal Gerente Externo: usar nome real do cliente, não "andressa"
        if (!rawMessage.session_id.startsWith('agent_')) {
          contactName = rawContactName || `Cliente ${contactPhone.slice(-4)}`;
        }
      }

      console.log(`📱 [MESSAGE_PROCESSOR] Grouping message for: ${contactName} (${contactPhone})`);

      if (!groupedConversations.has(contactPhone)) {
        groupedConversations.set(contactPhone, {
          messages: [],
          contactName,
          contactPhone,
          lastMessage: messageContent,
          lastTimestamp: new Date().toISOString(),
          lastRawMessage: rawMessage
        });
        console.log(`➕ [MESSAGE_PROCESSOR] New conversation created for: ${contactPhone}`);
      }

      const group = groupedConversations.get(contactPhone)!;
      group.messages.push(rawMessage);

      if (rawMessage.id >= group.lastRawMessage.id) {
        group.lastMessage = messageContent;
        group.lastTimestamp = new Date().toISOString();
        group.lastRawMessage = rawMessage;
        group.contactName = contactName; // Manter nome consistente
      }
    });

    const result = Array.from(groupedConversations.entries())
      .map(([phone, group]) => ({
        id: phone,
        contact_name: group.contactName,
        contact_phone: phone,
        last_message: group.lastMessage,
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
