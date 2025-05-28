
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MoreVertical } from 'lucide-react';
import { ChannelConversation } from '@/hooks/useChannelConversations';

interface ChatHeaderProps {
  isDarkMode: boolean;
  conversation: ChannelConversation;
  channelId?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ isDarkMode, conversation, channelId }) => {
  // Função para determinar os nomes exibidos baseado no canal
  const getDisplayNames = () => {
    if (channelId === 'chat') {
      // No canal Yelena: Óticas Villa Glamour (lado esquerdo) e o contato (lado direito)
      return {
        leftName: 'Óticas Villa Glamour',
        leftSubtitle: 'Pedro Vila Nova',
        rightName: conversation.contact_name,
        rightSubtitle: conversation.contact_phone
      };
    } else if (channelId === 'gerente-externo') {
      // No canal Gerente Externo: Andressa (lado esquerdo) e o contato (lado direito)  
      return {
        leftName: 'Andressa',
        leftSubtitle: 'Gerente Externa',
        rightName: conversation.contact_name,
        rightSubtitle: conversation.contact_phone
      };
    } else {
      // Outros canais: comportamento padrão
      return {
        leftName: conversation.contact_name,
        leftSubtitle: conversation.contact_phone,
        rightName: null,
        rightSubtitle: null
      };
    }
  };

  const { leftName, leftSubtitle, rightName, rightSubtitle } = getDisplayNames();

  return (
    <div className={cn(
      "flex items-center justify-between p-4 border-b chat-header-height",
      isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center space-x-3 flex-1">
        {/* Layout especial para Yelena e Gerente Externo */}
        {(channelId === 'chat' || channelId === 'gerente-externo') ? (
          <div className="flex items-center justify-between w-full">
            {/* Lado esquerdo */}
            <div className="flex flex-col">
              <h3 className={cn("font-semibold text-lg", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
                {leftName}
              </h3>
              <p className={cn("text-sm", isDarkMode ? "text-zinc-500" : "text-gray-500")}>
                {leftSubtitle}
              </p>
            </div>
            
            {/* Separador visual */}
            <div className={cn("h-8 w-px mx-4", isDarkMode ? "bg-zinc-700" : "bg-gray-300")} />
            
            {/* Lado direito */}
            <div className="flex flex-col">
              <h3 className={cn("font-semibold text-lg", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
                {rightName}
              </h3>
              <p className={cn("text-sm", isDarkMode ? "text-zinc-500" : "text-gray-500")}>
                {rightSubtitle}
              </p>
            </div>
          </div>
        ) : (
          /* Layout padrão para outros canais */
          <div>
            <h3 className={cn("font-semibold text-lg", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
              {leftName}
            </h3>
            <p className={cn("text-sm", isDarkMode ? "text-zinc-500" : "text-gray-500")}>
              {leftSubtitle}
            </p>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "rounded-full",
            isDarkMode ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300" : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
          )}
        >
          <MoreVertical size={18} />
        </Button>
      </div>
    </div>
  );
};
