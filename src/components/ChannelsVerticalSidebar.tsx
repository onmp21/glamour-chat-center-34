
import React from 'react';
import { cn } from '@/lib/utils';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Hash, Store, Users, ExternalLink, UserCheck } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

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

  // Função para obter ícone do canal baseado no nome
  const getChannelIcon = (channelName: string) => {
    if (channelName.includes('Yelena') || channelName.includes('AI')) {
      return Hash;
    }
    if (channelName.includes('Canarana') || channelName.includes('Souto') || channelName.includes('João') || channelName.includes('América')) {
      return Store;
    }
    if (channelName.includes('Gerente das Lojas')) {
      return Users;
    }
    if (channelName.includes('Gerente do Externo')) {
      return ExternalLink;
    }
    if (channelName.includes('Pedro')) {
      return UserCheck;
    }
    return Hash; // fallback
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
        "hidden md:flex flex-col w-20 h-full border-r flex-shrink-0",
        isDarkMode ? "bg-[#09090b] border-[#3f3f46]" : "bg-white border-gray-200"
      )}>
        {/* Header */}
        <div className={cn(
          "p-4 border-b",
          isDarkMode ? "border-[#3f3f46]" : "border-gray-200"
        )}>
          <div className="flex justify-center">
            <Hash size={20} className={cn(
              isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
            )} />
          </div>
        </div>

        {/* Lista de Canais */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2">
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
                      "relative w-full flex flex-col items-center space-y-1 p-3 mx-2 rounded-lg transition-all duration-200 group",
                      isActive
                        ? (isDarkMode ? "bg-[#b5103c]/20 border border-[#b5103c]" : "bg-[#b5103c]/10 border border-[#b5103c]")
                        : (isDarkMode ? "hover:bg-[#27272a] border border-transparent" : "hover:bg-gray-50 border border-transparent")
                    )}
                  >
                    {/* Ícone */}
                    <IconComponent 
                      size={20} 
                      className={cn(
                        "transition-colors",
                        isActive 
                          ? "text-[#b5103c]" 
                          : (isDarkMode ? "text-[#a1a1aa] group-hover:text-[#fafafa]" : "text-gray-500 group-hover:text-gray-700")
                      )}
                    />
                    
                    {/* Abreviação */}
                    <span className={cn(
                      "text-xs font-medium",
                      isActive 
                        ? "text-[#b5103c]" 
                        : (isDarkMode ? "text-[#a1a1aa] group-hover:text-[#fafafa]" : "text-gray-500 group-hover:text-gray-700")
                    )}>
                      {abbreviation}
                    </span>

                    {/* Badge de notificações (placeholder) */}
                    {Math.random() > 0.7 && (
                      <Badge 
                        variant="default" 
                        className="absolute -top-1 -right-1 bg-[#b5103c] hover:bg-[#9d0e34] text-white text-xs rounded-full min-w-[18px] h-4 flex items-center justify-center px-1"
                      >
                        {Math.floor(Math.random() * 9) + 1}
                      </Badge>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <p>{channel.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Indicador visual quando está em chat */}
        {isInChatSection && (
          <div className={cn(
            "p-2 border-t",
            isDarkMode ? "border-[#3f3f46]" : "border-gray-200"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full mx-auto",
              "bg-[#b5103c]"
            )}></div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
