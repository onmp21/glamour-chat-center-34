
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';
import { MobileChannelsList } from './chat/MobileChannelsList';
import { MobileConversationsList } from './chat/MobileConversationsList';
import { MobileChatView } from './chat/MobileChatView';
import { DesktopConversationsList } from './chat/DesktopConversationsList';
import { DesktopChatArea } from './chat/DesktopChatArea';

interface ChatInterfaceProps {
  isDarkMode: boolean;
  activeChannel: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isDarkMode,
  activeChannel
}) => {
  const { user } = useAuth();
  const { conversations, getTabConversations, activeConversation, setActiveConversation, updateConversationStatus } = useChat();
  const [mobileView, setMobileView] = useState<'channels' | 'conversations' | 'chat'>('channels');
  const [mobileChannelId, setMobileChannelId] = useState<string | null>(null);
  const [mobileConversationId, setMobileConversationId] = useState<string | null>(null);

  // Auto-mark conversation as read when opened
  useEffect(() => {
    if (activeConversation) {
      const conversation = conversations.find(c => c.id === activeConversation);
      if (conversation && conversation.status === 'unread') {
        updateConversationStatus(activeConversation, 'in_progress');
      }
    }
  }, [activeConversation, conversations, updateConversationStatus]);

  const handleMobileChannelSelect = (channelId: string) => {
    setMobileChannelId(channelId);
    setMobileView('conversations');
  };

  const handleMobileConversationSelect = (conversationId: string) => {
    setMobileConversationId(conversationId);
    setActiveConversation(conversationId);
    setMobileView('chat');
  };

  const mobileConversations = mobileChannelId ? getTabConversations(mobileChannelId) : [];

  return (
    <div className={cn(
      "relative h-screen",
      isDarkMode ? "dark-bg-primary" : "bg-gray-50"
    )}>
      {/* MOBILE: apenas mobile */}
      <div className="md:hidden w-full h-full absolute top-0 left-0 bg-inherit">
        {mobileView === 'channels' && (
          <MobileChannelsList 
            isDarkMode={isDarkMode}
            onChannelSelect={handleMobileChannelSelect}
          />
        )}
        
        {mobileView === 'conversations' && (
          <MobileConversationsList
            isDarkMode={isDarkMode}
            mobileChannelId={mobileChannelId}
            onBack={() => setMobileView('channels')}
            onConversationSelect={handleMobileConversationSelect}
          />
        )}
        
        {mobileView === 'chat' && (
          <MobileChatView
            isDarkMode={isDarkMode}
            mobileConversationId={mobileConversationId}
            mobileConversations={mobileConversations}
            onBack={() => setMobileView('conversations')}
          />
        )}
      </div>

      {/* DESKTOP/WEB: Interface mais limpa e moderna */}
      <div className="hidden md:flex h-full w-full flex-row">
        <DesktopConversationsList
          isDarkMode={isDarkMode}
          activeChannel={activeChannel}
          activeConversation={activeConversation}
          onConversationSelect={setActiveConversation}
        />

        <DesktopChatArea
          isDarkMode={isDarkMode}
          activeConversation={activeConversation}
          conversations={conversations}
          updateConversationStatus={updateConversationStatus}
          setActiveConversation={setActiveConversation}
        />
      </div>
    </div>
  );
};
