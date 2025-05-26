
import React from 'react';
import { Button } from '@/components/ui/button';
import { useChannels } from '@/contexts/ChannelContext';
import { useChat } from '@/contexts/ChatContext';
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
  const { getTabConversations } = useChat();

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
          const channelConversations = getTabConversations(channel.id);
          const unreadCount = channelConversations.filter(c => c.status === 'unread').length;
          
          return (
            <div key={channel.id} className="relative mb-3">
              <ChannelCard
                name={channel.name}
                subtitle={channel.type === "general" ? "Geral" : channel.name}
                count={channelConversations.length}
                isDarkMode={isDarkMode}
                onClick={() => onChannelSelect(channel.id)}
                compact={false}
              />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
