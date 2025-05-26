import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useChannelMessages } from '@/hooks/useChannelMessages';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm', { locale: ptBR });
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <span className={cn("ml-2", isDarkMode ? "text-gray-400" : "text-gray-600")}>
          Carregando mensagens...
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
            Nenhuma mensagem ainda
          </p>
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            As mensagens aparecerão aqui conforme as conversas acontecem
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 p-4", className)}>
      {messages.map((message) => {
        const isCustomerMessage = message.sender === 'customer';

        return (
          <div
            key={message.id}
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
                  {isCustomerMessage ? message.contactName : user?.name || 'Você'}
                </span>
                <span>{formatMessageTime(message.timestamp)}</span>
              </div>

              <div className={cn(
                "px-3 py-2 rounded-lg text-sm",
                isCustomerMessage
                  ? isDarkMode
                    ? "bg-gray-700 text-gray-100 rounded-bl-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  : "bg-blue-500 text-white rounded-br-sm"
              )}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                {isCustomerMessage && message.contactPhone && (
                  <p className={cn(
                    "text-xs mt-1 opacity-75",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    {message.contactPhone}
                  </p>
                )}
              </div>
            </div>

            {!isCustomerMessage && (
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="text-xs font-medium bg-blue-500 text-white">
                  {getInitials(user?.name || 'Você')}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
