import { MessageProcessor } from './MessageProcessor';
import { ChannelConversation } from '@/hooks/useChannelConversations';

// Keep backward compatibility by wrapping the new MessageProcessor
export const groupMessagesByPhone = (data: any[]): ChannelConversation[] => {
  return MessageProcessor.groupMessagesByPhone(data);
};
