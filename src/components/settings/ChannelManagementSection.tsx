
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Folder, AlertTriangle } from 'lucide-react';
import { useChannels } from '@/contexts/ChannelContext';

interface ChannelManagementSectionProps {
  isDarkMode: boolean;
}

export const ChannelManagementSection: React.FC<ChannelManagementSectionProps> = ({ isDarkMode }) => {
  const { channels, updateChannelStatus } = useChannels();

  const getTypeLabel = (type: 'general' | 'store' | 'manager') => {
    const labels = {
      general: 'Geral',
      store: 'Loja',
      manager: 'Gerência'
    };
    return labels[type];
  };

  const getTypeBadgeColor = (type: 'general' | 'store' | 'manager') => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      store: 'bg-green-100 text-green-800',
      manager: 'bg-purple-100 text-purple-800'
    };
    return colors[type];
  };

  const handleToggleChannel = (channelId: string, isActive: boolean) => {
    updateChannelStatus(channelId, isActive);
  };

  return (
    <Card className={cn(
      "border",
      isDarkMode ? "bg-stone-800 border-stone-600" : "bg-white border-gray-200"
    )}>
      <CardHeader>
        <CardTitle className={cn(
          "flex items-center space-x-2",
          isDarkMode ? "text-stone-100" : "text-gray-900"
        )}>
          <Folder size={20} />
          <span>Gerenciamento de Canais</span>
        </CardTitle>
        
        <div className={cn(
          "flex items-center space-x-2 p-3 rounded-lg border-l-4",
          isDarkMode ? "bg-stone-700 border-orange-400" : "bg-orange-50 border-orange-400"
        )}>
          <AlertTriangle size={16} className="text-orange-500" />
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-stone-200" : "text-orange-800"
          )}>
            <strong>Atenção:</strong> A adição de novos canais ou a exclusão permanente de canais existentes deve ser solicitada ao desenvolvedor do sistema.
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {channels.map(channel => (
            <div key={channel.id} className={cn(
              "flex items-center justify-between p-4 rounded-lg border",
              isDarkMode ? "border-stone-600" : "border-gray-200"
            )} style={{
              backgroundColor: isDarkMode ? '#3a3a3a' : '#f9f9f9'
            }}>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className={cn(
                    "font-medium",
                    isDarkMode ? "text-stone-100" : "text-gray-900"
                  )}>
                    {channel.name}
                  </h4>
                  <Badge className={getTypeBadgeColor(channel.type)}>
                    {getTypeLabel(channel.type)}
                  </Badge>
                  {channel.isDefault && (
                    <Badge variant="outline" className={cn(
                      isDarkMode ? "border-stone-400 text-stone-300" : "border-gray-400 text-gray-600"
                    )}>
                      Padrão
                    </Badge>
                  )}
                </div>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-stone-400" : "text-gray-600"
                )}>
                  Status: {channel.isActive ? 'Ativo' : 'Inativo'}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={cn(
                  "text-sm",
                  isDarkMode ? "text-stone-300" : "text-gray-700"
                )}>
                  {channel.isActive ? 'Ativo' : 'Inativo'}
                </span>
                <Switch
                  checked={channel.isActive}
                  onCheckedChange={(checked) => handleToggleChannel(channel.id, checked)}
                  disabled={channel.isDefault}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className={cn(
          "mt-6 p-4 rounded-lg",
          isDarkMode ? "text-stone-300" : "text-gray-600"
        )} style={{
          backgroundColor: isDarkMode ? '#3a3a3a' : '#f0f0f0'
        }}>
          <h5 className={cn(
            "font-medium mb-2",
            isDarkMode ? "text-stone-100" : "text-gray-900"
          )}>
            Informações Importantes:
          </h5>
          <ul className={cn(
            "text-sm space-y-1",
            isDarkMode ? "text-stone-300" : "text-gray-600"
          )}>
            <li>• Canais padrão não podem ser desativados</li>
            <li>• Desativar um canal remove o acesso de todos os usuários</li>
            <li>• Alterações entram em vigor imediatamente</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
