
import React from 'react';
import { cn } from '@/lib/utils';

interface DesktopSidebarHeaderProps {
  isDarkMode: boolean;
}

export const DesktopSidebarHeader: React.FC<DesktopSidebarHeaderProps> = ({ 
  isDarkMode 
}) => {
  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
          <img 
            src="/lovable-uploads/f96c8aee-33b8-4acd-b78b-1ac25d065b33.png" 
            alt="Villa Glamour Logo" 
            className="w-8 h-8 object-contain"
          />
        </div>
        <div>
          <h1 className={cn(
            "text-xl font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Villa Glamour
          </h1>
          <p className={cn(
            "text-xs",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            Sistema de Atendimento
          </p>
        </div>
      </div>
    </div>
  );
};
