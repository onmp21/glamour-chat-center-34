
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';
import { ChatHeader } from './chat/ChatHeader';
import { ConversationList } from './chat/ConversationList';
import { ChatArea } from './chat/ChatArea';
import { ContactInfo } from './chat/ContactInfo';

interface ChatInterfaceProps {
  isDarkMode: boolean;
  activeChannel: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isDarkMode,
  activeChannel
}) => {
  const { user } = useAuth();
  const { activeConversation, setActiveConversation } = useChat();

  return (
    <div className={cn(
      "h-screen flex flex-col",
      isDarkMode ? "bg-black" : "bg-gray-50"
    )}>
      <ChatHeader isDarkMode={isDarkMode} activeChannel={activeChannel} />

      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        <ConversationList
          isDarkMode={isDarkMode}
          activeChannel={activeChannel}
          activeConversation={activeConversation}
          setActiveConversation={setActiveConversation}
        />

        <ChatArea
          isDarkMode={isDarkMode}
          activeConversation={activeConversation}
        />

        <ContactInfo
          isDarkMode={isDarkMode}
          activeConversation={activeConversation}
        />
      </div>
    </div>
  );
};
