
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { User, Settings, MoreVertical } from 'lucide-react';

interface ContactActionsHeaderProps {
  isDarkMode: boolean;
  contactName?: string;
}

export const ContactActionsHeader: React.FC<ContactActionsHeaderProps> = ({ 
  isDarkMode, 
  contactName 
}) => {
  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-3 border-b",
      isDarkMode ? "bg-[#232323] border-[#2a2a2a]" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User size={16} className="text-gray-600" />
        </div>
        <div>
          <h3 className={cn("font-semibold text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
            {contactName || 'Contato'}
          </h3>
          <p className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            Online
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
          )}
          title="Dados do Contato"
        >
          <User size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
          )}
          title="Configurações do Contato"
        >
          <Settings size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
          )}
          title="Mais opções"
        >
          <MoreVertical size={16} />
        </Button>
      </div>
    </div>
  );
};
