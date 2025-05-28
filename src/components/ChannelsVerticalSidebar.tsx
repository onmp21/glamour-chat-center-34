
import React from 'react';
import { cn } from '@/lib/utils';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { MessageCircle, Hash, Users, Phone, User } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface ChannelsVerticalSidebarProps {
  isDarkMode: boolean;
  activeSection: string;
  onChannelSelect: (channelId: string) => void;
}

export const ChannelsVerticalSidebar: React.FC<ChannelsVerticalSidebarProps> = ({
  isDarkMode,
  activeSection,
  onChannelSelect
}) => {
  const { channels } = useChannels();
  const { getAccessibleChannels } = usePermissions();

  // Mapear canais do banco para IDs legados para compatibilidade
  const getChannelLegacyId = (channel: any) => {
    const nameToId: Record<string, string> = {
      'Yelena-AI': 'chat',
      'Canarana': 'canarana',
      'Souto Soares': 'souto-soares',
      'João Dourado': 'joao-dourado',
      'América Dourada': 'america-dourada',
      'Gerente das Lojas': 'gerente-lojas',
      'Gerente do Externo': 'gerente-externo',
      'Pedro': 'pedro'
    };
    return nameToId[channel.name] || channel.id;
  };

  const accessibleChannels = getAccessibleChannels();
  const availableChannels = channels
    .filter(channel => channel.isActive)
    .map(channel => ({
      ...channel,
      legacyId: getChannelLegacyId(channel)
    }))
    .filter(channel => accessibleChannels.includes(channel.legacyId));

  // Função para obter ícone do canal baseado no nome com design minimalista
  const getChannelIcon = (channelName: string) => {
    if (channelName.includes('Yelena') || channelName.includes('AI')) {
      return MessageCircle;
    }
    if (channelName.includes('Canarana') || channelName.includes('Souto') || channelName.includes('João') || channelName.includes('América')) {
      return Hash;
    }
    if (channelName.includes('Gerente das Lojas')) {
      return Users;
    }
    if (channelName.includes('Gerente do Externo')) {
      return Phone;
    }
    if (channelName.includes('Pedro')) {
      return User;
    }
    return MessageCircle;
  };

  // Função para obter nome abreviado
  const getChannelAbbreviation = (channelName: string) => {
    if (channelName.includes('Yelena') || channelName.includes('AI')) return 'AI';
    if (channelName.includes('Canarana')) return 'CN';
    if (channelName.includes('Souto')) return 'SS';
    if (channelName.includes('João')) return 'JD';
    if (channelName.includes('América')) return 'AD';
    if (channelName.includes('Gerente das Lojas')) return 'GL';
    if (channelName.includes('Gerente do Externo')) return 'GE';
    if (channelName.includes('Pedro')) return 'PD';
    return channelName.slice(0, 2).toUpperCase();
  };

  const handleChannelClick = (channelId: string) => {
    onChannelSelect(channelId);
  };

  // Lista de canais de chat para verificar se está ativo
  const chatChannels = ['chat', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'gerente-lojas', 'gerente-externo', 'pedro'];
  const isInChatSection = chatChannels.includes(activeSection);

  return (
    <TooltipProvider>
      <div className={cn(
        "hidden md:flex flex-col w-12 h-full border-r flex-shrink-0",
        isDarkMode ? "bg-[#09090b] border-[#3f3f46]" : "bg-white border-gray-200"
      )}>
        {/* Header minimalista */}
        <div className={cn(
          "p-2 border-b",
          isDarkMode ? "border-[#3f3f46]" : "border-gray-200"
        )}>
          <div className="flex justify-center">
            <MessageCircle size={14} className={cn(
              isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
            )} strokeWidth={1} />
          </div>
        </div>

        {/* Lista de Canais minimalista */}
        <div className="flex-1 overflow-y-auto py-2 space-y-1">
          {availableChannels.map((channel) => {
            const IconComponent = getChannelIcon(channel.name);
            const isActive = activeSection === channel.legacyId;
            const abbreviation = getChannelAbbreviation(channel.name);
            
            return (
              <Tooltip key={channel.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleChannelClick(channel.legacyId)}
                    className={cn(
                      "relative w-full flex flex-col items-center space-y-1 p-1 mx-1 rounded-md transition-all duration-200 group",
                      isActive
                        ? (isDarkMode ? "bg-[#b5103c]/20 border border-[#b5103c]" : "bg-[#b5103c]/10 border border-[#b5103c]")
                        : (isDarkMode ? "hover:bg-[#27272a] border border-transparent" : "hover:bg-gray-50 border border-transparent")
                    )}
                  >
                    <IconComponent 
                      size={14} 
                      strokeWidth={1}
                      className={cn(
                        "transition-colors",
                        isActive 
                          ? "text-[#b5103c]" 
                          : (isDarkMode ? "text-[#a1a1aa] group-hover:text-[#fafafa]" : "text-gray-500 group-hover:text-gray-700")
                      )}
                    />
                    
                    <span className={cn(
                      "text-xs font-medium",
                      isActive 
                        ? "text-[#b5103c]" 
                        : (isDarkMode ? "text-[#a1a1aa] group-hover:text-[#fafafa]" : "text-gray-500 group-hover:text-gray-700")
                    )}>
                      {abbreviation}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <p>{channel.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Indicador visual quando está em chat - minimalista */}
        {isInChatSection && (
          <div className={cn(
            "p-2 border-t",
            isDarkMode ? "border-[#3f3f46]" : "border-gray-200"
          )}>
            <div className={cn(
              "w-1 h-1 rounded-full mx-auto",
              "bg-[#b5103c]"
            )}></div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
