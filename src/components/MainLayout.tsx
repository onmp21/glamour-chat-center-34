import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { ChannelsPageLayout } from './ChannelsPageLayout';
import { Dashboard } from './Dashboard';
import { ChatInterface } from './ChatInterface';
import { UnifiedSettings } from './UnifiedSettings';
import { ExamesTable } from './ExamesTable';
import { MobileNavigation } from './MobileNavigation';
import { ChannelsGrid } from './chat/ChannelsGrid';
import { SEOHead } from './SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { LoginForm } from './LoginForm';

export const MainLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const { isAuthenticated } = useAuth();
  const { isMobile } = useResponsive();

  // Memoize chat channels list for performance
  const chatChannels = useMemo(() => [
    'chat', 'canarana', 'souto-soares', 'joao-dourado', 
    'america-dourada', 'gerente-lojas', 'gerente-externo', 'pedro'
  ], []);

  // Memoize SEO config based on active section
  const seoConfig = useMemo(() => {
    const configs = {
      dashboard: {
        title: 'Painel de Controle',
        description: 'Central de controle do Glamour Chat Center. Gerencie conversas, monitore estatísticas e acesse todas as funcionalidades.',
        keywords: 'painel controle, chat center, gestão conversas, atendimento cliente'
      },
      channels: {
        title: 'Canais de Atendimento',
        description: 'Acesse todos os canais de atendimento disponíveis. Gerencie conversas por WhatsApp e outros canais de comunicação.',
        keywords: 'canais atendimento, whatsapp, comunicação, chat'
      },
      exames: {
        title: 'Gestão de Exames',
        description: 'Sistema completo para gestão de exames médicos. Consulte, edite e monitore exames de forma eficiente.',
        keywords: 'gestão exames, exames médicos, sistema médico'
      },
      settings: {
        title: 'Configurações',
        description: 'Configure suas preferências, gerencie usuários e personalize o sistema conforme suas necessidades.',
        keywords: 'configurações, preferências, gestão usuários, personalização'
      }
    };

    return configs[activeSection as keyof typeof configs] || configs.dashboard;
  }, [activeSection]);

  if (!isAuthenticated) {
    return (
      <SEOHead 
        title="Login"
        description="Acesse o Glamour Chat Center. Sistema profissional de gestão de atendimento e comunicação."
        keywords="login, acesso, glamour chat center, atendimento"
      >
        <LoginForm />
      </SEOHead>
    );
  }

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleNavigateToChannel = (channelId: string) => {
    console.log('MainLayout: Navegando para canal:', channelId);
    setActiveSection(channelId);
    setIsSidebarCollapsed(true);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    
    if (!chatChannels.includes(section) && isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
    }
    else if (chatChannels.includes(section)) {
      setIsSidebarCollapsed(true);
    }
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <main role="main" aria-label="Painel de controle">
            <h1 className="sr-only">Painel de Controle - Glamour Chat Center</h1>
            <Dashboard isDarkMode={isDarkMode} onSectionSelect={handleSectionChange} />
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
              <ChannelsPageLayout isDarkMode={isDarkMode} />
            ) : (
              <ChannelsGrid 
                isDarkMode={isDarkMode} 
                onChannelSelect={handleNavigateToChannel}
              />
            )}
          </main>
        );
      case 'chat':
      case 'canarana':
      case 'souto-soares':
      case 'joao-dourado':
      case 'america-dourada':
      case 'gerente-lojas':
      case 'gerente-externo':
      case 'pedro':
        return (
          <main role="main" aria-label="Interface de chat">
            <h1 className="sr-only">Chat - {activeSection}</h1>
            <ChatInterface 
              isDarkMode={isDarkMode} 
              activeChannel={activeSection}
              toggleDarkMode={toggleDarkMode}
              onToggleSidebar={toggleSidebarCollapse}
            />
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
        return (
          <main role="main" aria-label="Painel de controle">
            <h1 className="sr-only">Painel de Controle - Glamour Chat Center</h1>
            <Dashboard isDarkMode={isDarkMode} onSectionSelect={handleSectionChange} />
          </main>
        );
    }
  };

  const getMainMarginLeft = () => {
    return isSidebarVisible ? (isSidebarCollapsed ? 64 : 256) : 0;
  };

  return (
    <SEOHead {...seoConfig}>
      <div className={cn(
        "flex h-screen transition-colors overflow-hidden",
        isDarkMode && "dark"
      )} style={{
        backgroundColor: isDarkMode ? 'hsl(var(--background))' : '#f9fafb'
      }}>
        <nav role="navigation" aria-label="Menu principal">
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={handleSectionChange}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            isVisible={isSidebarVisible}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
          />
        </nav>
        
        <div className="flex-1 overflow-auto">
          <div className="h-full">
            {renderContent()}
          </div>
        </div>
        
        <nav role="navigation" aria-label="Navegação mobile" className="md:hidden">
          <MobileNavigation
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            isDarkMode={isDarkMode}
          />
        </nav>
      </div>
    </SEOHead>
  );
};
