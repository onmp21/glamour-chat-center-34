import React, { useState } from 'react';
import { ChannelCard as NewChannelCard } from "@/components/ui/channel-card";
import { cn } from '@/lib/utils';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { MessageCircle, Hash, Users, Phone, User, Settings } from 'lucide-react';
interface Channel {
  id: string;
  name: string;
  conversationCount: number;
}
interface ChannelsSectionProps {
  isDarkMode: boolean;
  availableChannels: Channel[];
  onChannelClick: (channelId: string) => void;
}
export const ChannelsSection: React.FC<ChannelsSectionProps> = ({
  isDarkMode,
  availableChannels,
  onChannelClick
}) => {
  const [pinnedChannels, setPinnedChannels] = useState<string[]>([]);
  const {
    logChannelAction
  } = useAuditLogger();
  const handleTogglePin = (channelId: string) => {
    const wasPinned = pinnedChannels.includes(channelId);
    setPinnedChannels(prev => prev.includes(channelId) ? prev.filter(id => id !== channelId) : [...prev, channelId]);
    logChannelAction(wasPinned ? 'channel_unpinned' : 'channel_pinned', channelId, {
      channel_name: availableChannels.find(c => c.id === channelId)?.name
    });
  };
  const handleChannelClick = (channelId: string) => {
    const channel = availableChannels.find(c => c.id === channelId);
    logChannelAction('channel_selected_from_dashboard', channelId, {
      channel_name: channel?.name,
      conversation_count: channel?.conversationCount,
      source: 'dashboard_channels_section'
    });
    onChannelClick(channelId);
  };

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

  // Ordenar canais: fixados primeiro, depois os outros
  const sortedChannels = [...availableChannels].sort((a, b) => {
    const aIsPinned = pinnedChannels.includes(a.id);
    const bIsPinned = pinnedChannels.includes(b.id);
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return 0;
  });
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
          Canais de Atendimento
        </h2>
        <button className={cn("p-2 rounded-lg transition-colors", isDarkMode ? "hover:bg-zinc-700 text-zinc-400" : "hover:bg-gray-100 text-gray-600")}>
          <Settings size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedChannels.map(channel => {
        const IconComponent = getChannelIcon(channel.name);
        const isPinned = pinnedChannels.includes(channel.id);
        return <div key={channel.id} onClick={() => handleChannelClick(channel.id)} className="my-[27px] px-0 mx-0 bg-zinc-100 rounded-lg py-[7px]">
              {/* Pin indicator */}
              {isPinned && <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full"></div>}

              {/* Channel icon */}
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors", isDarkMode ? "bg-zinc-800" : "bg-gray-100")}>
                <IconComponent size={24} className={cn("transition-colors", isDarkMode ? "text-zinc-400 group-hover:text-white" : "text-gray-600 group-hover:text-gray-900")} />
              </div>

              {/* Channel info */}
              <div className="space-y-2">
                <h3 className={cn("font-semibold text-lg leading-tight", isDarkMode ? "text-white" : "text-gray-900")}>
                  {channel.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", isDarkMode ? "text-zinc-400" : "text-gray-600")}>
                    {channel.conversationCount} conversas
                  </span>
                  
                  {/* Status indicator */}
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className={cn("text-xs", isDarkMode ? "text-zinc-500" : "text-gray-500")}>
                      Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Pin toggle */}
              <button onClick={e => {
            e.stopPropagation();
            handleTogglePin(channel.id);
          }} className={cn("absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded", isDarkMode ? "hover:bg-zinc-700" : "hover:bg-gray-200")}>
                <svg width="12" height="12" viewBox="0 0 12 12" className={cn("transition-colors", isPinned ? "text-blue-500" : isDarkMode ? "text-zinc-500" : "text-gray-400")}>
                  <path fill="currentColor" d="M6 0L7.5 3.5L11 2L9.5 5.5L11 7L7.5 8.5L6 12L4.5 8.5L1 7L2.5 5.5L1 2L4.5 3.5L6 0Z" />
                </svg>
              </button>
            </div>;
      })}
      </div>
    </div>;
};