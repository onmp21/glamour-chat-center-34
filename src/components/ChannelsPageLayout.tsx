import React, { useState } from 'react';
import { ConversationsList } from './chat/ConversationsList';
import { ChannelsSidebar } from './ChannelsSidebar';
import { cn } from '@/lib/utils';

interface ChannelsPageLayoutProps {
  isDarkMode: boolean;
  onSectionChange: (section: string) => void; // Adicionar prop para mudar a seção
}

export const ChannelsPageLayout: React.FC<ChannelsPageLayoutProps> = ({
  isDarkMode,
  onSectionChange // Receber a prop
}) => {
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  // Remover estado local de activeConversation, pois a navegação mudará a seção
  // const [activeConversation, setActiveConversation] = useState<string | null>(null);

  const handleChannelSelect = (channelId: string) => {
    console.log('Channel selected in ChannelsPageLayout:', channelId);
    setSelectedChannelId(channelId);
    // setActiveConversation(null); // Não é mais necessário
  };

  const handleConversationSelect = (conversationId: string) => {
    // Ao selecionar uma conversa, navegar para a seção de chat correspondente
    if (selectedChannelId) {
      console.log(`Conversation ${conversationId} selected in channel ${selectedChannelId}. Navigating...`);
      // TODO: Idealmente, passar o conversationId para o ChatInterface abrir diretamente
      // Por agora, apenas navegar para o canal correto
      onSectionChange(selectedChannelId);
    } else {
      console.error('Cannot select conversation without a selected channel.');
    }
  };

  return (
    <div className={cn(
      "flex h-full flex-col",
      isDarkMode ? "bg-[#09090b]" : "bg-white"
    )}>
      {/* Grid de canais no topo */}
      <div className={cn(
        "border-b",
        isDarkMode ? "border-[#3f3f46]" : "border-gray-200"
      )}>
        <ChannelsSidebar
          isDarkMode={isDarkMode}
          activeSection={selectedChannelId || ''} // Manter destaque no canal selecionado
          onChannelSelect={handleChannelSelect}
        />
      </div>
      
      {/* Lista de conversas do canal selecionado */}
      <div className="flex-1 overflow-y-auto"> {/* Adicionar overflow-y-auto aqui */}
        {selectedChannelId ? (
          <ConversationsList
            channelId={selectedChannelId}
            // activeConversation={activeConversation} // Remover prop, não é mais gerenciado aqui
            onConversationSelect={handleConversationSelect} // Esta função agora navega
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
                Escolha um canal acima para ver suas conversas
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

