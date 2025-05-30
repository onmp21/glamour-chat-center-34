
import { MessageRepository } from '@/repositories/MessageRepository';
import { MessageProcessor, RawMessage } from '@/utils/MessageProcessor';
import { getTableNameForChannel } from '@/utils/channelMapping';
import { ChannelMessage } from '@/hooks/useChannelMessages';
import { ChannelConversation } from '@/hooks/useChannelConversations';

export class MessageService {
  private repository: MessageRepository;
  private channelId: string;

  constructor(channelId: string) {
    this.channelId = channelId;
    const tableName = getTableNameForChannel(channelId);
    this.repository = new MessageRepository(tableName);
  }

  async getAllMessages(): Promise<ChannelMessage[]> {
    console.log(`🔍 [MESSAGE_SERVICE] Loading all messages for channel: ${this.channelId}`);
    
    const rawMessages = await this.repository.findAll();
    return MessageProcessor.processMessages(rawMessages, this.channelId);
  }

  async getMessagesByConversation(conversationId: string): Promise<ChannelMessage[]> {
    console.log(`🔍 [MESSAGE_SERVICE] Loading messages for conversation: ${conversationId}`);
    
    const rawMessages = await this.repository.findAll();
    const filteredMessages = rawMessages.filter(msg => {
      const phone = this.extractPhoneFromSessionId(msg.session_id);
      return phone === conversationId;
    });
    
    return MessageProcessor.processMessages(filteredMessages, this.channelId);
  }

  async getConversations(): Promise<ChannelConversation[]> {
    console.log(`🔍 [MESSAGE_SERVICE] Loading conversations for channel: ${this.channelId}`);
    
    const rawMessages = await this.repository.findAll();
    return MessageProcessor.groupMessagesByPhone(rawMessages, this.channelId);
  }

  async sendMessage(sessionId: string, content: string, agentName?: string): Promise<RawMessage> {
    console.log(`💾 [MESSAGE_SERVICE] Sending message for channel: ${this.channelId}`);
    
    return await this.repository.insertMessage(sessionId, content, agentName);
  }

  async markConversationAsRead(conversationId: string): Promise<void> {
    console.log(`✅ [MESSAGE_SERVICE] Marking conversation as read: ${conversationId}`);
    
    await this.repository.markAsRead(conversationId);
  }

  createRealtimeSubscription(callback: (payload: any) => void, conversationId?: string) {
    const suffix = conversationId ? `-${conversationId}` : '';
    const channel = this.repository
      .createRealtimeChannel(suffix)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: this.repository.tableName,
        },
        callback
      );

    return channel;
  }

  private extractPhoneFromSessionId(sessionId: string): string {
    // Reutilizar lógica existente do sessionIdParser
    const parts = sessionId.split('-');
    if (parts.length > 1 && /^\d{10,15}$/.test(parts[0])) {
      return parts[0];
    }
    
    const phoneMatch = sessionId.match(/(\d{10,15})/);
    return phoneMatch ? phoneMatch[1] : sessionId;
  }
}
