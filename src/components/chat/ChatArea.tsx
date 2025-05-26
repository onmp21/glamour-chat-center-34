
import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChannelConversation } from '@/hooks/useChannelConversations';

interface ChatAreaProps {
  isDarkMode: boolean;
  conversation: ChannelConversation;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ isDarkMode, conversation }) => {
  return (
    <div className={cn(
      "flex-1 overflow-y-auto p-4 space-y-4",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      {conversation.last_message ? (
        <div className="space-y-3">
          {/* Mensagem do cliente */}
          <div className="flex justify-start">
            <div className={cn(
              "max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm",
              isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
            )}>
              <p className="text-sm">{conversation.last_message}</p>
              {conversation.last_message_time && (
                <p className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  {format(new Date(conversation.last_message_time), 'HH:mm', { locale: ptBR })}
                </p>
              )}
            </div>
          </div>
          
          {/* Mensagem de exemplo do atendente */}
          <div className="flex justify-end">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm bg-blue-500 text-white">
              <p className="text-sm">Olá! Como posso ajudá-lo hoje?</p>
              <p className="text-xs mt-1 text-blue-100">
                {format(new Date(), 'HH:mm', { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            Nenhuma mensagem ainda
          </p>
        </div>
      )}
    </div>
  );
};
