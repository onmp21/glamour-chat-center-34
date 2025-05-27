
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { MobileChannelsList } from './chat/MobileChannelsList';
import { MobileConversationsList } from './chat/MobileConversationsList';
import { MobileChatView } from './chat/MobileChatView';
import { UnifiedSettings } from './UnifiedSettings';
import { WhatsAppChat } from './chat/WhatsAppChat';

interface ChatInterfaceProps {
  isDarkMode: boolean;
  activeChannel: string;
  showMobileSettings?: boolean;
  onCloseMobileSettings?: () => void;
  toggleDarkMode?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isDarkMode,
  activeChannel,
  showMobileSettings = false,
  onCloseMobileSettings,
  toggleDarkMode = () => {}
}) => {
  const { user } = useAuth();
  const [mobileView, setMobileView] = useState<'channels' | 'conversations' | 'chat' | 'settings'>('channels');
  const [mobileChannelId, setMobileChannelId] = useState<string | null>(null);
  const [mobileConversationId, setMobileConversationId] = useState<string | null>(null);

  // Controlar exibição das configurações mobile
  useEffect(() => {
    if (showMobileSettings) {
      setMobileView('settings');
    }
  }, [showMobileSettings]);

  const handleMobileChannelSelect = (channelId: string) => {
    setMobileChannelId(channelId);
    setMobileView('conversations');
  };

  const handleMobileConversationSelect = (conversationId: string) => {
    setMobileConversationId(conversationId);
    setMobileView('chat');
  };

  const handleBackFromSettings = () => {
    setMobileView('channels');
    if (onCloseMobileSettings) {
      onCloseMobileSettings();
    }
  };

  return (
    <div className={cn(
      "relative h-screen",
      isDarkMode ? "bg-zinc-950" : "bg-gray-50"
    )}>
      {/* MOBILE: apenas mobile */}
      <div className="md:hidden w-full h-full absolute top-0 left-0 bg-inherit">
        {mobileView === 'settings' && (
          <UnifiedSettings 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode}
            isMobile={true}
          />
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
            onBack={() => setMobileView('conversations')}
            channelId={mobileChannelId}
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
