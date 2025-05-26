
import React from 'react';
import { ChannelCard as NewChannelCard } from "@/components/ui/channel-card";
import { cn } from '@/lib/utils';

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
  return (
    <div>
      {/* Título da seção - apenas em desktop/tablet */}
      <div className="hidden sm:block mb-4">
        <h2 className={cn(
          "text-xl font-bold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Canais
        </h2>
      </div>
      
      {/* Grid de cards de canais - APENAS em desktop/tablet com espaçamento reduzido */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
        {availableChannels.map(channel => (
          <NewChannelCard 
            key={channel.id} 
            name={channel.name} 
            subtitle={channel.id === "chat" ? "Canal Geral" : `Cidade: ${channel.name}`} 
            count={channel.conversationCount} 
            isDarkMode={isDarkMode} 
            status={"online"} 
            onClick={() => onChannelClick(channel.id)} 
            compact={true} 
          />
        ))}
      </div>
      {/* Mobile: cards de canais NÃO exibidos */}
    </div>
  );
};
