
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useChannelMessagesRefactored } from '@/hooks/useChannelMessagesRefactored';
import { useAuth } from '@/contexts/AuthContext';
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';
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

  const formatMessageTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isToday(date)) {
        return format(date, 'HH:mm', { locale: ptBR });
      } else if (isYesterday(date)) {
        return `Ontem, ${format(date, 'HH:mm', { locale: ptBR })}`;
      } else if (differenceInDays(new Date(), date) <= 7) {
        return format(date, 'EEE, HH:mm', { locale: ptBR });
      } else if (new Date().getFullYear() === date.getFullYear()) {
        return format(date, 'dd MMM', { locale: ptBR });
      } else {
        return format(date, 'dd/MM/yyyy', { locale: ptBR });
      }
    } catch {
      return format(new Date(), 'HH:mm', { locale: ptBR });
    }
  };

  const formatDateSeparator = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isToday(date)) {
        return 'Hoje';
      } else if (isYesterday(date)) {
        return 'Ontem';
      } else {
        return format(date, 'dd \'de\' MMMM', { locale: ptBR });
      }
    } catch {
      return 'Hoje';
    }
  };

  // Agrupar mensagens por data
  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    messages.forEach((message) => {
      const date = new Date(message.timestamp);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
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
            Selecione uma conversa à esquerda para visualizar
          </p>
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
          )}>
            {conversationId ? 
              `Não há mensagens para ${conversationId}` : 
              `Escolha uma conversa para começar`
            }
          </p>
        </div>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);
  const sortedDates = Object.keys(groupedMessages).sort();

  return (
    <div className={cn("space-y-6 p-4", className)}>      
      <div className="space-y-6">
        {sortedDates.map((dateKey) => (
          <div key={dateKey} className="space-y-4">
            {/* Separador de data */}
            <div className="flex items-center justify-center">
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                isDarkMode ? "bg-[#27272a] text-[#a1a1aa]" : "bg-gray-100 text-gray-600"
              )}>
                {formatDateSeparator(groupedMessages[dateKey][0].timestamp)}
              </div>
            </div>

            {/* Mensagens do dia */}
            {groupedMessages[dateKey].map((message, index) => {
              const isCustomerMessage = message.sender === 'customer';

              return (
                <div
                  key={`${message.id}-${index}`}
                  className={cn(
                    "flex",
                    isCustomerMessage ? "justify-start" : "justify-end"
                  )}
                >
                  <div className={cn(
                    "max-w-[70%] space-y-1",
                    isCustomerMessage ? "items-start" : "items-end"
                  )}>
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

                    <div className={cn(
                      "flex items-center space-x-2 text-xs px-1",
                      isCustomerMessage ? "flex-row" : "flex-row-reverse space-x-reverse",
                      isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
                    )}>
                      <span className="font-medium">
                        {isCustomerMessage ? message.contactName : 'Agente'}
                      </span>
                      <span>{formatMessageTime(message.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};
