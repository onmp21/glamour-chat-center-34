
import React from 'react';
import { cn } from '@/lib/utils';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
import { MessageCircle, Hash, Users, Phone, User } from 'lucide-react';

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

  // Componente para card de canal com estatísticas - layout vertical
  const ChannelCard: React.FC<{ channel: any }> = ({ channel }) => {
    const { conversations, loading } = useChannelConversationsRefactored(channel.id);
    const IconComponent = getChannelIcon(channel.name);
    
    const conversationCount = loading ? 0 : conversations.length;
    
    return (
      <button
        onClick={() => handleChannelClick(channel.legacyId)}
        className={cn(
          "w-full p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] text-left flex flex-col items-center space-y-2",
          isDarkMode 
            ? "bg-[#18181b] border-[#3f3f46] hover:bg-[#27272a]" 
            : "bg-white border-gray-200 hover:bg-gray-50"
        )}
      >
        <div className={cn(
          "p-2 rounded-full",
          isDarkMode ? "bg-[#27272a]" : "bg-gray-100"
        )}>
          <IconComponent 
            size={16} 
            className={cn(isDarkMode ? "text-[#fafafa]" : "text-gray-700")}
            strokeWidth={1}
          />
        </div>
        
        <div className="text-center">
          <h3 className={cn(
            "font-medium text-xs mb-1",
            isDarkMode ? "text-[#fafafa]" : "text-gray-900"
          )}>
            {channel.name}
          </h3>
          
          <p className={cn(
            "text-xs",
            isDarkMode ? "text-[#a1a1aa]" : "text-gray-600"
          )}>
            {conversationCount}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className={cn(
      "flex-1 p-3 overflow-y-auto",
      isDarkMode ? "bg-[#09090b]" : "bg-white"
    )}>
      {/* Layout em grid vertical de cards de canais */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {availableChannels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
};
