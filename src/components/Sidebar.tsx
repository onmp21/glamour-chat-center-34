
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  isDarkMode,
  toggleDarkMode
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
        "hidden md:flex w-64 h-screen flex-col border-r transition-colors",
        isDarkMode ? "bg-[#09090b] border-[#3f3f46]" : "bg-white border-gray-200"
      )}>
        <DesktopSidebarHeader isDarkMode={isDarkMode} />
        
        <DesktopSidebarNavigation
          isDarkMode={isDarkMode}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />

        <DesktopSidebarFooter
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onUserClick={handleUserClick}
        />
      </div>
    </>
  );
};
