
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { ChatInterface } from './ChatInterface';
import { Settings } from './Settings';
import { ExamesTable } from './ExamesTable';

export const MainLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard isDarkMode={isDarkMode} />;
      case 'exames':
        return <ExamesTable isDarkMode={isDarkMode} />;
      case 'chat':
      case 'canarana':
      case 'souto-soares':
      case 'joao-dourado':
      case 'america-dourada':
        return <ChatInterface isDarkMode={isDarkMode} activeChannel={activeSection} />;
      case 'settings':
        return <Settings isDarkMode={isDarkMode} />;
      default:
        return <Dashboard isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={cn(
      "flex h-screen transition-colors",
      isDarkMode ? "bg-black" : "bg-gray-50"
    )}>
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <main className="flex-1 overflow-auto">
        <div className="h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
