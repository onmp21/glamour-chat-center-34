
import React, { useMemo } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { ChatInterface } from '@/components/ChatInterface';
import { UnifiedSettings } from '@/components/UnifiedSettings';
import { ExamesTable } from '@/components/ExamesTable';
import { ChannelsPageLayout } from '@/components/ChannelsPageLayout';
import { ReportsNew } from '@/components/reports/ReportsNew';
import { Tags } from '@/components/Tags';
import { useResponsive } from '@/hooks/useResponsive';

interface ContentRendererProps {
  activeSection: string;
  isDarkMode: boolean;
  onSectionChange: (section: string) => void;
  toggleDarkMode: () => void;
  onToggleSidebar: () => void;
  targetConversationId: string | null;
  setTargetConversationId: (id: string | null) => void;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  activeSection,
  isDarkMode,
  onSectionChange,
  toggleDarkMode,
  onToggleSidebar,
  targetConversationId,
  setTargetConversationId
}) => {
  const { isMobile } = useResponsive();

  const chatChannels = useMemo(() => [
    'chat', 'yelena', 'canarana', 'souto-soares', 'joao-dourado',
    'america-dourada', 'gerente-lojas', 'gerente-externo', 'pedro'
  ], []);

  const handleNavigateToChat = (channelId: string, conversationId: string) => {
    console.log(`[ContentRenderer] Navigating to channel: ${channelId}, conversation: ${conversationId}`);
    setTargetConversationId(conversationId);
    onSectionChange(channelId);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        setTargetConversationId(null);
        return (
          <main role="main" aria-label="Painel de controle">
            <h1 className="sr-only">Painel de Controle - Villa Glamour</h1>
            <Dashboard isDarkMode={isDarkMode} onSectionSelect={onSectionChange} />
          </main>
        );
      case 'exames':
        setTargetConversationId(null);
        return (
          <main role="main" aria-label="Gestão de exames">
            <h1 className="sr-only">Gestão de Exames Médicos</h1>
            <ExamesTable isDarkMode={isDarkMode} />
          </main>
        );
      case 'reports':
        setTargetConversationId(null);
        return (
          <main role="main" aria-label="Relatórios">
            <h1 className="sr-only">Relatórios do Sistema</h1>
            <ReportsNew isDarkMode={isDarkMode} />
          </main>
        );
      case 'tags':
        setTargetConversationId(null);
        return (
          <main role="main" aria-label="Tags de Contatos">
            <h1 className="sr-only">Gerenciamento de Tags</h1>
            <Tags isDarkMode={isDarkMode} />
          </main>
        );
      case 'channels':
        setTargetConversationId(null);
        return (
          <main role="main" aria-label="Canais de atendimento">
            <h1 className="sr-only">Canais de Atendimento</h1>
            {isMobile ? (
              <ChatInterface
                isDarkMode={isDarkMode}
                activeChannel="channels"
                toggleDarkMode={toggleDarkMode}
                onToggleSidebar={onToggleSidebar}
                initialConversationId={null}
              />
            ) : (
              <ChannelsPageLayout
                isDarkMode={isDarkMode}
                onNavigateToChat={handleNavigateToChat}
              />
            )}
          </main>
        );
      case 'settings':
        setTargetConversationId(null);
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
        if (chatChannels.includes(activeSection)) {
          const initialConvId = targetConversationId;
          if (initialConvId) {
            console.log(`[ContentRenderer] Rendering ChatInterface for ${activeSection} with initialConversationId: ${initialConvId}`);
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
                initialConversationId={initialConvId}
              />
            </main>
          );
        }
        setTargetConversationId(null);
        return (
          <main role="main" aria-label="Painel de controle">
            <h1 className="sr-only">Painel de Controle - Villa Glamour</h1>
            <Dashboard isDarkMode={isDarkMode} onSectionSelect={onSectionChange} />
          </main>
        );
    }
  };

  return renderContent();
};
