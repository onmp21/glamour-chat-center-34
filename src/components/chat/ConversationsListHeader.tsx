
import React from 'react';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConversationsListHeaderProps {
  isDarkMode: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

export const ConversationsListHeader: React.FC<ConversationsListHeaderProps> = ({
  isDarkMode,
  refreshing,
  onRefresh
}) => {
  return (
    <div className={cn("p-4 border-b", isDarkMode ? "bg-[#18181b] border-[#3f3f46]" : "bg-white border-gray-200")}>
      <div className="flex items-center justify-between">
        <h2 className={cn("text-xl font-semibold", isDarkMode ? "text-[#fafafa]" : "text-gray-900")}>
          Conversas
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRefresh} 
          disabled={refreshing} 
          className={cn("h-8 w-8 p-0", isDarkMode ? "hover:bg-[#27272a] text-[#fafafa]" : "hover:bg-gray-100")}
        >
          <RefreshCw size={16} className={cn(refreshing && "animate-spin")} />
        </Button>
      </div>
    </div>
  );
};
