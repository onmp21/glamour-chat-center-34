
import React, { useState } from 'react';
import { MobileChatHeader } from './mobile/MobileChatHeader';
import { MobileChatMessages } from './mobile/MobileChatMessages';
import { MobileChatInputBar } from './mobile/MobileChatInputBar';
import { MobileChatModals } from './mobile/MobileChatModals';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
import { cn } from '@/lib/utils';

interface MobileChatViewProps {
  isDarkMode: boolean;
  mobileConversationId: string | null;
  onBack: () => void;
  channelId?: string;
}

export const MobileChatView: React.FC<MobileChatViewProps> = ({
  isDarkMode,
  mobileConversationId,
  onBack,
  channelId
}) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);

  // Usar dados reais em vez de fictícios
  const { conversations } = useChannelConversationsRefactored(channelId || '');

  const handleSendMessage = (message: string) => {
    console.log('Enviando mensagem:', message);
    // A mensagem será enviada através do useMessageSender no input bar
  };

  const handleTagSelect = (tag: string) => {
    console.log('Tag selecionada:', tag);
    setShowTagModal(false);
  };

  // Encontrar a conversa atual para obter informações
  const currentConversation = conversations.find(conv => conv.id === mobileConversationId);

  return (
    <div className={cn(
      "relative h-screen overflow-hidden",
      isDarkMode ? "bg-zinc-950" : "bg-gray-50"
    )}>
      <MobileChatHeader
        isDarkMode={isDarkMode}
        onBack={onBack}
        contactName={currentConversation?.contact_name || 'Cliente'}
        contactPhone={currentConversation?.contact_phone || mobileConversationId || ''}
        onContactPress={() => setShowContactModal(true)}
        onInfoPress={() => setShowInfoModal(true)}
        onTagPress={() => setShowTagModal(true)}
      />

      <MobileChatMessages
        isDarkMode={isDarkMode}
        channelId={channelId}
        conversationId={mobileConversationId}
      />

      <MobileChatInputBar
        isDarkMode={isDarkMode}
        onSendMessage={handleSendMessage}
        conversationId={mobileConversationId}
        channelId={channelId}
      />

      <MobileChatModals
        isDarkMode={isDarkMode}
        showContactModal={showContactModal}
        showInfoModal={showInfoModal}
        showTagModal={showTagModal}
        onCloseContactModal={() => setShowContactModal(false)}
        onCloseInfoModal={() => setShowInfoModal(false)}
        onCloseTagModal={() => setShowTagModal(false)}
        onTagSelect={handleTagSelect}
        contactName={currentConversation?.contact_name || 'Cliente'}
        contactPhone={currentConversation?.contact_phone || mobileConversationId || ''}
      />
    </div>
  );
};
