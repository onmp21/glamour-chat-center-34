
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface MobileSidebarHeaderProps {
  isDarkMode: boolean;
  onClose: () => void;
}

export const MobileSidebarHeader: React.FC<MobileSidebarHeaderProps> = ({
  isDarkMode,
  onClose
}) => {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 border-b"
    )} style={{
      borderColor: isDarkMode ? '#333333' : '#e5e7eb'
    }}>
      <div className="flex items-center space-x-3">
        <img 
          src="/lovable-uploads/2e823263-bd82-49e9-84f6-6327c136da53.png" 
          alt="Villa Glamour Logo" 
          className="w-12 h-12 object-contain app-logo"
        />
        <h1 className={cn(
          "text-lg font-semibold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Villa Glamour
        </h1>
      </div>
      <Button
        onClick={onClose}
        variant="ghost"
        size="sm"
        className={cn(
          "p-2 mobile-touch",
          isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"
        )}
      >
        <X size={20} />
      </Button>
    </div>
  );
};
