
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MobileChatHeader } from './mobile/MobileChatHeader';
import { MobileChatMessages } from './mobile/MobileChatMessages';
import { MobileChatInputBar } from './mobile/MobileChatInputBar';
import { MobileChatModals } from './mobile/MobileChatModals';

interface MobileChatViewProps {
  isDarkMode: boolean;
  mobileConversationId: string | null;
  mobileConversations: any[];
  onBack: () => void;
}

export const MobileChatView: React.FC<MobileChatViewProps> = ({
  isDarkMode,
  mobileConversationId,
  mobileConversations,
  onBack
}) => {
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showContactSettings, setShowContactSettings] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  };

  const conversation = mobileConversations.find(conv => conv.id === mobileConversationId);

  return (
    <div className={cn(
      "flex flex-col h-screen relative overflow-hidden",
      isDarkMode ? "bg-zinc-950" : "bg-gray-50"
    )}>
      <MobileChatHeader
        isDarkMode={isDarkMode}
        conversationName={conversation?.contactName || 'Conversa'}
        onBack={onBack}
        onShowContactDetails={() => setShowContactDetails(true)}
        onShowContactSettings={() => setShowContactSettings(true)}
        onShowMoreOptions={() => setShowMoreOptions(true)}
      />
      
      <div className="flex-1 relative">
        <MobileChatMessages isDarkMode={isDarkMode} />
        <MobileChatInputBar
          isDarkMode={isDarkMode}
          onSendMessage={handleSendMessage}
        />
      </div>

      <MobileChatModals
        isDarkMode={isDarkMode}
        conversation={conversation}
        showContactDetails={showContactDetails}
        showContactSettings={showContactSettings}
        showMoreOptions={showMoreOptions}
        onCloseContactDetails={() => setShowContactDetails(false)}
        onCloseContactSettings={() => setShowContactSettings(false)}
        onCloseMoreOptions={() => setShowMoreOptions(false)}
      />
    </div>
  );
};
