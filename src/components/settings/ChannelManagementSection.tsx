
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useChannels } from '@/contexts/ChannelContext';
import { cn } from '@/lib/utils';
import { Folder, Loader2 } from 'lucide-react';

interface ChannelManagementSectionProps {
  isDarkMode: boolean;
}

export const ChannelManagementSection: React.FC<ChannelManagementSectionProps> = ({ isDarkMode }) => {
  const { channels, loading, updateChannelStatus } = useChannels();

  const getTypeLabel = (type: 'general' | 'store' | 'manager' | 'admin') => {
    const labels = {
      general: 'Geral',
      store: 'Loja',
      manager: 'Gerência',
      admin: 'Administração'
    };
    return labels[type];
  };

  const getTypeBadgeColor = (type: 'general' | 'store' | 'manager' | 'admin') => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      store: 'bg-green-100 text-green-800',
      manager: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800'
    };
    return colors[type];
  };

  const handleToggleChannel = async (channelId: string, isActive: boolean) => {
    await updateChannelStatus(channelId, isActive);
  };

  if (loading) {
    return (
      <Card className={cn("border")} style={{
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        borderColor: isDarkMode ? '#333333' : '#e5e7eb'
      }}>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className={cn("ml-2", isDarkMode ? "text-white" : "text-gray-900")}>
            Carregando canais...
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border")} style={{
      backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
      borderColor: isDarkMode ? '#333333' : '#e5e7eb'
    }}>
      <CardHeader>
        <CardTitle className={cn(
          "flex items-center space-x-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <Folder size={20} />
          <span>Gerenciamento de Canais</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {channels.map(channel => (
            <div key={channel.id} className={cn(
              "flex items-center justify-between p-4 rounded-lg border"
            )} style={{
              backgroundColor: isDarkMode ? '#2a2a2a' : '#f9f9f9',
              borderColor: isDarkMode ? '#333333' : '#e5e7eb'
            }}>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className={cn(
                    "font-medium",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {channel.name}
                  </h4>
                  <Badge className={getTypeBadgeColor(channel.type)}>
                    {getTypeLabel(channel.type)}
                  </Badge>
                  {channel.isDefault && (
                    <Badge variant="outline" className={cn(
                      isDarkMode ? "border-gray-400 text-gray-300" : "border-gray-400 text-gray-600"
                    )}>
                      Padrão
                    </Badge>
                  )}
                </div>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                )}>
                  Status: {channel.isActive ? 'Ativo' : 'Inativo'}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  {channel.isActive ? 'Ativo' : 'Inativo'}
                </span>
                <Switch
                  checked={channel.isActive}
                  onCheckedChange={(checked) => handleToggleChannel(channel.id, checked)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
