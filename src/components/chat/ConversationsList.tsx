
import React from 'react';
import { cn } from '@/lib/utils';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
import { RefreshCw, MessageSquare, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConversationsListProps {
  channelId: string;
  activeConversation?: string | null;
  onConversationSelect: (conversationId: string) => void;
  isDarkMode: boolean;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({
  channelId,
  activeConversation,
  onConversationSelect,
  isDarkMode
}) => {
  const { 
    conversations, 
    loading, 
    refreshing, 
    refreshConversations, 
    updateConversationStatus 
  } = useChannelConversationsRefactored(channelId);

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: ptBR });
    } else if (isYesterday(date)) {
      return 'Ontem';
    } else {
      return format(date, 'dd/MM', { locale: ptBR });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleConversationClick = async (conversationId: string) => {
    onConversationSelect(conversationId);
    // Auto-marcar como lido quando abrir a conversa
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation && conversation.status === 'unread') {
      await updateConversationStatus(conversationId, 'in_progress');
    }
  };

  if (loading) {
    return (
      <div className={cn(
        "h-full flex items-center justify-center",
        isDarkMode ? "bg-[#09090b]" : "bg-white"
      )}>
        <div className={cn(
          "animate-spin rounded-full h-6 w-6 border-b-2",
          isDarkMode ? "border-[#fafafa]" : "border-gray-900"
        )}></div>
      </div>
    );
  }

  return (
    <div className={cn(
      "h-full flex flex-col",
      isDarkMode ? "bg-[#09090b]" : "bg-white"
    )}>
      {/* Header estilo WhatsApp */}
      <div className={cn(
        "p-4 border-b flex items-center justify-between",
        isDarkMode ? "bg-[#18181b] border-[#3f3f46]" : "bg-white border-gray-200"
      )}>
        <h2 className={cn(
          "text-xl font-semibold",
          isDarkMode ? "text-[#fafafa]" : "text-gray-900"
        )}>
          Conversas
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshConversations}
          disabled={refreshing}
          className={cn(
            "h-8 w-8 p-0",
            isDarkMode ? "hover:bg-[#27272a] text-[#fafafa]" : "hover:bg-gray-100"
          )}
        >
          <RefreshCw size={16} className={cn(refreshing && "animate-spin")} />
        </Button>
      </div>

      {/* Lista de conversas estilo WhatsApp */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare size={48} className={cn(
              "mx-auto mb-4",
              isDarkMode ? "text-[#a1a1aa]" : "text-gray-400"
            )} />
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-[#a1a1aa]" : "text-gray-600"
            )}>
              Nenhuma conversa encontrada
            </p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={`${channelId}-${conversation.id}`}
              onClick={() => handleConversationClick(conversation.id)}
              className={cn(
                "p-4 border-b cursor-pointer transition-colors relative",
                isDarkMode ? "border-[#3f3f46] hover:bg-[#18181b]" : "border-gray-100 hover:bg-gray-50",
                activeConversation === conversation.id && (
                  isDarkMode ? "bg-[#18181b]" : "bg-gray-50"
                )
              )}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage src={undefined} alt={conversation.contact_name || conversation.contact_phone} />
                  <AvatarFallback className={cn(
                    "text-white font-medium",
                    "bg-[#b5103c]"
                  )}>
                    {conversation.contact_name ? 
                      getInitials(conversation.contact_name) : 
                      <User size={20} />
                    }
                  </AvatarFallback>
                </Avatar>

                {/* Conteúdo da conversa */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={cn(
                      "font-medium text-base truncate",
                      isDarkMode ? "text-[#fafafa]" : "text-gray-900"
                    )}>
                      {conversation.contact_name || conversation.contact_phone}
                    </h3>
                    <span className={cn(
                      "text-xs flex-shrink-0 ml-2",
                      isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
                    )}>
                      {formatTime(conversation.last_message_time)}
                    </span>
                  </div>
                  
                  {/* Última mensagem */}
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-sm truncate",
                      isDarkMode ? "text-[#a1a1aa]" : "text-gray-600"
                    )}>
                      {conversation.last_message || 'Sem mensagens'}
                    </p>
                    
                    {/* Badge de mensagens não lidas */}
                    {(conversation.unread_count || 0) > 0 && (
                      <Badge 
                        variant="default" 
                        className="bg-[#b5103c] hover:bg-[#9d0e34] text-white text-xs ml-2 flex-shrink-0"
                      >
                        {conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Informações adicionais */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Phone size={12} className={cn(
                        isDarkMode ? "text-[#a1a1aa]" : "text-gray-400"
                      )} />
                      <span className={cn(
                        "text-xs",
                        isDarkMode ? "text-[#a1a1aa]" : "text-gray-400"
                      )}>
                        {conversation.contact_phone}
                      </span>
                    </div>
                    
                    <Badge 
                      variant="outline"
                      className={cn(
                        "text-xs",
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};
