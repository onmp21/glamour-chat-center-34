
import React, { useState } from 'react';
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
  const [pinnedChannels, setPinnedChannels] = useState<string[]>([]);

  const handleTogglePin = (channelId: string) => {
    setPinnedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  // Ordenar canais: fixados primeiro, depois os outros
  const sortedChannels = [...availableChannels].sort((a, b) => {
    const aIsPinned = pinnedChannels.includes(a.id);
    const bIsPinned = pinnedChannels.includes(b.id);
    
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Título da seção */}
      <h2 className={cn(
        "text-xl font-bold",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>
        Canais
      </h2>
      
      {/* Layout vertical de cards de canais com espaçamento adequado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedChannels.map(channel => (
          <NewChannelCard 
            key={channel.id}
            name={channel.name} 
            count={channel.conversationCount} 
            isDarkMode={isDarkMode} 
            onClick={() => onChannelClick(channel.id)} 
            compact={true} 
            className="w-full h-20"
            isPinned={pinnedChannels.includes(channel.id)}
            onTogglePin={() => handleTogglePin(channel.id)}
          />
        ))}
      </div>
    </div>
  );
};
