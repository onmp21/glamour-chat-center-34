import React, { useState, useEffect, useCallback } from 'react';
import { ConversationItem } from './chat/ConversationItem';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { ChannelService } from '@/services/ChannelService';
import { MessageProcessor } from '@/utils/MessageProcessor';
import { ChannelConversation } from '@/hooks/useChannelConversations';

interface UnifiedConversation extends ChannelConversation {
  channelId: string;
}

interface ChannelsPageLayoutProps {
  isDarkMode: boolean;
  onNavigateToChat: (channelId: string, conversationId: string) => void;
}

export const ChannelsPageLayout: React.FC<ChannelsPageLayoutProps> = ({
  isDarkMode,
  onNavigateToChat
}) => {
  const { channels } = useChannels();
  const { getAccessibleChannels } = usePermissions();
  const [conversations, setConversations] = useState<UnifiedConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Estados para debug visual
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    console.log(`[VISUAL DEBUG] ${info}`); // Manter log no console caso acessível
    setDebugInfo(prev => [...prev, info]);
  };

  const loadAllConversations = useCallback(async () => {
    setDebugInfo([]); // Limpar debug anterior
    addDebugInfo('Iniciando busca de conversas...');
    setLoading(true);
    setError(null);

    try {
      addDebugInfo('Obtendo canais acessíveis...');
      const accessibleChannelIds = getAccessibleChannels();
      addDebugInfo(`Canais acessíveis: ${accessibleChannelIds.length > 0 ? accessibleChannelIds.join(', ') : 'Nenhum'}`);

      if (accessibleChannelIds.length === 0) {
        addDebugInfo('Nenhum canal acessível encontrado. Encerrando busca.');
        setConversations([]);
        setLoading(false);
        return;
      }

      addDebugInfo('Iniciando busca de mensagens para cada canal...');
      const allConversationsPromises = accessibleChannelIds.map(async (channelId) => {
        try {
          addDebugInfo(`- Buscando mensagens para canal: ${channelId}`);
          const channelService = new ChannelService(channelId);
          const rawMessages = await channelService.fetchMessages();
          addDebugInfo(`- Recebidas ${rawMessages.length} mensagens cruas para ${channelId}`);
          addDebugInfo(`- Agrupando mensagens para ${channelId}...`);
          const grouped = MessageProcessor.groupMessagesByPhone(rawMessages, channelId);
          addDebugInfo(`- Agrupadas ${grouped.length} conversas para ${channelId}`);
          return grouped.map(conv => ({ ...conv, channelId }));
        } catch (channelError) {
          const errorMsg = channelError instanceof Error ? channelError.message : String(channelError);
          addDebugInfo(`- ERRO ao buscar/processar canal ${channelId}: ${errorMsg}`);
          console.error(`❌ [ChannelsPageLayout] Error loading conversations for channel ${channelId}:`, channelError);
          return [];
        }
      });

      addDebugInfo('Aguardando todas as buscas terminarem...');
      const results = await Promise.all(allConversationsPromises);
      addDebugInfo('Todas as buscas concluídas.');
      const flattenedConversations = results.flat();
      addDebugInfo(`Total de conversas encontradas (antes de ordenar): ${flattenedConversations.length}`);

      addDebugInfo('Ordenando conversas...');
      const sortedConversations = flattenedConversations.sort((a, b) => {
        const timeA = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
        const timeB = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
        return timeB - timeA;
      });
      addDebugInfo(`Conversas ordenadas. Total final: ${sortedConversations.length}`);
      setConversations(sortedConversations);
      addDebugInfo('Busca concluída com sucesso.');

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      addDebugInfo(`ERRO GERAL durante a busca: ${errorMsg}`);
      console.error('❌ [ChannelsPageLayout] General error loading all conversations:', err);
      setError(errorMsg);
      setConversations([]);
    } finally {
      addDebugInfo('Finalizando processo de busca (finally).');
      setLoading(false);
    }
  }, [getAccessibleChannels]);

  useEffect(() => {
    addDebugInfo('useEffect disparado.');
    loadAllConversations();
  }, [loadAllConversations]);

  const handleConversationClick = (channelId: string, conversationId: string) => {
    addDebugInfo(`Clique na conversa: Canal ${channelId}, ID ${conversationId}`);
    onNavigateToChat(channelId, conversationId);
  };

  return (
    <div className={cn(
      "flex h-full flex-col",
      isDarkMode ? "bg-[#09090b]" : "bg-white"
    )}>
      <div className={cn(
        "p-4 border-b",
        isDarkMode ? "border-[#3f3f46]" : "border-gray-200"
      )}>
        <h2 className={cn("text-xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
          Conversas Recentes (Todos os Canais)
        </h2>
        <p className={cn("text-sm mt-1", isDarkMode ? "text-gray-400" : "text-gray-600")}>
          Veja as últimas interações de todos os seus canais.
        </p>
      </div>

      {/* Área de Debug Visual */}
      <div className={cn("p-2 text-xs border-b", isDarkMode ? "bg-gray-800 text-gray-300 border-gray-700" : "bg-yellow-100 text-yellow-800 border-yellow-300")}>
        <h3 className="font-bold mb-1">Informações de Depuração:</h3>
        <ul className="list-disc list-inside max-h-32 overflow-y-auto">
          {debugInfo.map((info, index) => (
            <li key={index}>{info}</li>
          ))}
          {loading && <li>Status: Carregando...</li>}
          {!loading && error && <li>Status: Erro - {error}</li>}
          {!loading && !error && <li>Status: Carregado ({conversations.length} conversas)</li>}
        </ul>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {loading && (
            <div className="flex items-center justify-center p-8">
              {/* O loading agora é mostrado na área de debug, podemos remover ou manter este */}
              {/* <div className={cn("animate-spin rounded-full h-6 w-6 border-b-2", isDarkMode ? "border-[#fafafa]" : "border-gray-900")}></div>
              <span className={cn("ml-2", isDarkMode ? "text-[#a1a1aa]" : "text-gray-600")}>Carregando conversas...</span> */}
            </div>
          )}
          {/* Erro também é mostrado na área de debug */}
          {/* {!loading && error && (
            <div className="flex items-center justify-center p-8 text-red-500">
              Erro ao carregar conversas: {error}
            </div>
          )} */}
          {!loading && !error && conversations.length === 0 && (
            <div className="flex items-center justify-center p-8">
              <p className={cn("text-center", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                Nenhuma conversa recente encontrada em seus canais.
              </p>
            </div>
          )}
          {!loading && !error && conversations.length > 0 && (
            <div className="space-y-1 p-2">
              {conversations.map(conversation => (
                <ConversationItem
                  key={`${conversation.channelId}-${conversation.id}`}
                  conversation={conversation}
                  channelId={conversation.channelId}
                  isDarkMode={isDarkMode}
                  isActive={false}
                  onClick={() => handleConversationClick(conversation.channelId, conversation.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

