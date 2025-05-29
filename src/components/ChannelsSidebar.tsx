
import React from 'react';
import { cn } from '@/lib/utils';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
// Remover imports desnecessários abaixo
// import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
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
  const availableChannels = channels.filter(channel => channel.isActive).map(channel => ({
    ...channel,
    legacyId: getChannelLegacyId(channel)
  })).filter(channel => accessibleChannels.includes(channel.legacyId));

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

  // Componente para card de canal - layout simplificado como na imagem 3
  const ChannelCard: React.FC<{ channel: any }> = ({ channel }) => {
    // O status "ativo" pode ser representado pelo ponto verde
    // Poderíamos adicionar lógica para status dinâmico se necessário
    const isActive = true; // Assumindo que todos os canais listados estão ativos

    return (
      <button 
        onClick={() => handleChannelClick(channel.legacyId)} 
        className={cn(
          "w-full p-4 rounded-lg border transition-all duration-150 hover:shadow-md text-left flex items-center justify-between", // Layout horizontal
          isDarkMode ? "bg-[#1f1f23] border-[#3f3f46] hover:bg-[#2a2a2e]" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
        )}
      >
        <span className={cn("font-medium text-sm", isDarkMode ? "text-gray-200" : "text-gray-800")}>
          {channel.name} 
        </span>
        {isActive && (
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div> // Ponto verde de status
        )}
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableChannels.map(channel => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </div>
    </div>
  );
};
