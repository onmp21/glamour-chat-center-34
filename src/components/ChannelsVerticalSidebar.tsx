
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
  const availableChannels = channels.filter(channel => channel.isActive).map(channel => ({
    ...channel,
    legacyId: getChannelLegacyId(channel)
  })).filter(channel => accessibleChannels.includes(channel.legacyId));

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

  const handleChannelClick = (channelId: string) => {
    onChannelSelect(channelId);
  };

  // Lista de canais de chat para verificar se está ativo
  const chatChannels = ['chat', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'gerente-lojas', 'gerente-externo', 'pedro'];
  const isInChatSection = chatChannels.includes(activeSection);

  return (
    <TooltipProvider>
      <div className={cn(
        "w-16 h-full flex flex-col items-center py-4 space-y-3 border-r",
        isDarkMode ? "bg-[#0a0a0b] border-gray-800" : "bg-white border-gray-200"
      )}>
        {availableChannels.map((channel) => {
          const IconComponent = getChannelIcon(channel.name);
          const isActive = activeSection === channel.legacyId;
          
          return (
            <Tooltip key={channel.legacyId}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleChannelClick(channel.legacyId)}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                    "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    isActive 
                      ? isDarkMode 
                        ? "bg-blue-600 text-white focus:ring-blue-400" 
                        : "bg-blue-500 text-white focus:ring-blue-300"
                      : isDarkMode
                        ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 focus:ring-gray-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 focus:ring-gray-400"
                  )}
                >
                  <IconComponent size={20} strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                <p className="text-sm font-medium">{channel.name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
