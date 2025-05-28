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
  const {
    channels
  } = useChannels();
  const {
    getAccessibleChannels
  } = usePermissions();

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
  return <TooltipProvider>
      
    </TooltipProvider>;
};