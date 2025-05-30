import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useChannelMessagesRefactored } from '@/hooks/useChannelMessagesRefactored';
import { useAuth } from '@/contexts/AuthContext';
import { format, isToday, isYesterday, parseISO } from 'date-fns'; // Import parseISO
import { ptBR } from 'date-fns/locale';

interface MessageHistoryProps {
  channelId: string;
  conversationId?: string;
  isDarkMode: boolean;
  className?: string;
}

// Helper function to convert UTC/ISO string to Brasília Date object
const convertToBrasiliaTime = (timestamp: string): Date => {
  try {
    // Parse the ISO string (assuming it's UTC or has timezone offset)
    const date = parseISO(timestamp);
    // Convert to Brasília time string using toLocaleString
    const brasiliaTimeString = date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
    // Parse the Brasília time string back into a Date object
    // This Date object will represent the correct time in the *local* environment,
    // but its internal value is adjusted. Formatting functions will use this adjusted time.
    return new Date(brasiliaTimeString);
  } catch (error) {
    console.error(`Error converting timestamp ${timestamp} to Brasília time:`, error);
    // Fallback to current time in Brasília if conversion fails
    const nowBrasiliaString = new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
    return new Date(nowBrasiliaString);
  }
};

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
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' }); // Use auto for instant scroll on load
    }
  }, [messages]);

  const formatMessageTime = (timestamp: string) => {
    try {
      const brasiliaDate = convertToBrasiliaTime(timestamp);
      // Format the Brasília time
      return format(brasiliaDate, 'HH:mm', { locale: ptBR });
    } catch (error) {
      console.error("Error formatting message time:", error);
      return '--:--'; // Fallback for formatting error
    }
  };

  const formatDateSeparator = (timestamp: string) => {
    try {
      const brasiliaDate = convertToBrasiliaTime(timestamp);
      // Use the Brasília date for comparisons
      if (isToday(brasiliaDate)) {
        return 'Hoje';
      } else if (isYesterday(brasiliaDate)) {
        return 'Ontem';
      } else {
        return format(brasiliaDate, 'dd \'de\' MMMM', { locale: ptBR });
      }
    } catch (error) {
      console.error("Error formatting date separator:", error);
      return 'Data inválida'; // Fallback for formatting error
    }
  };

  // Agrupar mensagens por data (using Brasília time for grouping)
  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    messages.forEach((message) => {
      try {
        const brasiliaDate = convertToBrasiliaTime(message.timestamp);
        const dateKey = format(brasiliaDate, 'yyyy-MM-dd'); // Group by Brasília date
        
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(message);
      } catch (error) {
        console.error("Error grouping message by date:", message, error);
      }
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
  // Sort dates based on the keys (which are yyyy-MM-dd strings)
  const sortedDates = Object.keys(groupedMessages).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <div className={cn("space-y-6 p-4 pb-24 md:pb-4", className)}>      
      <div className="space-y-6">
        {sortedDates.map((dateKey) => (
          <div key={dateKey} className="space-y-4">
            {/* Separador de data */}
            <div className="flex items-center justify-center">
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                isDarkMode ? "bg-[#27272a] text-[#a1a1aa]" : "bg-gray-100 text-gray-600"
              )}>
                {/* Format separator using the first message of the group */}
                {formatDateSeparator(groupedMessages[dateKey][0].timestamp)}
              </div>
            </div>

            {/* Mensagens do dia */}
            {groupedMessages[dateKey].map((message, index) => {
              const isAgentMessage = message.sender === 'agent';

              return (
                <div
                  key={`${message.id}-${index}`}
                  className={cn(
                    "flex",
                    isAgentMessage ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[70%] space-y-1",
                    isAgentMessage ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap",
                      isAgentMessage
                        ? "bg-[#b5103c] text-white rounded-br-md"
                        : isDarkMode
                          ? "bg-[#18181b] text-[#fafafa] rounded-bl-md"
                          : "bg-gray-100 text-gray-900 rounded-bl-md"
                    )}>
                      {message.content}
                    </div>

                    <div className={cn(
                      "flex items-center space-x-2 text-xs px-1",
                      isAgentMessage ? "flex-row-reverse space-x-reverse" : "flex-row",
                      isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
                    )}>
                      <span className="font-medium">
                        {isAgentMessage ? 'Agente' : message.contactName}
                      </span>
                      {/* Format time using the Brasília converted date */}
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

