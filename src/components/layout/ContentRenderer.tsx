import React, { useMemo } from 'react';
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
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  activeSection,
  isDarkMode,
  onSectionChange,
  toggleDarkMode,
  onToggleSidebar
}) => {
  const { isMobile } = useResponsive();

  const chatChannels = useMemo(() => [
    'chat', 'canarana', 'souto-soares', 'joao-dourado', 
    'america-dourada', 'gerente-lojas', 'gerente-externo', 'pedro'
  ], []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <main role="main" aria-label="Painel de controle">
            <h1 className="sr-only">Painel de Controle - Glamour Chat Center</h1>
            <Dashboard isDarkMode={isDarkMode} onSectionSelect={onSectionChange} />
          </main>
        );
      case 'exames':
        return (
          <main role="main" aria-label="Gestão de exames">
            <h1 className="sr-only">Gestão de Exames Médicos</h1>
            <ExamesTable isDarkMode={isDarkMode} />
          </main>
        );
      case 'channels':
        return (
          <main role="main" aria-label="Canais de atendimento">
            <h1 className="sr-only">Canais de Atendimento</h1>
            {isMobile ? (
              <ChatInterface 
                isDarkMode={isDarkMode} 
                activeChannel="channels"
                toggleDarkMode={toggleDarkMode}
                onToggleSidebar={onToggleSidebar}
              />
            ) : (
              <ChannelsPageLayout 
                isDarkMode={isDarkMode} 
                onSectionChange={onSectionChange} // Passar onSectionChange
              />
            )}
          </main>
        );
      case 'settings':
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
          return (
            <main role="main" aria-label="Interface de chat">
              <h1 className="sr-only">Chat - {activeSection}</h1>
              <ChatInterface 
                isDarkMode={isDarkMode} 
                activeChannel={activeSection}
                toggleDarkMode={toggleDarkMode}
                onToggleSidebar={onToggleSidebar}
              />
            </main>
          );
        }
        // Default fallback
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

