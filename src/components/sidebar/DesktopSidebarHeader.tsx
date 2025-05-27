
import React from 'react';
import { cn } from '@/lib/utils';

interface DesktopSidebarHeaderProps {
  isDarkMode: boolean;
  isCollapsed?: boolean;
}

export const DesktopSidebarHeader: React.FC<DesktopSidebarHeaderProps> = ({
  isDarkMode,
  isCollapsed = false
}) => {
  return (
    <div className={cn("p-4 border-b")} style={{
      borderColor: isDarkMode ? '#686868' : '#e5e7eb'
    }}>
      <div className="flex items-center justify-center">
        <img 
          src="/lovable-uploads/ea397861-5fcd-451b-872e-727208c03a67.png" 
          alt="Villa Glamour Logo" 
          className={cn(
            "object-contain app-logo transition-all duration-300",
            isCollapsed ? "w-8 h-8" : "w-16 h-16"
          )} 
        />
        {!isCollapsed && (
          <div className="flex-1 ml-3">
            <h1 className={cn("text-lg font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
              Villa Glamour
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};
