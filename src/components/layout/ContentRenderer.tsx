import React, { useMemo, useState } from 'react'; // Adicionar useState
import { Dashboard } from '@/components/Dashboard';
import { ChatInterface } from '@/components/ChatInterface';
import { UnifiedSettings } from '@/components/UnifiedSettings';
import { ExamesTable } from '@/components/ExamesTable';
import { ChannelsPageLayout } from '@/components/ChannelsPageLayout';
import { useResponsive } from '@/hooks/useResponsive';

interface ContentRendererProps {
  activeSection: string;
  isDarkMode: boolean;
  onSectionChange: (section: string) => void;
  toggleDarkMode: () => void;
  onToggleSidebar: () => void;
  // Adicionar estado e função para navegação direta ao chat
  targetConversationId: string | null;
  setTargetConversationId: (id: string | null) => void;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  activeSection,
  isDarkMode,
  onSectionChange,
  toggleDarkMode,
  onToggleSidebar,
  targetConversationId, // Receber estado
  setTargetConversationId // Receber função para atualizar estado
}) => {
  const { isMobile } = useResponsive();

  const chatChannels = useMemo(() => [
    'chat', 'canarana', 'souto-soares', 'joao-dourado',
    'america-dourada', 'gerente-lojas', 'gerente-externo', 'pedro'
  ], []);

  // Função para ser passada ao ChannelsPageLayout
  const handleNavigateToChat = (channelId: string, conversationId: string) => {
    console.log(`[ContentRenderer] Navigating to channel: ${channelId}, conversation: ${conversationId}`);
    setTargetConversationId(conversationId); // Armazena o ID da conversa alvo
    onSectionChange(channelId); // Muda a seção ativa para o canal
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        setTargetConversationId(null); // Limpa o ID alvo ao sair de um chat
        return (
          <main role="main" aria-label="Painel de controle">
            <h1 className="sr-only">Painel de Controle - Glamour Chat Center</h1>
            <Dashboard isDarkMode={isDarkMode} onSectionSelect={onSectionChange} />
          </main>
        );
      case 'exames':
        setTargetConversationId(null); // Limpa o ID alvo
        return (
          <main role="main" aria-label="Gestão de exames">
            <h1 className="sr-only">Gestão de Exames Médicos</h1>
            <ExamesTable isDarkMode={isDarkMode} />
          </main>
        );
      case 'channels':
        setTargetConversationId(null); // Limpa o ID alvo
        return (
          <main role="main" aria-label="Canais de atendimento">
            <h1 className="sr-only">Canais de Atendimento</h1>
            {isMobile ? (
              // Mobile ainda usa a lógica antiga de navegação interna
              <ChatInterface
                isDarkMode={isDarkMode}
                activeChannel="channels"
                toggleDarkMode={toggleDarkMode}
                onToggleSidebar={onToggleSidebar}
                initialConversationId={null} // Mobile não usa navegação direta por aqui
              />
            ) : (
              <ChannelsPageLayout
                isDarkMode={isDarkMode}
                onNavigateToChat={handleNavigateToChat} // Passar a função de navegação
              />
            )}
          </main>
        );
      case 'settings':
        setTargetConversationId(null); // Limpa o ID alvo
        return (
          <main role="main" aria-label="Configurações do sistema">
            <h1 className="sr-only">Configurações</h1>
            <UnifiedSettings
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              isMobile={isMobile}
            />
          </main>
        );
      default:
        // Handle chat channels
        if (chatChannels.includes(activeSection)) {
          // Ao renderizar o chat, passa o ID da conversa alvo (se houver)
          // e depois limpa o ID alvo para não afetar navegações futuras
          const initialConvId = targetConversationId;
          if (initialConvId) {
            console.log(`[ContentRenderer] Rendering ChatInterface for ${activeSection} with initialConversationId: ${initialConvId}`);
            // Limpar após usar para não persistir entre navegações manuais
            // Usar setTimeout para garantir que a prop seja passada antes de limpar
            setTimeout(() => setTargetConversationId(null), 0);
          }
          return (
            <main role="main" aria-label="Interface de chat">
              <h1 className="sr-only">Chat - {activeSection}</h1>
              <ChatInterface
                isDarkMode={isDarkMode}
                activeChannel={activeSection}
                toggleDarkMode={toggleDarkMode}
                onToggleSidebar={onToggleSidebar}
                initialConversationId={initialConvId} // Passar o ID inicial
              />
            </main>
          );
        }
        // Default fallback
        setTargetConversationId(null); // Limpa o ID alvo
        return (
          <main role="main" aria-label="Painel de controle">
            <h1 className="sr-only">Painel de Controle - Glamour Chat Center</h1>
            <Dashboard isDarkMode={isDarkMode} onSectionSelect={onSectionChange} />
          </main>
        );
    }
  };

  return renderContent();
};

