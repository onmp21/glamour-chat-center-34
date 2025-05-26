
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Pin, X } from 'lucide-react';

interface ChannelButtonProps {
  id: string;
  name: string;
  isPinned?: boolean;
  isDarkMode: boolean;
  onTogglePin: (id: string) => void;
  onRemove: (id: string) => void;
  onClick: (id: string) => void;
}

export const ChannelButton: React.FC<ChannelButtonProps> = ({
  id,
  name,
  isPinned = false,
  isDarkMode,
  onTogglePin,
  onRemove,
  onClick
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className={cn(
        "relative group rounded-lg border transition-all duration-200 hover:shadow-md",
        isDarkMode 
          ? "bg-gray-900 border-gray-800 hover:bg-gray-800" 
          : "bg-white border-gray-200 hover:bg-gray-50"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <button
        onClick={() => onClick(id)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-center justify-between">
          <h3 className={cn(
            "font-medium pr-16",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            {name}
          </h3>
          {isPinned && !showActions && (
            <Pin size={16} className="text-villa-primary absolute top-4 right-4" />
          )}
        </div>
        <p className={cn(
          "text-sm mt-1",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}>
          Canal de atendimento
        </p>
      </button>
      
      {showActions && (
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(id);
            }}
            className={cn(
              "h-6 w-6 p-0",
              isDarkMode 
                ? "hover:bg-gray-700 text-gray-400" 
                : "hover:bg-gray-200 text-gray-600"
            )}
          >
            <Pin size={12} className={isPinned ? "text-villa-primary" : ""} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(id);
            }}
            className={cn(
              "h-6 w-6 p-0",
              isDarkMode 
                ? "hover:bg-red-900 text-red-400" 
                : "hover:bg-red-100 text-red-600"
            )}
          >
            <X size={12} />
          </Button>
        </div>
      )}
    </div>
  );
};
