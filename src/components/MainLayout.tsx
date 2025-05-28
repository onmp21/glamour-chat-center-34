
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
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const { isAuthenticated } = useAuth();

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
    setIsSidebarCollapsed(true);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    
    const chatChannels = ['chat', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'gerente-lojas', 'gerente-externo', 'pedro'];
    
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

  // ChannelsVerticalSidebar deve aparecer em todas as páginas EXCETO quando já estiver em chat
  const chatChannels = ['chat', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'gerente-lojas', 'gerente-externo', 'pedro'];
  const shouldShowVerticalChannelsSidebar = !chatChannels.includes(activeSection);

  const renderContent = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    switch (activeSection) {
      case 'dashboard':
        return <Dashboard isDarkMode={isDarkMode} onNavigateToChannel={handleNavigateToChannel} />;
      case 'exames':
        return <ExamesTable isDarkMode={isDarkMode} />;
      case 'channels':
        return <ChannelsSidebar
          isDarkMode={isDarkMode}
          activeSection={activeSection}
          onChannelSelect={handleNavigateToChannel}
        />;
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
      
      <main className={cn(
        "flex-1 overflow-auto transition-all duration-300",
        // Reduzir espaçamento: mudando de ml-64 para ml-56 e de ml-16 para ml-12
        isSidebarVisible ? (isSidebarCollapsed ? "md:ml-12" : "md:ml-56") : "ml-0",
        // Reduzir margem da barra vertical: mudando de ml-20 para ml-16
        shouldShowVerticalChannelsSidebar && "md:ml-16"
      )}>
        <div className="h-full" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 64px)' }}>
          {renderContent()}
        </div>
      </main>
      
      <MobileNavigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
