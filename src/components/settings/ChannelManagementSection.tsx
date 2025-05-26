
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useChannelsDB } from '@/hooks/useChannelsDB';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Folder, AlertTriangle, Save, Loader2, Plus } from 'lucide-react';

interface ChannelManagementSectionProps {
  isDarkMode: boolean;
}

export const ChannelManagementSection: React.FC<ChannelManagementSectionProps> = ({ isDarkMode }) => {
  const { channels, loading, error, createChannel, deleteChannel, loadChannels, updateChannelStatus } = useChannelsDB();
  const { logChannelAction } = useAuditLogger();
  const { toast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'general' | 'store' | 'manager' | 'admin'>('general');
  const [creating, setCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const logSystemAction = useCallback(async (action: string, details: any) => {
    try {
      await logChannelAction(action, undefined, details);
    } catch (error) {
      console.error('Erro ao registrar ação:', error);
    }
  }, [logChannelAction]);

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

  const handleToggleChannel = useCallback(async (channelId: string, isActive: boolean) => {
    const channel = channels.find(c => c.id === channelId);
    if (!channel) return;
    
    if (channel.is_default && !isActive) {
      toast({
        title: "Ação não permitida",
        description: "Canais padrão não podem ser desativados",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateChannelStatus(channelId, isActive);
      console.log(`Canal ${channelId} ${isActive ? 'ativado' : 'desativado'} com sucesso`);
    } catch (error) {
      console.error('Erro ao atualizar canal:', error);
    }
  }, [channels, updateChannelStatus, toast]);

  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do canal é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      setCreating(true);
      console.log('Criando canal:', { name: newChannelName, type: newChannelType });
      
      const success = await createChannel(newChannelName.trim(), newChannelType);
      
      if (success) {
        console.log('Canal criado com sucesso');
        await logSystemAction('create', {
          channel_name: newChannelName,
          channel_type: newChannelType
        });
        
        setNewChannelName('');
        setNewChannelType('general');
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Erro ao criar canal:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteChannel = async (channelId: string, channelName: string) => {
    try {
      setDeleting(channelId);
      console.log('Deletando canal:', channelId);
      
      const success = await deleteChannel(channelId);
      
      if (success) {
        console.log('Canal deletado com sucesso');
        await logSystemAction('delete', {
          channel_name: channelName
        });
        
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Erro ao deletar canal:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <Card className={cn("border")} style={{
        backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
        borderColor: isDarkMode ? '#686868' : '#e5e7eb'
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

  if (error) {
    return (
      <Card className={cn("border")} style={{
        backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
        borderColor: isDarkMode ? '#686868' : '#e5e7eb'
      }}>
        <CardContent className="flex items-center justify-center p-6">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <span className={cn("ml-2", isDarkMode ? "text-white" : "text-gray-900")}>
            {error}
          </span>
          <Button 
            onClick={loadChannels} 
            variant="outline" 
            size="sm" 
            className="ml-4"
          >
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn("border")} style={{
        backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
        borderColor: isDarkMode ? '#686868' : '#e5e7eb'
      }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={cn(
              "flex items-center space-x-2",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              <Folder size={20} />
              <span>Gerenciamento de Canais</span>
            </CardTitle>
            
            <Button
              onClick={() => setShowCreateModal(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus size={16} className="mr-2" />
              Novo Canal
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {channels.map(channel => (
              <div key={channel.id} className={cn(
                "flex items-center justify-between p-4 rounded-lg border"
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
                    {channel.is_default && (
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
                    Status: {channel.is_active ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}>
                    {channel.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                  <Switch
                    checked={channel.is_active}
                    onCheckedChange={(checked) => handleToggleChannel(channel.id, checked)}
                    disabled={saving}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de criar canal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={cn(
            "rounded-lg p-6 w-96",
            isDarkMode ? "bg-gray-800" : "bg-white"
          )}>
            <h4 className={cn(
              "font-medium mb-4 text-lg",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Criar Novo Canal
            </h4>
            <div className="space-y-4">
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  Nome do Canal
                </label>
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="Digite o nome do canal"
                  className={cn(
                    "w-full p-3 border rounded-lg",
                    isDarkMode 
                      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" 
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  )}
                />
              </div>
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  Tipo do Canal
                </label>
                <select
                  value={newChannelType}
                  onChange={(e) => setNewChannelType(e.target.value as 'general' | 'store' | 'manager' | 'admin')}
                  className={cn(
                    "w-full p-3 border rounded-lg",
                    isDarkMode 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  )}
                >
                  <option value="general">Geral</option>
                  <option value="store">Loja</option>
                  <option value="manager">Gerência</option>
                  <option value="admin">Administração</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                onClick={() => setShowCreateModal(false)}
                variant="outline"
                disabled={creating}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateChannel}
                disabled={creating || !newChannelName.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {creating ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Canal'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

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
