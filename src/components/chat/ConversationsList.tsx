import React from 'react';
import { cn } from '@/lib/utils';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { RefreshCw, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
interface ConversationsListProps {
  channelId: string;
  activeConversation?: string | null;
  onConversationSelect: (conversationId: string) => void;
  isDarkMode: boolean;
}
export const ConversationsList: React.FC<ConversationsListProps> = ({
  channelId,
  activeConversation,
  onConversationSelect,
  isDarkMode
}) => {
  const {
    conversations,
    loading,
    refreshing,
    refreshConversations,
    updateConversationStatus
  } = useChannelConversationsRefactored(channelId);
  const {
    channels
  } = useChannels();
  const {
    getAccessibleChannels
  } = usePermissions();
  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm', {
        locale: ptBR
      });
    } else if (isYesterday(date)) {
      return 'Ontem';
    } else {
      return format(date, 'dd/MM', {
        locale: ptBR
      });
    }
  };
  const handleConversationClick = async (conversationId: string) => {
    onConversationSelect(conversationId);
    // Auto-marcar como lido quando abrir a conversa
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation && conversation.status === 'unread') {
      await updateConversationStatus(conversationId, 'in_progress');
    }
  };

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
    legacyId: getChannelLegacyId(channel)
  })).filter(channel => accessibleChannels.includes(channel.legacyId));

  // Função para obter ícone do canal
  const getChannelIcon = (channelName: string) => {
    if (channelName.includes('Yelena') || channelName.includes('AI')) return '#';
    if (channelName.includes('Gerente')) return '👨‍💼';
    return '🏪';
  };

  // Função para obter cor do ícone
  const getChannelIconColor = (channelName: string) => {
    if (channelName.includes('Yelena') || channelName.includes('AI')) return 'text-blue-500';
    if (channelName.includes('Gerente')) return 'text-red-500';
    return 'text-green-500';
  };
  if (loading) {
    return <div className={cn("h-full flex items-center justify-center", isDarkMode ? "bg-[#09090b]" : "bg-white")}>
        <div className={cn("animate-spin rounded-full h-6 w-6 border-b-2", isDarkMode ? "border-[#fafafa]" : "border-gray-900")}></div>
      </div>;
  }
  return <div className={cn("h-full flex flex-col", isDarkMode ? "bg-[#09090b]" : "bg-white")}>
      {/* Header com lista de canais */}
      <div className={cn("p-4 border-b", isDarkMode ? "bg-[#18181b] border-[#3f3f46]" : "bg-white border-gray-200")}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn("text-xl font-semibold", isDarkMode ? "text-[#fafafa]" : "text-gray-900")}>
            Conversas
          </h2>
          <Button variant="ghost" size="sm" onClick={refreshConversations} disabled={refreshing} className={cn("h-8 w-8 p-0", isDarkMode ? "hover:bg-[#27272a] text-[#fafafa]" : "hover:bg-gray-100")}>
            <RefreshCw size={16} className={cn(refreshing && "animate-spin")} />
          </Button>
        </div>

        {/* Lista de Canais em Grid */}
        <div className="grid grid-cols-2 gap-2">
          {availableChannels.map(channel => {})}
        </div>
      </div>

      {/* Lista de conversas */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? <div className="p-8 text-center">
            <MessageSquare size={48} className={cn("mx-auto mb-4", isDarkMode ? "text-[#a1a1aa]" : "text-gray-400")} />
            <p className={cn("text-sm", isDarkMode ? "text-[#a1a1aa]" : "text-gray-600")}>
              Nenhuma conversa encontrada
            </p>
          </div> : conversations.map(conversation => <div key={`${channelId}-${conversation.id}`} onClick={() => handleConversationClick(conversation.id)} className={cn("p-4 border-b cursor-pointer transition-colors rounded-xl m-2", isDarkMode ? "border-[#3f3f46] hover:bg-[#18181b]" : "border-gray-100 hover:bg-gray-50", activeConversation === conversation.id && (isDarkMode ? "bg-[#18181b]" : "bg-gray-50"))}>
              {/* Layout SEM AVATAR - seguindo WhatsApp */}
              <div className="flex flex-col space-y-2">
                {/* Linha superior: Nome e Hora */}
                <div className="flex items-center justify-between">
                  <h3 className={cn("font-medium text-base truncate", isDarkMode ? "text-[#fafafa]" : "text-gray-900")}>
                    {conversation.contact_name || conversation.contact_phone}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={cn("text-xs flex-shrink-0", isDarkMode ? "text-[#a1a1aa]" : "text-gray-500")}>
                      {formatTime(conversation.last_message_time)}
                    </span>
                    {/* Badge de mensagens não lidas */}
                    {(conversation.unread_count || 0) > 0 && <Badge variant="default" className="bg-[#b5103c] hover:bg-[#9d0e34] text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center">
                        {conversation.unread_count}
                      </Badge>}
                  </div>
                </div>
                
                {/* Linha do meio: Última mensagem */}
                <div className="flex items-center justify-between">
                  <p className={cn("text-sm truncate flex-1", isDarkMode ? "text-[#a1a1aa]" : "text-gray-600")}>
                    {conversation.last_message || 'Sem mensagens'}
                  </p>
                </div>
                
                {/* Linha inferior: Telefone e Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone size={12} className={cn(isDarkMode ? "text-[#a1a1aa]" : "text-gray-400")} />
                    <span className={cn("text-xs", isDarkMode ? "text-[#a1a1aa]" : "text-gray-400")}>
                      {conversation.contact_phone}
                    </span>
                  </div>
                  
                  <Badge variant="outline" className={cn("text-xs rounded-full", conversation.status === 'unread' && "border-[#b5103c] text-[#b5103c]", conversation.status === 'in_progress' && (isDarkMode ? "border-[#a1a1aa] text-[#a1a1aa]" : "border-yellow-500 text-yellow-600"), conversation.status === 'resolved' && (isDarkMode ? "border-[#a1a1aa] text-[#a1a1aa]" : "border-green-500 text-green-600"), isDarkMode && "border-[#3f3f46]")}>
                    {conversation.status === 'unread' && 'Nova'}
                    {conversation.status === 'in_progress' && 'Ativa'}
                    {conversation.status === 'resolved' && 'Resolvida'}
                  </Badge>
                </div>
              </div>
            </div>)}
      </div>
    </div>;
};