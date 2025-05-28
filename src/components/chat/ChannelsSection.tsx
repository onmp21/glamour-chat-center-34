
import React from 'react';
import { cn } from '@/lib/utils';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { MessageCircle, Hash, Users, Phone, User } from 'lucide-react';

interface ChannelsSectionProps {
  isDarkMode: boolean;
  activeChannel: string;
  onChannelSelect: (channelId: string) => void;
}

export const ChannelsSection: React.FC<ChannelsSectionProps> = ({
  isDarkMode,
  activeChannel,
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

  // Função para obter ícone do canal
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

  // Componente para item de canal
  const ChannelItem: React.FC<{ channel: any }> = ({ channel }) => {
    const IconComponent = getChannelIcon(channel.name);
    
    return (
      <button
        onClick={() => onChannelSelect(channel.legacyId)}
        className={cn(
          "w-full p-3 rounded-lg transition-all duration-200 text-left flex items-center space-x-3 hover:scale-[1.02]",
          activeChannel === channel.legacyId
            ? isDarkMode 
              ? "bg-[#b5103c] text-white" 
              : "bg-[#b5103c] text-white"
            : isDarkMode 
              ? "bg-[#18181b] border border-[#3f3f46] hover:bg-[#27272a]" 
              : "bg-white border border-gray-200 hover:bg-gray-50"
        )}
      >
        <div className={cn(
          "p-2 rounded-full",
          activeChannel === channel.legacyId
            ? "bg-white/20"
            : isDarkMode ? "bg-[#27272a]" : "bg-gray-100"
        )}>
          <IconComponent 
            size={16} 
            className={cn(
              activeChannel === channel.legacyId
                ? "text-white"
                : isDarkMode ? "text-[#fafafa]" : "text-gray-700"
            )}
            strokeWidth={1.5}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-sm mb-1 truncate",
            activeChannel === channel.legacyId
              ? "text-white"
              : isDarkMode ? "text-[#fafafa]" : "text-gray-900"
          )}>
            {channel.name}
          </h3>
          
          <p className={cn(
            "text-xs",
            activeChannel === channel.legacyId
              ? "text-white/80"
              : isDarkMode ? "text-[#a1a1aa]" : "text-gray-600"
          )}>
            Canal de atendimento
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className={cn(
      "h-full flex flex-col",
      isDarkMode ? "bg-[#09090b]" : "bg-white"
    )}>
      {/* Header da seção */}
      <div className={cn(
        "p-6 border-b flex items-center justify-between",
        isDarkMode ? "border-[#3f3f46]" : "border-gray-200"
      )}>
        <div>
          <h2 className={cn(
            "text-2xl font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Canais de Atendimento
          </h2>
          <p className={cn(
            "text-sm mt-1",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            Selecione um canal para acessar as conversas
          </p>
        </div>
      </div>

      {/* Lista de canais */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {availableChannels.map((channel) => (
          <ChannelItem key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
};
