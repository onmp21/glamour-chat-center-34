
import React from 'react';
import { useChannels } from '@/contexts/ChannelContext';
import { useChannelConversations } from '@/hooks/useChannelConversations';
import { cn } from '@/lib/utils';
import { ChannelCard } from "@/components/ui/channel-card";

interface MobileChannelsListProps {
  isDarkMode: boolean;
  onChannelSelect: (channelId: string) => void;
}

export const MobileChannelsList: React.FC<MobileChannelsListProps> = ({
  isDarkMode,
  onChannelSelect
}) => {
  const { channels } = useChannels();

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

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center px-4 py-3 border-b"
           style={{ borderColor: isDarkMode ? "#2a2a2a" : "#ececec" }}>
        <span className={cn("text-lg font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
          Canais
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 pb-20">
        {channels.filter((c) => c.isActive).map((channel) => {
          const legacyId = getChannelLegacyId(channel);
          
          return (
            <ChannelCardWithCount
              key={channel.id}
              channel={channel}
              legacyId={legacyId}
              isDarkMode={isDarkMode}
              onChannelSelect={onChannelSelect}
            />
          );
        })}
      </div>
    </div>
  );
};

// Componente separado para evitar muitos hooks no componente principal
const ChannelCardWithCount: React.FC<{
  channel: any;
  legacyId: string;
  isDarkMode: boolean;
  onChannelSelect: (channelId: string) => void;
}> = ({ channel, legacyId, isDarkMode, onChannelSelect }) => {
  const { conversations } = useChannelConversations(legacyId);
  const unreadCount = conversations.filter(c => c.status === 'unread').length;
  
  return (
    <div className="relative mb-3">
      <ChannelCard
        name={channel.name}
        subtitle={channel.type === "general" ? "Geral" : channel.name}
        count={conversations.length}
        isDarkMode={isDarkMode}
        onClick={() => onChannelSelect(legacyId)}
        compact={false}
      />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {unreadCount}
        </div>
      )}
    </div>
  );
};
