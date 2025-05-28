
import { supabase } from '@/integrations/supabase/client';
import { ChannelService } from './ChannelService';
import { MessageProcessor } from '@/utils/MessageProcessor';
import { parseMessageData } from '@/utils/messageParser';
import { ChannelConversation } from '@/hooks/useChannelConversations';

export class ConversationService {
  private channelService: ChannelService;

  constructor(private channelId: string) {
    this.channelService = new ChannelService(channelId);
  }

  async loadConversations(): Promise<ChannelConversation[]> {
    console.log(`🔍 [CONVERSATIONS] Loading for channel: ${this.channelId}`);
    
    const rawMessages = await this.channelService.fetchMessages();
    
    console.log(`🔍 [CONVERSATIONS] Raw messages from DB:`, rawMessages.length);
    console.log(`🔍 [CONVERSATIONS] Sample raw messages:`, rawMessages.slice(0, 3));
    
    // Filter valid messages using the parser
    const validMessages = rawMessages.filter(message => {
      if (!message.message) {
        console.log(`❌ [CONVERSATIONS] Message ${message.id} - No message field`);
        return false;
      }
      
      const parsedMessage = parseMessageData(message.message);
      if (!parsedMessage) {
        console.log(`❌ [CONVERSATIONS] Message ${message.id} - Parser returned null for:`, JSON.stringify(message.message));
        return false;
      }
      
      const hasValidContent = parsedMessage.content && parsedMessage.content.trim().length > 0;
      if (!hasValidContent) {
        console.log(`❌ [CONVERSATIONS] Message ${message.id} - No valid content. Content was:`, JSON.stringify(parsedMessage.content));
        return false;
      }
      
      console.log(`✅ [CONVERSATIONS] Message ${message.id} - Valid! Content: "${parsedMessage.content.slice(0, 50)}..."`);
      return true;
    });
    
    console.log(`📊 [CONVERSATIONS] Filtered ${validMessages.length} valid messages from ${rawMessages.length} total messages`);
    
    if (validMessages.length === 0) {
      console.log(`⚠️ [CONVERSATIONS] NO VALID MESSAGES FOUND for channel ${this.channelId}`);
      return [];
    }
    
    const groupedConversations = MessageProcessor.groupMessagesByPhone(validMessages);
    console.log(`📊 [CONVERSATIONS] Grouped into ${groupedConversations.length} conversations`);
    
    // Add unread count for each conversation
    const conversationsWithUnreadCount = await Promise.all(
      groupedConversations.map(async (conversation) => {
        try {
          const { data: unreadCount } = await supabase
            .rpc('count_unread_messages', {
              table_name: this.channelService.getTableName(),
              p_session_id: conversation.contact_phone
            });

          return {
            ...conversation,
            unread_count: unreadCount || 0
          };
        } catch (error) {
          console.error('Error counting unread messages:', error);
          return {
            ...conversation,
            unread_count: 0
          };
        }
      })
    );
    
    console.log(`✅ [CONVERSATIONS] Final result: ${conversationsWithUnreadCount.length} conversations with unread counts`);
    return conversationsWithUnreadCount;
  }

  async updateConversationStatus(
    conversationId: string, 
    status: 'unread' | 'in_progress' | 'resolved'
  ): Promise<void> {
    console.log(`🔄 Updating conversation ${conversationId} status to ${status}`);
    
    // Mark messages as read if the status is 'in_progress' or 'resolved'
    if (status === 'in_progress' || status === 'resolved') {
      await supabase.rpc('mark_messages_as_read', {
        table_name: this.channelService.getTableName(),
        p_session_id: conversationId
      });
    }
    
    console.log('✅ Conversation status updated');
  }
}
