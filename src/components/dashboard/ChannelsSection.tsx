
import React, { useState } from 'react';
import { useChannelsDB } from '@/hooks/useChannelsDB';
import { ChannelButton } from '@/components/ChannelButton';
import { AddChannelModal } from '@/components/AddChannelModal';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChannelsSectionProps {
  isDarkMode: boolean;
  onChannelClick: (channelId: string) => void;
}

export const ChannelsSection: React.FC<ChannelsSectionProps> = ({ 
  isDarkMode, 
  onChannelClick 
}) => {
  const { channels, loading, createChannel } = useChannelsDB();
  const [showAddModal, setShowAddModal] = useState(false);
  const [pinnedChannels] = useState<string[]>([]);
  const { toast } = useToast();

  const handleAddChannel = async (name: string) => {
    try {
      await createChannel(name, 'general');
      toast({
        title: "Canal adicionado",
        description: `Canal "${name}" foi criado com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar canal",
        variant: "destructive"
      });
    }
  };

  const handleChannelClick = (channelId: string) => {
    console.log('🔥 Channel clicked:', channelId);
    onChannelClick(channelId);
  };

  const togglePin = (channelId: string) => {
    console.log('Toggle pin for channel:', channelId);
  };

  const removeChannel = (channelId: string) => {
    console.log('Remove channel:', channelId);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={cn(
            "h-24 rounded-lg animate-pulse",
            isDarkMode ? "bg-gray-800" : "bg-gray-200"
          )} />
        ))}
      </div>
    );
  }

  // Separar canais fixados e não fixados
  const pinnedChannelsList = channels.filter(channel => pinnedChannels.includes(channel.id));
  const unpinnedChannels = channels.filter(channel => !pinnedChannels.includes(channel.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={cn(
          "text-lg font-semibold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Canais de Atendimento
        </h2>
        <Button
          onClick={() => setShowAddModal(true)}
          size="sm"
          className="bg-villa-primary hover:bg-villa-primary/90 btn-animate"
        >
          <Plus size={16} className="mr-1" />
          Adicionar Canal
        </Button>
      </div>

      {/* Canais Fixados */}
      {pinnedChannelsList.length > 0 && (
        <div>
          <h3 className={cn(
            "text-sm font-medium mb-3",
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}>
            Canais Fixados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedChannelsList.map((channel) => (
              <ChannelButton
                key={channel.id}
                id={channel.id}
                name={channel.name}
                conversationCount={0}
                isPinned={true}
                isDarkMode={isDarkMode}
                onTogglePin={togglePin}
                onRemove={removeChannel}
                onClick={handleChannelClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Canais Não Fixados */}
      {unpinnedChannels.length > 0 && (
        <div>
          {pinnedChannelsList.length > 0 && (
            <h3 className={cn(
              "text-sm font-medium mb-3",
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>
              Outros Canais
            </h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unpinnedChannels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => handleChannelClick(channel.id)}
                className={cn(
                  "p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg btn-animate",
                  isDarkMode 
                    ? "bg-zinc-900 border-zinc-700 hover:border-villa-primary" 
                    : "bg-white border-gray-200 hover:border-villa-primary"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={cn(
                      "text-lg font-semibold mb-2",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>
                      {channel.name}
                    </h3>
                    <p className={cn(
                      "text-sm",
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    )}>
                      0 conversas ativas
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {channels.length === 0 && (
        <div className={cn(
          "text-center py-12 rounded-lg border-2 border-dashed",
          isDarkMode 
            ? "border-gray-700 text-gray-400" 
            : "border-gray-300 text-gray-500"
        )}>
          <div className="max-w-sm mx-auto">
            <h3 className="text-lg font-medium mb-2">Nenhum canal encontrado</h3>
            <p className="text-sm mb-4">
              Adicione seu primeiro canal de atendimento para começar a gerenciar conversas.
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-villa-primary hover:bg-villa-primary/90 btn-animate"
            >
              <Plus size={16} className="mr-1" />
              Adicionar Primeiro Canal
            </Button>
          </div>
        </div>
      )}

      <AddChannelModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddChannel={handleAddChannel}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
