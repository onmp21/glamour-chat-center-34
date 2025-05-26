
import React from 'react';
import { ChannelCard as NewChannelCard } from "@/components/ui/channel-card";

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
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ color: "#b5103c" }} className="text-lg md:text-xl lg:text-3xl font-semibold">
          Canais de Atendimento
        </h2>
      </div>
      {/* Grid de cards de canais - APENAS em desktop/tablet com espaçamento reduzido */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
        {availableChannels.map(channel =>
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
        )}
      </div>
      {/* Mobile: cards de canais NÃO exibidos */}
    </div>
  );
};
