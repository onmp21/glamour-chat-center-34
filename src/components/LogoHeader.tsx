
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoHeaderProps {
  isDarkMode: boolean;
}

export const LogoHeader: React.FC<LogoHeaderProps> = ({ isDarkMode }) => {
  return (
    <div className="flex items-center justify-center py-4 px-4 border-b mb-4" style={{
      borderColor: isDarkMode ? "#2a2a2a" : "#e5e7eb"
    }}>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg font-bold">👓</span>
        </div>
        <div>
          <h1 className={cn("text-xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
            Villa Glamour
          </h1>
          <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>
            Centro de Atendimento
          </p>
        </div>
      </div>
    </div>
  );
};
