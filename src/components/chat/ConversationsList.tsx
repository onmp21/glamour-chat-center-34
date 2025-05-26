
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { ChannelConversation } from '@/hooks/useChannelConversations';

interface ConversationsListProps {
  isDarkMode: boolean;
  conversations: ChannelConversation[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedConversation: string | null;
  onConversationSelect: (id: string) => void;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({
  isDarkMode,
  conversations,
  loading,
  searchTerm,
  setSearchTerm,
  selectedConversation,
  onConversationSelect
}) => {
  const filteredConversations = conversations.filter(conv =>
    conv.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.contact_phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'unread': return 'Nova';
      case 'in_progress': return 'Em progresso';
      case 'resolved': return 'Resolvida';
      default: return status;
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full",
      isDarkMode ? "bg-zinc-900" : "bg-white"
    )}>
      {/* Header de busca */}
      <div className={cn(
        "p-4 border-b",
        isDarkMode ? "border-zinc-800" : "border-gray-200"
      )}>
        <h2 className={cn("text-xl font-semibold mb-3", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
          Conversas
        </h2>
        <div className="relative">
          <Search size={18} className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2",
            isDarkMode ? "text-zinc-500" : "text-gray-500"
          )} />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-10",
              isDarkMode 
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" 
                : "bg-gray-50 border-gray-200"
            )}
          />
        </div>
      </div>

      {/* Lista de conversas */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4">
            <div className="text-center">
              <p className={cn("text-sm", isDarkMode ? "text-zinc-500" : "text-gray-500")}>
                Carregando conversas...
              </p>
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4">
            <div className="text-center">
              <p className={cn("text-sm", isDarkMode ? "text-zinc-500" : "text-gray-500")}>
                {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa disponível'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-colors",
                  selectedConversation === conversation.id
                    ? isDarkMode 
                      ? "bg-zinc-800 border-l-4 border-l-[#b5103c]" 
                      : "bg-gray-100 border-l-4 border-l-[#b5103c]"
                    : isDarkMode 
                      ? "hover:bg-zinc-800" 
                      : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={cn(
                        "font-medium text-sm truncate",
                        isDarkMode ? "text-zinc-100" : "text-gray-900"
                      )}>
                        {conversation.contact_name}
                      </h3>
                      <Badge 
                        className={cn(
                          "text-xs px-2 py-0.5 text-white",
                          getStatusColor(conversation.status)
                        )}
                      >
                        {getStatusText(conversation.status)}
                      </Badge>
                    </div>
                    <p className={cn(
                      "text-xs mb-1",
                      isDarkMode ? "text-zinc-500" : "text-gray-500"
                    )}>
                      {conversation.contact_phone}
                    </p>
                    {conversation.last_message && (
                      <p className={cn(
                        "text-xs truncate",
                        isDarkMode ? "text-zinc-400" : "text-gray-600"
                      )}>
                        {conversation.last_message}
                      </p>
                    )}
                  </div>
                  
                  {conversation.last_message_time && (
                    <div className="flex-shrink-0 ml-2">
                      <p className={cn(
                        "text-xs",
                        isDarkMode ? "text-zinc-500" : "text-gray-500"
                      )}>
                        {new Date(conversation.last_message_time).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
