
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, User, Settings, MoreVertical } from 'lucide-react';

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
  onShowContactDetails,
  onShowContactSettings,
  onShowMoreOptions
}) => {
  return (
    <div className="flex items-center px-2 py-3 border-b gap-2 flex-shrink-0" 
         style={{ borderColor: isDarkMode ? "#404040" : "#ececec", backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" }}>
      <Button size="icon" variant="ghost" className="mr-2" onClick={onBack}>
        <ArrowLeft size={22} className={isDarkMode ? "text-gray-200" : "text-gray-700"} />
      </Button>
      <div className="flex items-center gap-3 flex-1">
        <div className="flex-1">
          <span className={cn("font-semibold text-base", isDarkMode ? "text-white" : "text-gray-900")}>
            {conversationName}
          </span>
          <div className={cn("text-xs", isDarkMode ? "text-gray-200" : "text-gray-500")}>
            Online
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isDarkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")}
          onClick={onShowContactDetails}
        >
          <User size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isDarkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")}
          onClick={onShowContactSettings}
        >
          <Settings size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isDarkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")}
          onClick={onShowMoreOptions}
        >
          <MoreVertical size={18} />
        </Button>
      </div>
    </div>
  );
};
