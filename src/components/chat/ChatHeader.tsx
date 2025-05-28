
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
  console.log(`🎯 [CHAT_HEADER] Rendering for channel: ${channelId}, conversation: ${conversation.contact_name}`);
  
  // Função para determinar os nomes exibidos baseado no canal
  const getDisplayNames = () => {
    if (channelId === 'chat' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') {
      // Canal Yelena: sempre Pedro Vila Nova
      console.log(`🏪 [CHAT_HEADER] Yelena channel - displaying Pedro Vila Nova`);
      return {
        leftName: 'Óticas Villa Glamour',
        leftSubtitle: 'IA Assistente',
        rightName: 'Pedro Vila Nova',
        rightSubtitle: conversation.contact_phone,
        isDualLayout: true
      };
    } else if (channelId === 'gerente-externo' || channelId === 'd2892900-ca8f-4b08-a73f-6b7aa5866ff7') {
      // Canal Gerente Externo: Andressa + o contato real
      console.log(`👔 [CHAT_HEADER] Gerente externo - displaying Andressa and ${conversation.contact_name}`);
      return {
        leftName: 'Andressa',
        leftSubtitle: 'Gerente Externa',
        rightName: conversation.contact_name,
        rightSubtitle: conversation.contact_phone,
        isDualLayout: true
      };
    } else {
      // Outros canais: comportamento padrão
      console.log(`📋 [CHAT_HEADER] Standard channel - displaying ${conversation.contact_name}`);
      return {
        leftName: conversation.contact_name,
        leftSubtitle: conversation.contact_phone,
        rightName: null,
        rightSubtitle: null,
        isDualLayout: false
      };
    }
  };

  const { leftName, leftSubtitle, rightName, rightSubtitle, isDualLayout } = getDisplayNames();

  return (
    <div className={cn(
      "flex items-center justify-between p-4 border-b chat-header-height",
      isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center flex-1 min-w-0">
        {isDualLayout ? (
          /* Layout especial para Yelena e Gerente Externo */
          <div className="flex items-center justify-between w-full max-w-4xl">
            {/* Lado esquerdo */}
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className={cn("font-semibold text-lg truncate", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
                {leftName}
              </h3>
              <p className={cn("text-sm truncate", isDarkMode ? "text-zinc-500" : "text-gray-500")}>
                {leftSubtitle}
              </p>
            </div>
            
            {/* Separador visual */}
            <div className={cn("h-8 w-px mx-6 flex-shrink-0", isDarkMode ? "bg-zinc-700" : "bg-gray-300")} />
            
            {/* Lado direito */}
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className={cn("font-semibold text-lg truncate", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
                {rightName}
              </h3>
              <p className={cn("text-sm truncate", isDarkMode ? "text-zinc-500" : "text-gray-500")}>
                {rightSubtitle}
              </p>
            </div>
          </div>
        ) : (
          /* Layout padrão para outros canais */
          <div className="flex flex-col min-w-0">
            <h3 className={cn("font-semibold text-lg truncate", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
              {leftName}
            </h3>
            <p className={cn("text-sm truncate", isDarkMode ? "text-zinc-500" : "text-gray-500")}>
              {leftSubtitle}
            </p>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
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
