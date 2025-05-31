
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, MessageSquare, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConversationStatusEnhanced } from '@/hooks/useConversationStatusEnhanced';
import { ConversationNotesModal } from './ConversationNotesModal';
import { ConversationTagsModal } from './ConversationTagsModal';

interface ConversationActionsMenuProps {
  isDarkMode: boolean;
  conversationId?: string;
  channelId?: string;
  currentStatus?: 'unread' | 'in_progress' | 'resolved';
  onStatusChange?: (status: 'unread' | 'in_progress' | 'resolved') => void;
  onRefresh?: () => void;
}

export const ConversationActionsMenu: React.FC<ConversationActionsMenuProps> = ({
  isDarkMode,
  conversationId,
  channelId,
  currentStatus,
  onStatusChange,
  onRefresh
}) => {
  const { updateConversationStatus } = useConversationStatusEnhanced();

  const handleStatusChange = async (newStatus: 'unread' | 'in_progress' | 'resolved') => {
    if (!channelId || !conversationId) return;
    
    const success = await updateConversationStatus(channelId, conversationId, newStatus);
    if (success) {
      onStatusChange?.(newStatus);
      onRefresh?.();
    }
  };

  const statusOptions = [
    { 
      value: 'unread', 
      label: 'Marcar como não lida', 
      icon: MessageSquare,
      color: 'text-orange-600'
    },
    { 
      value: 'in_progress', 
      label: 'Marcar em andamento', 
      icon: Clock,
      color: 'text-blue-600'
    },
    { 
      value: 'resolved', 
      label: 'Marcar como resolvida', 
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full",
            isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <MoreVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        className={cn(
          "w-56",
          isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
        )}
      >
        {/* Status Actions */}
        {statusOptions
          .filter(option => option.value !== currentStatus)
          .map((option) => {
            const IconComponent = option.icon;
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleStatusChange(option.value as any)}
                className={cn(
                  "cursor-pointer",
                  isDarkMode ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-100"
                )}
              >
                <IconComponent size={16} className={cn("mr-2", option.color)} />
                {option.label}
              </DropdownMenuItem>
            );
          })}

        <DropdownMenuSeparator className={isDarkMode ? "bg-zinc-800" : "bg-gray-200"} />

        {/* Notes */}
        {channelId && conversationId && (
          <ConversationNotesModal
            isDarkMode={isDarkMode}
            channelId={channelId}
            conversationId={conversationId}
          />
        )}

        {/* Tags */}
        {channelId && conversationId && (
          <ConversationTagsModal
            isDarkMode={isDarkMode}
            channelId={channelId}
            conversationId={conversationId}
          />
        )}

        <DropdownMenuSeparator className={isDarkMode ? "bg-zinc-800" : "bg-gray-200"} />

        {/* Refresh */}
        <DropdownMenuItem
          onClick={onRefresh}
          className={cn(
            "cursor-pointer",
            isDarkMode ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-100"
          )}
        >
          <RefreshCw size={16} className="mr-2 text-gray-500" />
          Atualizar conversa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
