
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, MoreVertical } from 'lucide-react';

interface MobileChatHeaderProps {
  isDarkMode: boolean;
  conversationName: string;
  onBack: () => void;
  onShowContactDetails: () => void;
  onShowContactSettings: () => void;
  onShowMoreOptions: () => void;
}

export const MobileChatHeader: React.FC<MobileChatHeaderProps> = ({
  isDarkMode,
  conversationName,
  onBack,
  onShowMoreOptions
}) => {
  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-3 border-b sticky top-0 z-10",
      isDarkMode ? "bg-black border-zinc-800" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className={cn(
            "flex-shrink-0 rounded-full",
            isDarkMode ? "text-white hover:bg-zinc-800" : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <ArrowLeft size={20} />
        </Button>
        
        <div className="flex-1 min-w-0">
          <h1 className={cn(
            "font-semibold text-lg truncate",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            {conversationName}
          </h1>
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-zinc-400" : "text-gray-500"
          )}>
            Online agora
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onShowMoreOptions}
        className={cn(
          "flex-shrink-0 rounded-full",
          isDarkMode ? "text-white hover:bg-zinc-800" : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <MoreVertical size={20} />
      </Button>
    </div>
  );
};
