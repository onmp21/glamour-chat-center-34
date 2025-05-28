
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useChannelMessagesRefactored } from '@/hooks/useChannelMessagesRefactored';
import { useAuth } from '@/contexts/AuthContext';
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
  const { messages, loading } = useChannelMessagesRefactored(channelId, conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const tableName = getTableNameForChannel(channelId);

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
        <div className={cn(
          "animate-spin rounded-full h-6 w-6 border-b-2",
          isDarkMode ? "border-[#fafafa]" : "border-gray-900"
        )}></div>
        <span className={cn("ml-2", isDarkMode ? "text-[#a1a1aa]" : "text-gray-600")}>
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
            isDarkMode ? "text-[#fafafa]" : "text-gray-600"
          )}>
            Nenhuma mensagem encontrada
          </p>
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
          )}>
            {conversationId ? 
              `Não há mensagens para ${conversationId}` : 
              `Não há mensagens neste canal`
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 p-4", className)}>      
      <div className="space-y-4">
        {messages.map((message, index) => {
          const isCustomerMessage = message.sender === 'customer';

          return (
            <div
              key={`${message.id}-${index}`}
              className={cn(
                "flex",
                isCustomerMessage ? "justify-start" : "justify-end"
              )}
            >
              {/* Layout sem avatar com cantos arredondados */}
              <div className={cn(
                "max-w-[70%] space-y-1",
                isCustomerMessage ? "items-start" : "items-end"
              )}>
                <div className={cn(
                  "flex items-center space-x-2 text-xs",
                  isCustomerMessage ? "flex-row" : "flex-row-reverse space-x-reverse",
                  isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
                )}>
                  <span className="font-medium">
                    {isCustomerMessage ? message.contactName : 'Agente'}
                  </span>
                  <span>{formatMessageTime(message.timestamp)}</span>
                </div>

                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap",
                  isCustomerMessage
                    ? isDarkMode
                      ? "bg-[#18181b] text-[#fafafa] rounded-bl-md"
                      : "bg-gray-100 text-gray-900 rounded-bl-md"
                    : "bg-[#b5103c] text-white rounded-br-md"
                )}>
                  {message.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};
