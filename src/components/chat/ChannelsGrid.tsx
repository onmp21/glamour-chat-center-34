
import React from 'react';
import { cn } from '@/lib/utils';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Hash, Users, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ChannelsGridProps {
  isDarkMode: boolean;
  onChannelSelect: (channelId: string) => void;
}

export const ChannelsGrid: React.FC<ChannelsGridProps> = ({
  isDarkMode,
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
  const availableChannels = channels
    .filter(channel => channel.isActive)
    .map(channel => ({
      ...channel,
      legacyId: getChannelLegacyId(channel)
    }))
    .filter(channel => accessibleChannels.includes(channel.legacyId));

  const getChannelIcon = (channelName: string) => {
    if (channelName.toLowerCase().includes('gerente')) return Users;
    return Hash;
  };

  return (
    <div className={cn(
      "h-full flex flex-col",
      isDarkMode ? "bg-[#09090b]" : "bg-white"
    )}>
      {/* Header */}
      <div className={cn(
        "p-6 border-b",
        isDarkMode ? "border-zinc-800" : "border-gray-200"
      )}>
        <h1 className={cn(
          "text-2xl font-bold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Canais
        </h1>
        <p className={cn(
          "text-sm mt-1",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}>
          Selecione um canal para ver as conversas
        </p>
      </div>

      {/* Channels Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableChannels.map(channel => {
            const IconComponent = getChannelIcon(channel.name);
            
            return (
              <Card
                key={channel.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
                  isDarkMode 
                    ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800" 
                    : "bg-white border-gray-200 hover:bg-gray-50"
                )}
                onClick={() => onChannelSelect(channel.legacyId)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "p-3 rounded-full",
                      isDarkMode ? "bg-zinc-800" : "bg-gray-100"
                    )}>
                      <IconComponent size={24} className="text-[#b5103c]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "font-semibold text-lg truncate",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>
                        {channel.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <MessageCircle size={14} className={cn(
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        )} />
                        <span className={cn(
                          "text-sm",
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        )}>
                          Ver conversas
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {availableChannels.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Hash size={48} className={cn(
                "mx-auto mb-4",
                isDarkMode ? "text-gray-600" : "text-gray-400"
              )} />
              <h3 className={cn(
                "text-lg font-medium mb-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Nenhum canal disponível
              </h3>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                Você não tem acesso a nenhum canal no momento
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
