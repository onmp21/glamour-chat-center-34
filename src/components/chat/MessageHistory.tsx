
import React from 'react';
import { cn } from '@/lib/utils';
import { useMessages, Message } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MessageHistoryProps {
  channelId: string;
  isDarkMode: boolean;
  className?: string;
}

export const MessageHistory: React.FC<MessageHistoryProps> = ({
  channelId,
  isDarkMode,
  className
}) => {
  const { user } = useAuth();
  const { messages, loading } = useMessages(channelId);

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
            Seja o primeiro a enviar uma mensagem neste canal
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 p-4", className)}>
      {messages.map((message) => {
        const isOwnMessage = message.user_id === user?.id;
        const isSentMessage = message.message_type === 'sent';

        return (
          <div
            key={message.id}
            className={cn(
              "flex space-x-3",
              isOwnMessage ? "justify-end" : "justify-start"
            )}
          >
            {!isOwnMessage && (
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className={cn(
                  "text-xs font-medium",
                  isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                )}>
                  {getInitials(message.sender_name)}
                </AvatarFallback>
              </Avatar>
            )}

            <div className={cn(
              "max-w-[70%] space-y-1",
              isOwnMessage ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "flex items-center space-x-2 text-xs",
                isOwnMessage ? "flex-row-reverse space-x-reverse" : "flex-row",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                <span className="font-medium">{message.sender_name}</span>
                <span>{formatMessageTime(message.created_at)}</span>
                {message.customer_name && (
                  <span className={cn(
                    "px-2 py-1 rounded text-xs",
                    isDarkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"
                  )}>
                    {message.customer_name}
                  </span>
                )}
              </div>

              <div className={cn(
                "px-3 py-2 rounded-lg text-sm",
                isOwnMessage
                  ? "bg-blue-500 text-white rounded-br-sm"
                  : isDarkMode
                    ? "bg-gray-700 text-gray-100 rounded-bl-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm",
                isSentMessage
                  ? "border-l-4 border-green-500"
                  : "border-l-4 border-orange-500"
              )}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.customer_phone && (
                  <p className={cn(
                    "text-xs mt-1 opacity-75",
                    isOwnMessage ? "text-blue-100" : isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    {message.customer_phone}
                  </p>
                )}
              </div>
            </div>

            {isOwnMessage && (
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className={cn(
                  "text-xs font-medium",
                  "bg-blue-500 text-white"
                )}>
                  {getInitials(message.sender_name)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        );
      })}
    </div>
  );
};
