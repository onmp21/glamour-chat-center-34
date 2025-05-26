
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';
import { MobileChannelsList } from './chat/MobileChannelsList';
import { MobileConversationsList } from './chat/MobileConversationsList';
import { MobileChatView } from './chat/MobileChatView';
import { MobileSettings } from './MobileSettings';
import { WhatsAppChat } from './chat/WhatsAppChat';

interface ChatInterfaceProps {
  isDarkMode: boolean;
  activeChannel: string;
  showMobileSettings?: boolean;
  onCloseMobileSettings?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isDarkMode,
  activeChannel,
  showMobileSettings = false,
  onCloseMobileSettings
}) => {
  const { user } = useAuth();
  const { conversations, getTabConversations, activeConversation, setActiveConversation, updateConversationStatus } = useChat();
  const [mobileView, setMobileView] = useState<'channels' | 'conversations' | 'chat' | 'settings'>('channels');
  const [mobileChannelId, setMobileChannelId] = useState<string | null>(null);
  const [mobileConversationId, setMobileConversationId] = useState<string | null>(null);

  // Controlar exibição das configurações mobile
  useEffect(() => {
    if (showMobileSettings) {
      setMobileView('settings');
    }
  }, [showMobileSettings]);

  // Auto-select first conversation when channel changes
  useEffect(() => {
    const channelConversations = getTabConversations(activeChannel);
    if (channelConversations.length > 0 && !activeConversation) {
      setActiveConversation(channelConversations[0].id);
    }
  }, [activeChannel, getTabConversations, activeConversation, setActiveConversation]);

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

  const handleBackFromSettings = () => {
    setMobileView('channels');
    if (onCloseMobileSettings) {
      onCloseMobileSettings();
    }
  };

  const mobileConversations = mobileChannelId ? getTabConversations(mobileChannelId) : [];

  return (
    <div className={cn(
      "relative h-screen",
      isDarkMode ? "bg-zinc-950" : "bg-gray-50"
    )}>
      {/* MOBILE: apenas mobile */}
      <div className="md:hidden w-full h-full absolute top-0 left-0 bg-inherit">
        {mobileView === 'settings' && (
          <MobileSettings isDarkMode={isDarkMode} />
        )}
        
        {mobileView === 'channels' && !showMobileSettings && (
          <MobileChannelsList 
            isDarkMode={isDarkMode}
            onChannelSelect={handleMobileChannelSelect}
          />
        )}
        
        {mobileView === 'conversations' && (
          <MobileConversationsList
            isDarkMode={isDarkMode}
            mobileChannelId={mobileChannelId}
            onBack={handleBackFromSettings}
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

      {/* DESKTOP/WEB: Interface estilo WhatsApp com esquema monocromático */}
      <div className="hidden md:flex h-full w-full">
        <WhatsAppChat
          isDarkMode={isDarkMode}
          channelId={activeChannel}
        />
      </div>
    </div>
  );
};
