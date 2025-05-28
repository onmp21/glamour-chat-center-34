import React, { useState } from 'react';
import { ChannelCard as NewChannelCard } from "@/components/ui/channel-card";
import { cn } from '@/lib/utils';
import { useAuditLogger } from '@/hooks/useAuditLogger';
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
    logDashboardAction,
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

  // Ordenar canais: fixados primeiro, depois os outros
  const sortedChannels = [...availableChannels].sort((a, b) => {
    const aIsPinned = pinnedChannels.includes(a.id);
    const bIsPinned = pinnedChannels.includes(b.id);
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return 0;
  });
  React.useEffect(() => {
    logDashboardAction('channels_section_viewed', 'channels', {
      total_channels: availableChannels.length,
      pinned_channels: pinnedChannels.length
    });
  }, [availableChannels.length, pinnedChannels.length]);
  return <div className="space-y-6">
      {/* Título da seção */}
      <h2 className={cn("text-xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Canais de atendimento</h2>
      
      {/* Layout vertical de cards de canais */}
      <div className="space-y-3">
        {sortedChannels.map(channel => <NewChannelCard key={channel.id} name={channel.name} count={channel.conversationCount} isDarkMode={isDarkMode} onClick={() => handleChannelClick(channel.id)} compact={false} className="w-full h-16 flex-row" isPinned={pinnedChannels.includes(channel.id)} onTogglePin={() => handleTogglePin(channel.id)} />)}
      </div>
    </div>;
};