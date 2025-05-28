
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Archive, Trash2, Tag, UserCheck, UserX, RefreshCw } from 'lucide-react';
import { useConversationStatus } from '@/hooks/useConversationStatus';
import { useAuditLogger } from '@/hooks/useAuditLogger';

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
  const { updateConversationStatus } = useConversationStatus();
  const { logConversationAction } = useAuditLogger();
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = async (newStatus: 'unread' | 'in_progress' | 'resolved') => {
    if (!conversationId || !channelId) return;

    try {
      await updateConversationStatus(channelId, conversationId, newStatus);
      onStatusChange?.(newStatus);
      
      logConversationAction('status_changed', conversationId, {
        channel_id: channelId,
        old_status: currentStatus,
        new_status: newStatus
      });

      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleArchive = () => {
    if (!conversationId) return;
    
    logConversationAction('conversation_archived', conversationId, {
      channel_id: channelId
    });
    
    console.log('Conversa arquivada:', conversationId);
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (!conversationId) return;
    
    logConversationAction('conversation_deleted', conversationId, {
      channel_id: channelId
    });
    
    console.log('Conversa deletada:', conversationId);
    setIsOpen(false);
  };

  const handleTag = () => {
    if (!conversationId) return;
    
    logConversationAction('conversation_tagged', conversationId, {
      channel_id: channelId
    });
    
    console.log('Adicionando tag à conversa:', conversationId);
    setIsOpen(false);
  };

  const handleRefresh = () => {
    onRefresh?.();
    setIsOpen(false);
  };

  if (!conversationId) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRefresh}
        className={cn(
          "h-8 w-8",
          isDarkMode ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        )}
      >
        <RefreshCw size={16} />
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8",
            isDarkMode ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          )}
        >
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={cn(
          "w-56",
          isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}
      >
        <DropdownMenuItem
          onClick={() => handleStatusChange('unread')}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            isDarkMode ? "text-zinc-100 hover:bg-zinc-700" : "text-gray-900 hover:bg-gray-50",
            currentStatus === 'unread' && "bg-red-50 text-red-700"
          )}
        >
          <UserX size={16} />
          Marcar como não lida
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleStatusChange('in_progress')}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            isDarkMode ? "text-zinc-100 hover:bg-zinc-700" : "text-gray-900 hover:bg-gray-50",
            currentStatus === 'in_progress' && "bg-yellow-50 text-yellow-700"
          )}
        >
          <UserCheck size={16} />
          Marcar em andamento
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleStatusChange('resolved')}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            isDarkMode ? "text-zinc-100 hover:bg-zinc-700" : "text-gray-900 hover:bg-gray-50",
            currentStatus === 'resolved' && "bg-green-50 text-green-700"
          )}
        >
          <UserCheck size={16} />
          Marcar como resolvida
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className={isDarkMode ? "bg-zinc-700" : "bg-gray-200"} />
        
        <DropdownMenuItem
          onClick={handleTag}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            isDarkMode ? "text-zinc-100 hover:bg-zinc-700" : "text-gray-900 hover:bg-gray-50"
          )}
        >
          <Tag size={16} />
          Adicionar tag
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={handleRefresh}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            isDarkMode ? "text-zinc-100 hover:bg-zinc-700" : "text-gray-900 hover:bg-gray-50"
          )}
        >
          <RefreshCw size={16} />
          Atualizar
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className={isDarkMode ? "bg-zinc-700" : "bg-gray-200"} />
        
        <DropdownMenuItem
          onClick={handleArchive}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            isDarkMode ? "text-zinc-100 hover:bg-zinc-700" : "text-gray-900 hover:bg-gray-50"
          )}
        >
          <Archive size={16} />
          Arquivar conversa
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={handleDelete}
          className={cn(
            "flex items-center gap-2 cursor-pointer text-red-600 hover:bg-red-50",
            isDarkMode && "hover:bg-red-900/20"
          )}
        >
          <Trash2 size={16} />
          Deletar conversa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
