
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useChannelMessagesRefactored } from '@/hooks/useChannelMessagesRefactored';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface YelenaChatAreaProps {
  channelId: string;
  conversationId?: string;
  isDarkMode: boolean;
  className?: string;
}

export const YelenaChatArea: React.FC<YelenaChatAreaProps> = ({
  channelId,
  conversationId,
  isDarkMode,
  className
}) => {
  const { messages, loading } = useChannelMessagesRefactored(channelId, conversationId);
  const leftMessagesEndRef = useRef<HTMLDivElement>(null);
  const rightMessagesEndRef = useRef<HTMLDivElement>(null);

  // Separar mensagens por sender
  const customerMessages = messages.filter(msg => msg.sender === 'customer');
  const yelenaMesages = messages.filter(msg => msg.sender === 'agent');

  useEffect(() => {
    if (leftMessagesEndRef.current && customerMessages.length > 0) {
      leftMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (rightMessagesEndRef.current && yelenaMesages.length > 0) {
      rightMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [customerMessages.length, yelenaMesages.length]);

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

  return (
    <div className={cn("grid grid-cols-2 h-full gap-1", className)}>
      {/* Coluna Esquerda - Cliente */}
      <div className={cn(
        "flex flex-col border-r",
        isDarkMode ? "border-zinc-800 bg-zinc-950" : "border-gray-200 bg-gray-50"
      )}>
        {/* Header Cliente */}
        <div className={cn(
          "p-3 border-b text-center font-medium",
          isDarkMode ? "border-zinc-800 text-[#fafafa] bg-zinc-900" : "border-gray-200 text-gray-900 bg-white"
        )}>
          Cliente
        </div>
        
        {/* Mensagens do Cliente */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {customerMessages.length === 0 ? (
            <div className={cn(
              "text-center text-sm",
              isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
            )}>
              Nenhuma mensagem do cliente
            </div>
          ) : (
            customerMessages.map((message, index) => (
              <div key={`customer-${message.id}-${index}`} className="flex justify-start">
                <div className="max-w-[85%] space-y-1">
                  <div className={cn(
                    "flex items-center space-x-2 text-xs",
                    isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
                  )}>
                    <span className="font-medium">{message.contactName}</span>
                    <span>{formatMessageTime(message.timestamp)}</span>
                  </div>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl rounded-bl-md text-sm whitespace-pre-wrap",
                    isDarkMode
                      ? "bg-[#18181b] text-[#fafafa]"
                      : "bg-gray-100 text-gray-900"
                  )}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={leftMessagesEndRef} />
        </div>
      </div>

      {/* Coluna Direita - Óticas Villa Glamour (Yelena) */}
      <div className={cn(
        "flex flex-col",
        isDarkMode ? "bg-zinc-950" : "bg-gray-50"
      )}>
        {/* Header Yelena */}
        <div className={cn(
          "p-3 border-b text-center font-medium",
          isDarkMode ? "border-zinc-800 text-[#fafafa] bg-zinc-900" : "border-gray-200 text-gray-900 bg-white"
        )}>
          Óticas Villa Glamour
        </div>
        
        {/* Mensagens da Yelena */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {yelenaMesages.length === 0 ? (
            <div className={cn(
              "text-center text-sm",
              isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
            )}>
              Nenhuma mensagem da Yelena
            </div>
          ) : (
            yelenaMesages.map((message, index) => (
              <div key={`yelena-${message.id}-${index}`} className="flex justify-end">
                <div className="max-w-[85%] space-y-1">
                  <div className={cn(
                    "flex items-center justify-end space-x-2 text-xs",
                    isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
                  )}>
                    <span>{formatMessageTime(message.timestamp)}</span>
                    <span className="font-medium">Yelena</span>
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-br-md text-sm whitespace-pre-wrap bg-[#b5103c] text-white">
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={rightMessagesEndRef} />
        </div>
      </div>
    </div>
  );
};
