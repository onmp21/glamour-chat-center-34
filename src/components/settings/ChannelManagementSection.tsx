
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { cn } from '@/lib/utils';
import { Folder, AlertTriangle, Save } from 'lucide-react';
import { useChannels } from '@/contexts/ChannelContext';

interface ChannelManagementSectionProps {
  isDarkMode: boolean;
}

export const ChannelManagementSection: React.FC<ChannelManagementSectionProps> = ({ isDarkMode }) => {
  const { channels, updateChannelStatus } = useChannels();
  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

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

  const handleToggleChannel = (channelId: string, isActive: boolean) => {
    const channel = channels.find(c => c.id === channelId);
    if (!channel?.isDefault) {
      const action = isActive ? 'ativar' : 'desativar';
      setConfirmDialog({
        isOpen: true,
        title: `Confirmar ${action} canal`,
        description: `Tem certeza que deseja ${action} o canal "${channel?.name}"? ${!isActive ? 'Isso removerá o acesso de todos os usuários a este canal.' : ''}`,
        onConfirm: () => {
          setPendingChanges(prev => ({
            ...prev,
            [channelId]: isActive
          }));
          setHasUnsavedChanges(true);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      });
    }
  };

  const handleSaveChanges = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirmar alterações',
      description: 'Tem certeza que deseja salvar todas as alterações nos canais?',
      onConfirm: () => {
        Object.entries(pendingChanges).forEach(([channelId, isActive]) => {
          updateChannelStatus(channelId, isActive);
        });
        setPendingChanges({});
        setHasUnsavedChanges(false);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDiscardChanges = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Descartar alterações',
      description: 'Tem certeza que deseja descartar todas as alterações não salvas?',
      onConfirm: () => {
        setPendingChanges({});
        setHasUnsavedChanges(false);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const getChannelStatus = (channel: any) => {
    return pendingChanges.hasOwnProperty(channel.id) ? pendingChanges[channel.id] : channel.isActive;
  };

  return (
    <>
      <Card className={cn(
        "border"
      )} style={{
        backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
        borderColor: isDarkMode ? '#686868' : '#e5e7eb'
      }}>
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center space-x-2",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            <Folder size={20} />
            <span>Gerenciamento de Canais</span>
          </CardTitle>
          
          <div className={cn(
            "flex items-center space-x-2 p-3 rounded-lg border-l-4"
          )} style={{
            backgroundColor: isDarkMode ? '#686868' : '#fef3c7',
            borderColor: '#f59e0b'
          }}>
            <AlertTriangle size={16} className="text-orange-500" />
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-white" : "text-orange-800"
            )}>
              <strong>Atenção:</strong> A adição de novos canais ou a exclusão permanente de canais existentes deve ser solicitada ao desenvolvedor do sistema.
            </p>
          </div>

          {hasUnsavedChanges && (
            <div className="flex space-x-2">
              <Button
                onClick={handleSaveChanges}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save size={16} className="mr-2" />
                Salvar Alterações
              </Button>
              <Button
                onClick={handleDiscardChanges}
                variant="outline"
                size="sm"
                className={cn(
                  isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"
                )}
              >
                Descartar
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {channels.map(channel => {
              const currentStatus = getChannelStatus(channel);
              const hasChanges = pendingChanges.hasOwnProperty(channel.id);
              
              return (
                <div key={channel.id} className={cn(
                  "flex items-center justify-between p-4 rounded-lg border",
                  hasChanges ? "ring-2 ring-blue-500" : ""
                )} style={{
                  backgroundColor: isDarkMode ? '#686868' : '#f9f9f9',
                  borderColor: isDarkMode ? '#686868' : '#e5e7eb'
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
                      {hasChanges && (
                        <Badge variant="outline" className="border-blue-500 text-blue-500">
                          Alterado
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      "text-sm",
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    )}>
                      Status: {currentStatus ? 'Ativo' : 'Inativo'}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      "text-sm",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}>
                      {currentStatus ? 'Ativo' : 'Inativo'}
                    </span>
                    <Switch
                      checked={currentStatus}
                      onCheckedChange={(checked) => handleToggleChannel(channel.id, checked)}
                      disabled={channel.isDefault}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className={cn(
            "mt-6 p-4 rounded-lg"
          )} style={{
            backgroundColor: isDarkMode ? '#686868' : '#f0f0f0'
          }}>
            <h5 className={cn(
              "font-medium mb-2",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Informações Importantes:
            </h5>
            <ul className={cn(
              "text-sm space-y-1",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
              <li>• Canais padrão não podem ser desativados</li>
              <li>• Desativar um canal remove o acesso de todos os usuários</li>
              <li>• Clique em "Salvar Alterações" para aplicar as mudanças</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        isDarkMode={isDarkMode}
      />
    </>
  );
};
