
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
      <div className="hidden sm:block mb-6">
        <h2 className={cn(
          "text-xl font-bold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Canais
        </h2>
      </div>
      
      {/* Grid de cards de canais - com alinhamento corrigido */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {availableChannels.map(channel => (
          <div key={channel.id} className="flex">
            <NewChannelCard 
              name={channel.name} 
              count={channel.conversationCount} 
              isDarkMode={isDarkMode} 
              onClick={() => onChannelClick(channel.id)} 
              compact={true} 
              className="w-full"
            />
          </div>
        ))}
      </div>
      {/* Mobile: cards de canais NÃO exibidos */}
    </div>
  );
};
