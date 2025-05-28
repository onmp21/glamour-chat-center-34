
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

  // ChannelsVerticalSidebar deve aparecer APENAS na seção "channels"
  const shouldShowVerticalChannelsSidebar = activeSection === 'channels';

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
      
      {/* ChannelsVerticalSidebar - APENAS na seção "channels" */}
      {shouldShowVerticalChannelsSidebar && (
        <ChannelsVerticalSidebar
          isDarkMode={isDarkMode}
          activeSection={activeSection}
          onChannelSelect={handleNavigateToChannel}
        />
      )}
      
      <main className={cn(
        "flex-1 overflow-auto transition-all duration-300",
        // Margem reduzida da sidebar principal - espaçamento mínimo
        isSidebarVisible ? (isSidebarCollapsed ? "md:ml-16" : "md:ml-64") : "ml-0",
        // Margem adicional da barra vertical APENAS quando está visível (seção channels) - sem espaçamento extra
        shouldShowVerticalChannelsSidebar && "md:ml-0"
      )} style={{
        marginLeft: isSidebarVisible ? 
          (isSidebarCollapsed ? 
            (shouldShowVerticalChannelsSidebar ? '112px' : '64px') : 
            (shouldShowVerticalChannelsSidebar ? '312px' : '256px')
          ) : 
          (shouldShowVerticalChannelsSidebar ? '56px' : '0px')
      }}>
        <div className="h-full">
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
