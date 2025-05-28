
import React from 'react';
import { cn } from '@/lib/utils';
import { Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChannelConversation } from '@/hooks/useChannelConversations';

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

  return (
    <div 
      key={`${channelId}-${conversation.id}`} 
      onClick={onClick} 
      className={cn(
        "p-4 border-b cursor-pointer transition-colors rounded-xl m-2",
        isDarkMode ? "border-[#3f3f46] hover:bg-[#18181b]" : "border-gray-100 hover:bg-gray-50",
        isActive && (isDarkMode ? "bg-[#18181b]" : "bg-gray-50")
      )}
    >
      {/* Layout SEM AVATAR - seguindo WhatsApp */}
      <div className="flex flex-col space-y-2">
        {/* Linha superior: Nome e Hora */}
        <div className="flex items-center justify-between">
          <h3 className={cn("font-medium text-base truncate", isDarkMode ? "text-[#fafafa]" : "text-gray-900")}>
            {conversation.contact_name || conversation.contact_phone}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={cn("text-xs flex-shrink-0", isDarkMode ? "text-[#a1a1aa]" : "text-gray-500")}>
              {formatTime(conversation.last_message_time)}
            </span>
            {/* Badge de mensagens não lidas */}
            {(conversation.unread_count || 0) > 0 && (
              <Badge variant="default" className="bg-[#b5103c] hover:bg-[#9d0e34] text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center">
                {conversation.unread_count}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Linha do meio: Última mensagem */}
        <div className="flex items-center justify-between">
          <p className={cn("text-sm truncate flex-1", isDarkMode ? "text-[#a1a1aa]" : "text-gray-600")}>
            {conversation.last_message || 'Sem mensagens'}
          </p>
        </div>
        
        {/* Linha inferior: Telefone e Status */}
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
              conversation.status === 'unread' && "border-[#b5103c] text-[#b5103c]",
              conversation.status === 'in_progress' && (isDarkMode ? "border-[#a1a1aa] text-[#a1a1aa]" : "border-yellow-500 text-yellow-600"),
              conversation.status === 'resolved' && (isDarkMode ? "border-[#a1a1aa] text-[#a1a1aa]" : "border-green-500 text-green-600"),
              isDarkMode && "border-[#3f3f46]"
            )}
          >
            {conversation.status === 'unread' && 'Nova'}
            {conversation.status === 'in_progress' && 'Ativa'}
            {conversation.status === 'resolved' && 'Resolvida'}
          </Badge>
        </div>
      </div>
    </div>
  );
};
