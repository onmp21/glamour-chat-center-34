
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
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
    // Detectar se está em canal de chat para colapsar sidebar
    const chatChannels = ['chat', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'gerente-lojas', 'gerente-externo', 'pedro'];
    setIsSidebarCollapsed(chatChannels.includes(section));
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderContent = () => {
    // Detectar se está em mobile (usando window.innerWidth)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    switch (activeSection) {
      case 'dashboard':
        return <Dashboard isDarkMode={isDarkMode} onNavigateToChannel={handleNavigateToChannel} />;
      case 'exames':
        return <ExamesTable isDarkMode={isDarkMode} />;
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
      <main className={cn(
        "flex-1 overflow-auto transition-all duration-300",
        isSidebarVisible ? (isSidebarCollapsed ? "md:ml-16" : "md:ml-64") : "ml-0"
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
