
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
      <div className={cn("hidden md:flex w-64 h-screen flex-col border-r transition-colors")} style={{
        backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
        borderColor: isDarkMode ? '#686868' : '#e5e7eb'
      }}>
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
