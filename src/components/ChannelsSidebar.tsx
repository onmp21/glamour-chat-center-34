
import React from 'react';
import { cn } from '@/lib/utils';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { MessageCircle } from 'lucide-react';

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
  const availableChannels = channels.filter(channel => channel.isActive).map(channel => ({
    ...channel,
    legacyId: getChannelLegacyId(channel)
  })).filter(channel => accessibleChannels.includes(channel.legacyId));

  const handleChannelClick = (channelId: string) => {
    onChannelSelect(channelId);
  };

  // Componente para card de canal - layout simplificado
  const ChannelCard: React.FC<{ channel: any }> = ({ channel }) => {
    // Mock do total de conversas (pode ser integrado com hook real depois)
    const totalConversations = Math.floor(Math.random() * 50) + 1;

    return (
      <button 
        onClick={() => handleChannelClick(channel.legacyId)} 
        className={cn(
          "w-full p-4 rounded-lg border transition-all duration-200 hover:shadow-md text-left flex items-center justify-between mono-fade-in hover:scale-[1.02]",
          isDarkMode ? "bg-[#1f1f23] border-[#3f3f46] hover:bg-[#2a2a2e]" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
        )}
      >
        <div className="flex items-center space-x-3">
          <MessageCircle size={16} className={cn(
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )} />
          <span className={cn("font-medium text-sm", isDarkMode ? "text-gray-200" : "text-gray-800")}>
            {channel.name} 
          </span>
        </div>
        <span className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-600")}>
          {totalConversations} conversas
        </span>
      </button>
    );
  };

  return (
    <div className={cn("h-full flex flex-col", isDarkMode ? "bg-[#09090b]" : "bg-white")}>
      {/* Header da seção */}
      <div className="px-[28px] my-0 mx-0 py-[9px]">
        <div>
          <h2 className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
            Canais de Atendimento
          </h2>
          <p className={cn("text-sm mt-1", isDarkMode ? "text-gray-400" : "text-gray-600")}>
            Selecione um canal para acessar as conversas
          </p>
        </div>
      </div>

      {/* Grid de canais */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableChannels.map(channel => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </div>
    </div>
  );
};
