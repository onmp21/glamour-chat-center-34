
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { ChannelsSidebar } from './ChannelsSidebar';
import { ChannelsVerticalSidebar } from './ChannelsVerticalSidebar';
import { Dashboard } from './Dashboard';
import { ChatInterface } from './ChatInterface';
import { UnifiedSettings } from './UnifiedSettings';
import { ExamesTable } from './ExamesTable';
import { MobileNavigation } from './MobileNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from './LoginForm';

export const MainLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Inicializa o tema do localStorage, se disponível
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const { isAuthenticated } = useAuth();

  // Se não está autenticado, mostra a tela de login
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleNavigateToChannel = (channelId: string) => {
    console.log('MainLayout: Navegando para canal:', channelId);
    setActiveSection(channelId);
    setIsSidebarCollapsed(true); // Colapsar sidebar ao entrar em canal
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    
    // Lista de canais de chat
    const chatChannels = ['chat', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'gerente-lojas', 'gerente-externo', 'pedro'];
    
    // Se está saindo de um canal de chat para outra seção, expandir sidebar
    if (!chatChannels.includes(section) && isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
    }
    // Se está entrando em canal de chat, colapsar sidebar
    else if (chatChannels.includes(section)) {
      setIsSidebarCollapsed(true);
    }
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // ChannelsSidebar deve aparecer APENAS na seção "channels"
  const shouldShowChannelsSidebar = activeSection === 'channels';
  
  // ChannelsVerticalSidebar deve aparecer em todas as páginas EXCETO quando já estiver em chat
  const chatChannels = ['chat', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'gerente-lojas', 'gerente-externo', 'pedro'];
  const shouldShowVerticalChannelsSidebar = !chatChannels.includes(activeSection);

  const renderContent = () => {
    // Detectar se está em mobile (usando window.innerWidth)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    switch (activeSection) {
      case 'dashboard':
        return <Dashboard isDarkMode={isDarkMode} onNavigateToChannel={handleNavigateToChannel} />;
      case 'exames':
        return <ExamesTable isDarkMode={isDarkMode} />;
      case 'channels':
        // Quando na seção channels, mostrar uma tela vazia ou uma mensagem
        return (
          <div className="flex items-center justify-center h-full">
            <div className={cn(
              "text-center p-8",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              <h2 className="text-2xl font-bold mb-4">Selecione um Canal</h2>
              <p className="text-gray-500">Escolha um canal na barra lateral para começar a conversar.</p>
            </div>
          </div>
        );
      case 'chat':
      case 'canarana':
      case 'souto-soares':
      case 'joao-dourado':
      case 'america-dourada':
      case 'gerente-lojas':
      case 'gerente-externo':
      case 'pedro':
        return <ChatInterface 
          isDarkMode={isDarkMode} 
          activeChannel={activeSection}
          toggleDarkMode={toggleDarkMode}
          onToggleSidebar={toggleSidebarCollapse}
        />;
      case 'settings':
        return <UnifiedSettings 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode}
          isMobile={isMobile}
        />;
      default:
        return <Dashboard isDarkMode={isDarkMode} onNavigateToChannel={handleNavigateToChannel} />;
    }
  };

  return (
    <div className={cn(
      "flex h-screen transition-colors overflow-hidden",
      isDarkMode && "dark"
    )} style={{
      backgroundColor: isDarkMode ? 'hsl(var(--background))' : '#f9fafb'
    }}>
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isVisible={isSidebarVisible}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />
      
      {/* ChannelsVerticalSidebar - em todas as páginas exceto chat */}
      {shouldShowVerticalChannelsSidebar && (
        <ChannelsVerticalSidebar
          isDarkMode={isDarkMode}
          activeSection={activeSection}
          onChannelSelect={handleNavigateToChannel}
        />
      )}
      
      {/* ChannelsSidebar - apenas quando activeSection for 'channels' */}
      {shouldShowChannelsSidebar && (
        <div className="hidden md:block">
          <ChannelsSidebar
            isDarkMode={isDarkMode}
            activeSection={activeSection}
            onChannelSelect={handleNavigateToChannel}
          />
        </div>
      )}
      
      <main className={cn(
        "flex-1 overflow-auto transition-all duration-300",
        isSidebarVisible ? (isSidebarCollapsed ? "md:ml-16" : "md:ml-64") : "ml-0",
        shouldShowVerticalChannelsSidebar && "md:ml-20" // Adicionar margem para a barra vertical
      )}>
        <div className="h-full" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 64px)' }}>
          {renderContent()}
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <MobileNavigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
