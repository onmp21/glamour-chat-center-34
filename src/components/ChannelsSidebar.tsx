
import React from 'react';
import { cn } from '@/lib/utils';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { MessageCircle, Phone, Users, Building2 } from 'lucide-react';

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

  // Função para obter ícone do canal
  const getChannelIcon = (channelName: string) => {
    if (channelName.includes('Yelena') || channelName.includes('AI')) {
      return MessageCircle;
    }
    if (channelName.includes('Gerente')) {
      return Users;
    }
    return Building2;
  };

  // Função para obter cor do ícone
  const getChannelIconColor = (channelName: string) => {
    if (channelName.includes('Yelena') || channelName.includes('AI')) return 'text-blue-500';
    if (channelName.includes('Gerente')) return 'text-orange-500';
    return 'text-green-500';
  };

  const handleChannelClick = (channelId: string) => {
    onChannelSelect(channelId);
  };

  return (
    <div className={cn(
      "w-80 flex-shrink-0 border-r h-full",
      isDarkMode ? "bg-[#09090b] border-[#3f3f46]" : "bg-white border-gray-200"
    )}>
      {/* Header */}
      <div className={cn(
        "p-4 border-b",
        isDarkMode ? "border-[#3f3f46]" : "border-gray-200"
      )}>
        <h2 className={cn(
          "text-xl font-semibold",
          isDarkMode ? "text-[#fafafa]" : "text-gray-900"
        )}>
          Canais
        </h2>
        <p className={cn(
          "text-sm mt-1",
          isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
        )}>
          Selecione um canal para acessar
        </p>
      </div>

      {/* Lista de Canais */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {availableChannels.map((channel) => {
          const IconComponent = getChannelIcon(channel.name);
          const isActive = activeSection === channel.legacyId;
          
          return (
            <button
              key={channel.id}
              onClick={() => handleChannelClick(channel.legacyId)}
              className={cn(
                "w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left",
                isActive
                  ? (isDarkMode ? "bg-[#b5103c]/20 border border-[#b5103c]" : "bg-[#b5103c]/10 border border-[#b5103c]")
                  : (isDarkMode ? "hover:bg-[#27272a] border border-transparent" : "hover:bg-gray-50 border border-transparent")
              )}
            >
              <IconComponent 
                size={20} 
                className={cn(
                  isActive ? "text-[#b5103c]" : getChannelIconColor(channel.name)
                )}
              />
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-medium truncate",
                  isActive 
                    ? "text-[#b5103c]" 
                    : (isDarkMode ? "text-[#fafafa]" : "text-gray-900")
                )}>
                  {channel.name}
                </p>
                <p className={cn(
                  "text-xs",
                  isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
                )}>
                  {channel.type === 'general' && 'Geral'}
                  {channel.type === 'store' && 'Loja'}
                  {channel.type === 'manager' && 'Gerência'}
                  {channel.type === 'admin' && 'Administração'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
