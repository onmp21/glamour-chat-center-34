
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MobileSidebar } from './MobileSidebar';
import { DesktopSidebarHeader } from './sidebar/DesktopSidebarHeader';
import { DesktopSidebarNavigation } from './sidebar/DesktopSidebarNavigation';
import { DesktopSidebarFooter } from './sidebar/DesktopSidebarFooter';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isVisible?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  isDarkMode,
  toggleDarkMode,
  isVisible = true,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleUserClick = () => {
    onSectionChange('settings');
  };

  return (
    <>
      <MobileSidebar 
        activeSection={activeSection} 
        onSectionChange={onSectionChange} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex h-screen flex-col border-r transition-all duration-300",
        isDarkMode ? "bg-[#09090b] border-[#3f3f46]" : "bg-white border-gray-200",
        isVisible ? "translate-x-0" : "-translate-x-full absolute z-50",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <DesktopSidebarHeader 
          isDarkMode={isDarkMode} 
          isCollapsed={isCollapsed}
        />
        
        <DesktopSidebarNavigation
          isDarkMode={isDarkMode}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isCollapsed={isCollapsed}
        />

        <DesktopSidebarFooter
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onUserClick={handleUserClick}
          isCollapsed={isCollapsed}
        />
      </div>
    </>
  );
};
