
import React from 'react';
import { cn } from '@/lib/utils';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
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

  // Função para obter ícone do canal baseado no nome
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

  // Componente para item de canal com contagem
  const ChannelListItem: React.FC<{ channel: any }> = ({ channel }) => {
    const { conversations } = useChannelConversationsRefactored(channel.realId || channel.id);
    const IconComponent = getChannelIcon(channel.name);
    const isActive = activeSection === channel.legacyId;
    
    return (
      <div
        onClick={() => onChannelSelect(channel.legacyId)}
        className={cn(
          "flex items-center space-x-3 p-3 cursor-pointer transition-colors border-l-4",
          isDarkMode 
            ? "hover:bg-zinc-800 text-white" 
            : "hover:bg-gray-50 text-gray-900",
          isActive 
            ? (isDarkMode ? "bg-zinc-800 border-l-[#b5103c]" : "bg-gray-50 border-l-[#b5103c]")
            : "border-l-transparent"
        )}
      >
        <IconComponent size={20} className={cn(
          isDarkMode ? "text-gray-400" : "text-gray-600",
          isActive && "text-[#b5103c]"
        )} />
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-sm truncate",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            {channel.name}
          </h3>
          <p className={cn(
            "text-xs",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            {conversations.length} conversas
          </p>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className={cn(
        "w-64 h-full border-r flex flex-col",
        isDarkMode ? "bg-[#09090b] border-[#3f3f46]" : "bg-white border-gray-200"
      )}>
        {/* Header */}
        <div className={cn(
          "p-4 border-b",
          isDarkMode ? "border-[#3f3f46]" : "border-gray-200"
        )}>
          <h2 className={cn(
            "text-lg font-semibold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Canais
          </h2>
          <p className={cn(
            "text-sm mt-1",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            Selecione um canal para ver as conversas
          </p>
        </div>

        {/* Lista de canais em formato de lista vertical */}
        <div className="flex-1 overflow-y-auto">
          {availableChannels.map(channel => (
            <ChannelListItem key={channel.id} channel={channel} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};
