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
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    console.log(`[VISUAL DEBUG] ${info}`);
    setDebugInfo(prev => [...prev, info]);
  };

  const loadAllConversations = useCallback(async () => {
    setDebugInfo([]);
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
      // Modificação: Adicionar logs de início/fim para cada promise individual
      const allConversationsPromises = accessibleChannelIds.map(async (channelId) => {
        addDebugInfo(`- [${channelId}] Iniciando busca...`);
        try {
          const channelService = new ChannelService(channelId);
          const rawMessages = await channelService.fetchMessages();
          addDebugInfo(`- [${channelId}] Recebidas ${rawMessages.length} mensagens.`);
          const grouped = MessageProcessor.groupMessagesByPhone(rawMessages, channelId);
          addDebugInfo(`- [${channelId}] Agrupadas ${grouped.length} conversas. Sucesso.`);
          return grouped.map(conv => ({ ...conv, channelId }));
        } catch (channelError) {
          const errorMsg = channelError instanceof Error ? channelError.message : String(channelError);
          addDebugInfo(`- [${channelId}] ERRO: ${errorMsg}`);
          console.error(`❌ [ChannelsPageLayout] Error loading conversations for channel ${channelId}:`, channelError);
          return []; // Retorna vazio em caso de erro, mas a promise resolve
        }
      });

      addDebugInfo('Aguardando todas as buscas terminarem (Promise.all)...');
      const results = await Promise.all(allConversationsPromises);
      addDebugInfo('Todas as buscas individuais concluídas (Promise.all resolveu).');
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
        <h3 className="font-bold mb-1">Informações de Depuração (Detalhado):</h3>
        <ul className="list-disc list-inside max-h-48 overflow-y-auto"> {/* Aumentar altura máxima */}
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
          {/* Manter a lógica de exibição original, pois o debug está separado */}
          {loading && (
            <div className="flex items-center justify-center p-8">
              {/* Pode mostrar um spinner menor aqui se quiser */}
            </div>
          )}
          {!loading && error && (
            <div className="flex items-center justify-center p-8 text-red-500">
              {/* O erro principal é mostrado no debug, aqui pode ser uma mensagem genérica */}
              Ocorreu um erro ao carregar as conversas.
            </div>
          )}
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

