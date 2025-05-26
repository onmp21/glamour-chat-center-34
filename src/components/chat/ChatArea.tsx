
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
      "flex-1 overflow-y-auto p-6 space-y-4",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      {conversation.last_message ? (
        <div className="space-y-4">
          {/* Mensagem do cliente */}
          <div className="flex justify-start">
            <div className="flex flex-col">
              <div className={cn(
                "max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm",
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
              )}>
                <p className="text-sm leading-relaxed">{conversation.last_message}</p>
              </div>
              {conversation.last_message_time && (
                <p className={cn("text-xs mt-1 ml-2", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  {format(new Date(conversation.last_message_time), 'HH:mm', { locale: ptBR })}
                </p>
              )}
            </div>
          </div>
          
          {/* Mensagem de exemplo do atendente */}
          <div className="flex justify-end">
            <div className="flex flex-col">
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm bg-blue-500 text-white">
                <p className="text-sm leading-relaxed">Olá! Como posso ajudá-lo hoje?</p>
              </div>
              <p className="text-xs mt-1 mr-2 text-right text-blue-400">
                {format(new Date(), 'HH:mm', { locale: ptBR })}
              </p>
            </div>
          </div>

          {/* Mensagem do cliente */}
          <div className="flex justify-start">
            <div className="flex flex-col">
              <div className={cn(
                "max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm",
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
              )}>
                <p className="text-sm leading-relaxed">Gostaria de saber sobre os produtos em promoção</p>
              </div>
              <p className={cn("text-xs mt-1 ml-2", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                {format(new Date(), 'HH:mm', { locale: ptBR })}
              </p>
            </div>
          </div>

          {/* Mensagem do atendente */}
          <div className="flex justify-end">
            <div className="flex flex-col">
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm bg-blue-500 text-white">
                <p className="text-sm leading-relaxed">Claro! Temos várias promoções ativas. Você tem interesse em algum produto específico?</p>
              </div>
              <p className="text-xs mt-1 mr-2 text-right text-blue-400">
                {format(new Date(), 'HH:mm', { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center py-8">
            <h3 className={cn("text-lg font-medium mb-2", isDarkMode ? "text-white" : "text-gray-900")}>
              Conversa com {conversation.contact_name}
            </h3>
            <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
              Nenhuma mensagem ainda. Envie uma mensagem para começar a conversa.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
