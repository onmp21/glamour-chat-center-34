import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { ChatInterface } from './ChatInterface';
import { Settings } from './Settings';
import { ExamesTable } from './ExamesTable';
import { MobileNavigation } from './MobileNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from './LoginForm';

export const MainLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isAuthenticated } = useAuth();

  // Se não está autenticado, mostra a tela de login
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNavigateToChannel = (channelId: string) => {
    console.log('MainLayout: Navegando para canal:', channelId);
    setActiveSection(channelId);
  };

  const renderContent = () => {
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
        return <ChatInterface isDarkMode={isDarkMode} activeChannel={activeSection} />;
      case 'settings':
        return <Settings isDarkMode={isDarkMode} />;
      default:
        return <Dashboard isDarkMode={isDarkMode} onNavigateToChannel={handleNavigateToChannel} />;
    }
  };

  return (
    <div className={cn(
      "flex h-screen transition-colors overflow-hidden",
      isDarkMode && "dark"
    )} style={{
      backgroundColor: isDarkMode ? '#3a3a3a' : '#f9fafb'
    }}>
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <main className="flex-1 overflow-auto">
        <div className="h-full" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 64px)' }}>
          {renderContent()}
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <MobileNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
