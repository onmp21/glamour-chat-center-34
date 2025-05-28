
import React from 'react';
import { cn } from '@/lib/utils';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
import { MessageCircle, Building2, Users, ExternalLink, User } from 'lucide-react';

interface ChannelsSidebarProps {
  isDarkMode: boolean;
  activeSection: string;
  onChannelSelect: (channelId: string) => void;
}

export const ChannelsSidebar: React.FC<ChannelsSidebarProps> = ({
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

  // Função para obter ícone do canal com design minimalista
  const getChannelIcon = (channelName: string) => {
    if (channelName.includes('Yelena') || channelName.includes('AI')) {
      return MessageCircle;
    }
    if (channelName.includes('Canarana') || channelName.includes('Souto') || channelName.includes('João') || channelName.includes('América')) {
      return Building2;
    }
    if (channelName.includes('Gerente das Lojas')) {
      return Users;
    }
    if (channelName.includes('Gerente do Externo')) {
      return ExternalLink;
    }
    if (channelName.includes('Pedro')) {
      return User;
    }
    return MessageCircle;
  };

  // Função para obter cor do ícone baseado no tipo de canal
  const getChannelIconColor = (channelName: string) => {
    if (channelName.includes('Yelena') || channelName.includes('AI')) return 'text-blue-500';
    if (channelName.includes('Canarana') || channelName.includes('Souto') || channelName.includes('João') || channelName.includes('América')) return 'text-green-500';
    if (channelName.includes('Gerente das Lojas')) return 'text-purple-500';
    if (channelName.includes('Gerente do Externo')) return 'text-orange-500';
    if (channelName.includes('Pedro')) return 'text-red-500';
    return 'text-gray-500';
  };

  const handleChannelClick = (channelId: string) => {
    onChannelSelect(channelId);
  };

  // Componente para card de canal com estatísticas
  const ChannelCard: React.FC<{ channel: any }> = ({ channel }) => {
    const { conversations, loading } = useChannelConversationsRefactored(channel.id);
    const IconComponent = getChannelIcon(channel.name);
    
    const conversationCount = loading ? 0 : conversations.length;
    
    return (
      <button
        onClick={() => handleChannelClick(channel.legacyId)}
        className={cn(
          "w-full p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] text-left",
          isDarkMode 
            ? "bg-[#18181b] border-[#3f3f46] hover:bg-[#27272a]" 
            : "bg-white border-gray-200 hover:bg-gray-50"
        )}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className={cn(
            "p-2 rounded-md",
            isDarkMode ? "bg-[#27272a]" : "bg-gray-100"
          )}>
            <IconComponent 
              size={18} 
              className={getChannelIconColor(channel.name)}
              strokeWidth={1.5}
            />
          </div>
          <div className="flex-1">
            <h3 className={cn(
              "font-medium text-sm",
              isDarkMode ? "text-[#fafafa]" : "text-gray-900"
            )}>
              {channel.name}
            </h3>
          </div>
        </div>
        
        <p className={cn(
          "text-sm",
          isDarkMode ? "text-[#a1a1aa]" : "text-gray-600"
        )}>
          {conversationCount} conversas
        </p>
      </button>
    );
  };

  return (
    <div className={cn(
      "flex-1 p-4 overflow-y-auto",
      isDarkMode ? "bg-[#09090b]" : "bg-white"
    )}>
      {/* Layout vertical de cards de canais */}
      <div className="space-y-3">
        {availableChannels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
};
