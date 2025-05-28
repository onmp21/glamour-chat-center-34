
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChannelConversation } from '@/hooks/useChannelConversations';
import { useConversationStatus } from '@/hooks/useConversationStatus';

interface ConversationItemProps {
  conversation: ChannelConversation;
  channelId: string;
  isDarkMode: boolean;
  isActive: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  channelId,
  isDarkMode,
  isActive,
  onClick
}) => {
  const { getConversationStatus } = useConversationStatus();
  const [currentStatus, setCurrentStatus] = useState<'unread' | 'in_progress' | 'resolved'>('unread');

  useEffect(() => {
    const status = getConversationStatus(channelId, conversation.id);
    setCurrentStatus(status);
  }, [channelId, conversation.id, getConversationStatus]);

  // Determinar nome de exibição baseado no canal
  const getDisplayName = () => {
    if (channelId === 'chat') {
      return 'Pedro Vila Nova';
    } else if (channelId === 'gerente-externo') {
      // Para canal gerente externo, mostrar o nome real do contato
      return conversation.contact_name || `Cliente ${conversation.contact_phone?.slice(-4) || ''}`;
    } else {
      return conversation.contact_name || conversation.contact_phone;
    }
  };

  const displayName = getDisplayName();

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm', {
        locale: ptBR
      });
    } else if (isYesterday(date)) {
      return 'Ontem';
    } else {
      return format(date, 'dd/MM', {
        locale: ptBR
      });
    }
  };

  const showUnreadBadge = currentStatus === 'unread';

  return (
    <div 
      onClick={onClick} 
      className={cn(
        "p-4 border-b cursor-pointer transition-colors rounded-xl m-2",
        isDarkMode ? "border-[#3f3f46] hover:bg-[#18181b]" : "border-gray-100 hover:bg-gray-50",
        isActive && (isDarkMode ? "bg-[#18181b]" : "bg-gray-50")
      )}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h3 className={cn("font-medium text-base truncate", isDarkMode ? "text-[#fafafa]" : "text-gray-900")}>
            {displayName}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={cn("text-xs flex-shrink-0", isDarkMode ? "text-[#a1a1aa]" : "text-gray-500")}>
              {formatTime(conversation.last_message_time)}
            </span>
            {showUnreadBadge && (
              <Badge variant="default" className="bg-[#b5103c] hover:bg-[#9d0e34] text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center">
                •
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className={cn("text-sm truncate flex-1", isDarkMode ? "text-[#a1a1aa]" : "text-gray-600")}>
            {conversation.last_message || 'Sem mensagens'}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Phone size={12} className={cn(isDarkMode ? "text-[#a1a1aa]" : "text-gray-400")} />
            <span className={cn("text-xs", isDarkMode ? "text-[#a1a1aa]" : "text-gray-400")}>
              {conversation.contact_phone}
            </span>
          </div>
          
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs rounded-full",
              currentStatus === 'unread' && "border-[#b5103c] text-[#b5103c]",
              currentStatus === 'in_progress' && (isDarkMode ? "border-[#a1a1aa] text-[#a1a1aa]" : "border-yellow-500 text-yellow-600"),
              currentStatus === 'resolved' && (isDarkMode ? "border-[#a1a1aa] text-[#a1a1aa]" : "border-green-500 text-green-600"),
              isDarkMode && "border-[#3f3f46]"
            )}
          >
            {currentStatus === 'unread' && 'Nova'}
            {currentStatus === 'in_progress' && 'Ativa'}
            {currentStatus === 'resolved' && 'Resolvida'}
          </Badge>
        </div>
      </div>
    </div>
  );
};
