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

// Helper function for timeout
const fetchMessagesWithTimeout = (channelService: ChannelService, timeoutMs: number): Promise<any[]> => {
  return new Promise(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout: Fetching messages took longer than ${timeoutMs / 1000} seconds.`));
    }, timeoutMs);

    try {
      const messages = await channelService.fetchMessages();
      clearTimeout(timeoutId);
      resolve(messages);
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
};

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
    setDebugInfo(prev => [...prev, info]);
  };

  // useCallback ainda é útil para a função em si, mas não será mais dependência do useEffect principal
  const loadAllConversations = useCallback(async () => {
    setDebugInfo([]);
    addDebugInfo('Iniciando busca de conversas (com timeout)...');
    setLoading(true);
    setError(null);
    const FETCH_TIMEOUT = 15000; // 15 segundos timeout

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

      addDebugInfo(`Iniciando busca de mensagens para cada canal (timeout: ${FETCH_TIMEOUT / 1000}s)...`);
      const allConversationsPromises = accessibleChannelIds.map(async (channelId) => {
        addDebugInfo(`- [${channelId}] Iniciando busca...`);
        try {
          const channelService = new ChannelService(channelId);
          const rawMessages = await fetchMessagesWithTimeout(channelService, FETCH_TIMEOUT);
          addDebugInfo(`- [${channelId}] Recebidas ${rawMessages.length} mensagens.`);
          const grouped = MessageProcessor.groupMessagesByPhone(rawMessages, channelId);
          addDebugInfo(`- [${channelId}] Agrupadas ${grouped.length} conversas. Sucesso.`);
          return { status: 'fulfilled', value: grouped.map(conv => ({ ...conv, channelId })), channelId };
        } catch (channelError) {
          const errorMsg = channelError instanceof Error ? channelError.message : String(channelError);
          if (errorMsg.startsWith('Timeout:')) {
             addDebugInfo(`- [${channelId}] TIMEOUT: ${errorMsg}`);
          } else {
             addDebugInfo(`- [${channelId}] ERRO: ${errorMsg}`);
          }
          console.error(`❌ [ChannelsPageLayout] Error/Timeout loading conversations for channel ${channelId}:`, channelError);
          return { status: 'rejected', reason: errorMsg, channelId };
        }
      });

      addDebugInfo('Aguardando todas as buscas terminarem (Promise.allSettled)...');
      const results = await Promise.allSettled(allConversationsPromises);
      addDebugInfo('Todas as buscas individuais concluídas (Promise.allSettled resolveu).');

      const successfulConversations: UnifiedConversation[] = [];
      results.forEach((result, index) => {
        const channelId = accessibleChannelIds[index];
        if (result.status === 'fulfilled') {
          if (result.value.status === 'fulfilled') {
             addDebugInfo(`- [${channelId}] Resultado: Sucesso (${result.value.value.length} conversas)`);
             successfulConversations.push(...result.value.value);
          } else {
             addDebugInfo(`- [${channelId}] Resultado: Falha (Erro/Timeout: ${result.value.reason})`);
          }
        } else {
          const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
          addDebugInfo(`- [${channelId}] Resultado: Falha Inesperada (Promise rejeitada: ${reason})`);
        }
      });

      addDebugInfo(`Total de conversas de buscas bem-sucedidas: ${successfulConversations.length}`);

      addDebugInfo('Ordenando conversas bem-sucedidas...');
      const sortedConversations = successfulConversations.sort((a, b) => {
        const timeA = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
        const timeB = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
        return timeB - timeA;
      });
      addDebugInfo(`Conversas ordenadas. Total final: ${sortedConversations.length}`);
      setConversations(sortedConversations);
      addDebugInfo('Processamento concluído.');

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
  // A dependência getAccessibleChannels pode causar o loop se ela for recriada a cada render.
  // Vamos remover por enquanto para forçar a execução única e quebrar o loop.
  // Se a lista de canais acessíveis precisar ser dinâmica, precisaremos de outra abordagem (Context API ou memoização estável da função).
  }, [/* getAccessibleChannels */]);

  // Alteração principal: Executar apenas uma vez na montagem
  useEffect(() => {
    addDebugInfo('useEffect (montagem) disparado. Chamando loadAllConversations...');
    loadAllConversations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array de dependências vazio para executar apenas uma vez

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

        <ul className="list-disc list-inside max-h-48 overflow-y-auto">
          {debugInfo.map((info, index) => (
            <li key={index}>{info}</li>
          ))}
          {loading && <li>Status: Carregando...</li>}
          {!loading && error && <li>Status: Erro Geral - {error}</li>}
          {!loading && !error && <li>Status: Processado ({conversations.length} conversas exibidas)</li>}
        </ul>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {loading && (
            <div className="flex items-center justify-center p-8">
            </div>
          )}
          {!loading && error && (
            <div className="flex items-center justify-center p-8 text-red-500">
              Ocorreu um erro geral ao carregar as conversas. Verifique a área de depuração.
            </div>
          )}
          {!loading && !error && conversations.length === 0 && (
            <div className="flex items-center justify-center p-8">
              <p className={cn("text-center", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                Nenhuma conversa recente encontrada ou todas as buscas falharam/expiraram.
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

