
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
    <div className="space-y-4">
      {/* Título da seção - apenas em desktop/tablet */}
      <div className="hidden sm:block">
        <h2 className={cn(
          "text-xl font-bold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Canais
        </h2>
      </div>
      
      {/* Layout vertical de cards de canais após o menu lateral */}
      <div className="hidden sm:flex flex-col space-y-2 max-w-xs">
        {availableChannels.map(channel => (
          <NewChannelCard 
            key={channel.id}
            name={channel.name} 
            count={channel.conversationCount} 
            isDarkMode={isDarkMode} 
            onClick={() => onChannelClick(channel.id)} 
            compact={true} 
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
};
