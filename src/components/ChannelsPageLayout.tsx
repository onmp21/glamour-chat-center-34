
import React, { useState } from 'react';
import { ChannelsVerticalSidebar } from './ChannelsVerticalSidebar';
import { ConversationsList } from './chat/ConversationsList';
import { cn } from '@/lib/utils';

interface ChannelsPageLayoutProps {
  isDarkMode: boolean;
}

export const ChannelsPageLayout: React.FC<ChannelsPageLayoutProps> = ({
  isDarkMode
}) => {
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  const handleChannelSelect = (channelId: string) => {
    console.log('Channel selected:', channelId);
    setSelectedChannelId(channelId);
    setActiveConversation(null); // Reset active conversation when changing channels
  };

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversation(conversationId);
  };

  return (
    <div className={cn(
      "flex h-full",
      isDarkMode ? "bg-[#09090b]" : "bg-white"
    )}>
      {/* Sidebar vertical de canais */}
      <ChannelsVerticalSidebar
        isDarkMode={isDarkMode}
        activeSection={selectedChannelId || ''}
        onChannelSelect={handleChannelSelect}
      />
      
      {/* Lista de conversas do canal selecionado */}
      <div className="flex-1">
        {selectedChannelId ? (
          <ConversationsList
            channelId={selectedChannelId}
            activeConversation={activeConversation}
            onConversationSelect={handleConversationSelect}
            isDarkMode={isDarkMode}
          />
        ) : (
          <div className={cn(
            "flex items-center justify-center h-full",
            isDarkMode ? "bg-[#09090b]" : "bg-white"
          )}>
            <div className="text-center">
              <h3 className={cn(
                "text-lg font-medium mb-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Selecione um Canal
              </h3>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>
                Escolha um canal na barra lateral para ver suas conversas
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
