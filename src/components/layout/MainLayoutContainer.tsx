
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/Sidebar';
import { MobileNavigation } from '@/components/MobileNavigation';
import { ContentRenderer } from './ContentRenderer';
import { useLayout } from './LayoutProvider';

export const MainLayoutContainer: React.FC = () => {
  const {
    activeSection,
    setActiveSection,
    isSidebarVisible,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isDarkMode,
    toggleDarkMode
  } = useLayout();

  const chatChannels = useMemo(() => [
    'chat', 'canarana', 'souto-soares', 'joao-dourado', 
    'america-dourada', 'gerente-lojas', 'gerente-externo', 'pedro'
  ], []);

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

  return (
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
          <ContentRenderer
            activeSection={activeSection}
            isDarkMode={isDarkMode}
            onSectionChange={handleSectionChange}
            toggleDarkMode={toggleDarkMode}
            onToggleSidebar={toggleSidebarCollapse}
          />
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
  );
};
