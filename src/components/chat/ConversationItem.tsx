
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

  // Determinar nome de exibição baseado no canal e contato
  const getDisplayName = () => {
    console.log(`🎯 [CONVERSATION_ITEM] Determining display name for channel ${channelId}, contact: ${conversation.contact_name}, phone: ${conversation.contact_phone}`);
    
    // Para canal Yelena: sempre Pedro Vila Nova (único)
    if (channelId === 'chat' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') {
      console.log(`🏪 [CONVERSATION_ITEM] Yelena channel - Pedro Vila Nova`);
      return 'Pedro Vila Nova';
    } 
    // Para canal Gerente Externo: mostrar o nome real do contato
    else if (channelId === 'gerente-externo' || channelId === 'd2892900-ca8f-4b08-a73f-6b7aa5866ff7') {
      const contactName = conversation.contact_name || `Cliente ${conversation.contact_phone?.slice(-4) || ''}`;
      console.log(`👔 [CONVERSATION_ITEM] Gerente externo - ${contactName}`);
      return contactName;
    } 
    // Para outros canais: usar nome do contato ou telefone
    else {
      const displayName = conversation.contact_name || conversation.contact_phone;
      console.log(`📋 [CONVERSATION_ITEM] Standard channel - ${displayName}`);
      return displayName;
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

  const handleClick = () => {
    console.log(`🎯 [CONVERSATION_ITEM] Clicked on conversation: ${conversation.id} - ${displayName}`);
    onClick();
  };

  console.log(`📝 [CONVERSATION_ITEM] Rendering: ${displayName} (${conversation.contact_phone}) - Status: ${currentStatus}`);

  return (
    <div 
      onClick={handleClick} 
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
              currentStatus === 'in_progress' && (isDarkMode ? "border-[#059669] text-[#059669]" : "border-green-500 text-green-600"),
              currentStatus === 'resolved' && (isDarkMode ? "border-[#a1a1aa] text-[#a1a1aa]" : "border-gray-500 text-gray-600"),
              isDarkMode && "border-[#3f3f46]"
            )}
          >
            {currentStatus === 'unread' && 'Nova'}
            {currentStatus === 'in_progress' && 'Visto'}
            {currentStatus === 'resolved' && 'Resolvida'}
          </Badge>
        </div>
      </div>
    </div>
  );
};
