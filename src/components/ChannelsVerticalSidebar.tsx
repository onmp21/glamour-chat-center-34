
import React from 'react';
import { cn } from '@/lib/utils';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
import { Badge } from '@/components/ui/badge';
import { Hash, Users, Store, ExternalLink, UserCheck, MessageCircle } from 'lucide-react';

interface ChannelsVerticalSidebarProps {
  isDarkMode: boolean;
  activeSection: string;
  onChannelSelect: (channelId: string) => void;
}

export const ChannelsVerticalSidebar: React.FC<ChannelsVerticalSidebarProps> = ({
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
    legacyId: getChannelLegacyId(channel),
    type: channel.type || 'general'
  })).filter(channel => accessibleChannels.includes(channel.legacyId));

  const getChannelIcon = (type: string, name: string) => {
    if (name.includes('Yelena') || name.includes('AI')) {
      return <MessageCircle size={20} className="text-blue-500" />;
    }
    if (name.includes('Gerente das Lojas')) {
      return <Users size={20} className="text-red-500" />;
    }
    if (name.includes('Gerente do Externo')) {
      return <ExternalLink size={20} className="text-orange-500" />;
    }
    if (name.includes('Pedro')) {
      return <UserCheck size={20} className="text-purple-500" />;
    }
    return <Store size={20} className="text-green-500" />;
  };

  const ChannelItem: React.FC<{ channel: any }> = ({ channel }) => {
    const { conversations, loading } = useChannelConversationsRefactored(channel.id);
    
    const unreadCount = conversations.reduce((total, conv) => {
      return total + (conv.unread_count || 0);
    }, 0);

    const isActive = activeSection === channel.legacyId;

    return (
      <div
        onClick={() => onChannelSelect(channel.legacyId)}
        className={cn(
          "p-3 cursor-pointer transition-colors border-b",
          isDarkMode 
            ? "border-[#3f3f46] hover:bg-[#18181b]" 
            : "border-gray-200 hover:bg-gray-50",
          isActive && (isDarkMode ? "bg-[#18181b] border-l-4 border-l-[#b5103c]" : "bg-blue-50 border-l-4 border-l-[#b5103c]")
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-lg",
              isDarkMode ? "bg-[#27272a]" : "bg-gray-100"
            )}>
              {getChannelIcon(channel.type, channel.name)}
            </div>
            <div>
              <h3 className={cn(
                "font-medium text-sm",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                {channel.name}
              </h3>
              <p className={cn(
                "text-xs",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>
                {loading ? 'Carregando...' : `${conversations.length} conversas`}
              </p>
            </div>
          </div>
          
          {!loading && unreadCount > 0 && (
            <Badge 
              variant="default" 
              className="bg-[#b5103c] hover:bg-[#9d0e34] text-white text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      "w-64 h-full border-r flex flex-col",
      isDarkMode ? "bg-[#09090b] border-[#3f3f46]" : "bg-white border-gray-200"
    )}>
      {/* Header */}
      <div className={cn(
        "p-4 border-b",
        isDarkMode ? "border-[#3f3f46]" : "border-gray-200"
      )}>
        <h2 className={cn(
          "text-lg font-semibold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Canais
        </h2>
        <p className={cn(
          "text-sm",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}>
          Selecione um canal para ver as conversas
        </p>
      </div>

      {/* Lista de canais */}
      <div className="flex-1 overflow-y-auto">
        {availableChannels.length === 0 ? (
          <div className="p-8 text-center">
            <Hash size={48} className={cn(
              "mx-auto mb-4",
              isDarkMode ? "text-zinc-600" : "text-gray-400"
            )} />
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-zinc-400" : "text-gray-600"
            )}>
              Nenhum canal disponível
            </p>
          </div>
        ) : (
          availableChannels.map((channel) => (
            <ChannelItem 
              key={`vertical-channel-${channel.id}`} 
              channel={channel} 
            />
          ))
        )}
      </div>
    </div>
  );
};
