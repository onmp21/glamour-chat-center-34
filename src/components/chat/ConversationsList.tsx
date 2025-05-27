
import React from 'react';
import { cn } from '@/lib/utils';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
import { RefreshCw, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConversationsListProps {
  channelId: string;
  activeConversation?: string;
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
        isDarkMode ? "bg-gray-900" : "bg-white"
      )}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className={cn(
      "h-full flex flex-col",
      isDarkMode ? "bg-gray-900" : "bg-white"
    )}>
      {/* Header com botão de refresh */}
      <div className={cn(
        "p-4 border-b flex items-center justify-between",
        isDarkMode ? "border-gray-700" : "border-gray-200"
      )}>
        <h2 className={cn(
          "text-lg font-semibold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Conversas ({conversations.length})
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshConversations}
          disabled={refreshing}
          className={cn(
            "h-8 w-8 p-0",
            isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
          )}
        >
          <RefreshCw size={16} className={cn(refreshing && "animate-spin")} />
        </Button>
      </div>

      {/* Lista de conversas */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center">
            <User size={48} className={cn(
              "mx-auto mb-4",
              isDarkMode ? "text-gray-600" : "text-gray-400"
            )} />
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Nenhuma conversa encontrada
            </p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleConversationClick(conversation.id)}
              className={cn(
                "p-4 border-b cursor-pointer transition-colors relative",
                isDarkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-100 hover:bg-gray-50",
                activeConversation === conversation.id && (
                  isDarkMode ? "bg-gray-800" : "bg-blue-50"
                )
              )}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-medium",
                  conversation.status === 'unread' ? "bg-[#b5103c]" : "bg-gray-500"
                )}>
                  {conversation.contact_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={cn(
                      "font-medium text-sm truncate",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>
                      {conversation.contact_name || conversation.contact_phone}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {conversation.unread_count > 0 && (
                        <Badge 
                          variant="default" 
                          className="bg-[#b5103c] hover:bg-[#a00f36] text-white text-xs"
                        >
                          {conversation.unread_count}
                        </Badge>
                      )}
                      <span className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}>
                        {formatTime(conversation.last_message_time)}
                      </span>
                    </div>
                  </div>
                  
                  <p className={cn(
                    "text-sm text-gray-500 truncate mt-1",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    {conversation.last_message || 'Sem mensagens'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className={cn(
                      "text-xs",
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    )}>
                      {conversation.contact_phone}
                    </span>
                    
                    <Badge 
                      variant="outline"
                      className={cn(
                        "text-xs",
                        conversation.status === 'unread' && "border-[#b5103c] text-[#b5103c]",
                        conversation.status === 'in_progress' && "border-yellow-500 text-yellow-500",
                        conversation.status === 'resolved' && "border-green-500 text-green-500"
                      )}
                    >
                      {conversation.status === 'unread' && 'Não lida'}
                      {conversation.status === 'in_progress' && 'Em andamento'}
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
