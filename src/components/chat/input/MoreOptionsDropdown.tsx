
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';

interface MoreOptionsDropdownProps {
  isDarkMode: boolean;
}

export const MoreOptionsDropdown: React.FC<MoreOptionsDropdownProps> = ({
  isDarkMode
}) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const handleDocumentClick = (e: Event) => {
    if (!(e.target as Element).closest('.more-options-dropdown-container')) {
      setShowMoreOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  return (
    <div className="relative more-options-dropdown-container">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9", isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-100")}
        onClick={(e) => {
          e.stopPropagation();
          setShowMoreOptions(!showMoreOptions);
        }}
      >
        <MoreHorizontal size={18} />
      </Button>
      
      {showMoreOptions && (
        <div className={cn(
          "absolute bottom-12 right-0 rounded-lg shadow-lg border p-2 z-50 min-w-[150px]",
          isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-start mb-1"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Abrir configurações');
              setShowMoreOptions(false);
            }}
          >
            <span className={isDarkMode ? "text-zinc-200" : "text-gray-700"}>Configurações</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Arquivar conversa');
              setShowMoreOptions(false);
            }}
          >
            <span className={isDarkMode ? "text-zinc-200" : "text-gray-700"}>Arquivar</span>
          </Button>
        </div>
      )}
    </div>
  );
};
