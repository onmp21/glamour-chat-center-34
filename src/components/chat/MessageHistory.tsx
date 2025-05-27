
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useChannelMessages } from '@/hooks/useChannelMessages';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getTableNameForChannel } from '@/utils/channelMapping';

interface MessageHistoryProps {
  channelId: string;
  conversationId?: string;
  isDarkMode: boolean;
  className?: string;
}

export const MessageHistory: React.FC<MessageHistoryProps> = ({
  channelId,
  conversationId,
  isDarkMode,
  className
}) => {
  const { user } = useAuth();
  const { messages, loading } = useChannelMessages(channelId, conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const tableName = getTableNameForChannel(channelId);

  console.log('🎯 MENSAGENS CARREGADAS:', {
    canal: channelId,
    tabela: tableName,
    total: messages.length,
    conversationId,
    messages: messages.map(m => ({
      id: m.id,
      sender: m.sender,
      content: m.content.substring(0, 50) + '...',
      timestamp: m.timestamp
    }))
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'HH:mm', { locale: ptBR });
    } catch {
      return format(new Date(), 'HH:mm', { locale: ptBR });
    }
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <span className={cn("ml-2", isDarkMode ? "text-gray-400" : "text-gray-600")}>
          Carregando mensagens de {tableName}...
        </span>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={cn(
        "flex items-center justify-center p-8 text-center",
        className
      )}>
        <div>
          <p className={cn(
            "text-lg font-medium mb-2",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            Nenhuma mensagem encontrada
          </p>
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            {conversationId ? 
              `Não há mensagens para ${conversationId} na tabela ${tableName}` : 
              `Não há mensagens na tabela ${tableName}`
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 p-4", className)}>
      <div className={cn(
        "text-xs text-center py-2 sticky top-0 z-10 rounded",
        isDarkMode ? "bg-zinc-900 text-gray-400 border border-zinc-700" : "bg-gray-50 text-gray-500 border border-gray-200"
      )}>
        📊 {messages.length} MENSAGENS DA TABELA: {tableName.toUpperCase()}
        {conversationId && (
          <span className="block mt-1">Conversa: {conversationId}</span>
        )}
      </div>
      
      <div className="space-y-4">
        {messages.map((message, index) => {
          const isCustomerMessage = message.sender === 'customer';

          return (
            <div
              key={`${tableName}-${message.id}-${index}`}
              className={cn(
                "flex space-x-3",
                isCustomerMessage ? "justify-start" : "justify-end"
              )}
            >
              {isCustomerMessage && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={cn(
                    "text-xs font-medium",
                    isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                  )}>
                    {getInitials(message.contactName)}
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={cn(
                "max-w-[70%] space-y-1",
                isCustomerMessage ? "items-start" : "items-end"
              )}>
                <div className={cn(
                  "flex items-center space-x-2 text-xs",
                  isCustomerMessage ? "flex-row" : "flex-row-reverse space-x-reverse",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  <span className="font-medium">
                    {isCustomerMessage ? message.contactName : 'Yelena AI'}
                  </span>
                  <span>{formatMessageTime(message.timestamp)}</span>
                  <span className="opacity-50">#{message.id}</span>
                  <span className="px-1 py-0.5 rounded text-xs bg-blue-500 text-white">
                    {tableName.split('_')[0].toUpperCase()}
                  </span>
                </div>

                <div className={cn(
                  "px-3 py-2 rounded-lg text-sm whitespace-pre-wrap",
                  isCustomerMessage
                    ? isDarkMode
                      ? "bg-gray-700 text-gray-100 rounded-bl-sm"
                      : "bg-gray-100 text-gray-900 rounded-bl-sm"
                    : "bg-blue-500 text-white rounded-br-sm"
                )}>
                  {message.content}
                </div>
              </div>

              {!isCustomerMessage && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="text-xs font-medium bg-blue-500 text-white">
                    YE
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};
