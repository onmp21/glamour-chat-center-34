
import React from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
      case 'unread': return 'bg-blue-500';
      case 'in_progress': return 'bg-amber-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={cn(
      "w-96 border-r flex flex-col",
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
    )}>
      {/* Header */}
      <div className={cn(
        "p-4 border-b",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <h2 className={cn("text-lg font-semibold mb-3", isDarkMode ? "text-white" : "text-gray-900")}>
          Conversas
        </h2>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-10 rounded-lg border-0 focus:ring-2",
              isDarkMode 
                ? "bg-gray-700 text-white placeholder:text-gray-400 focus:ring-blue-500"
                : "bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:ring-blue-500"
            )}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
              {searchTerm ? "Nenhuma conversa encontrada" : "Nenhuma conversa disponível"}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onConversationSelect(conversation.id)}
              className={cn(
                "flex items-center p-4 hover:bg-gray-100 cursor-pointer transition-colors border-b",
                selectedConversation === conversation.id 
                  ? (isDarkMode ? "bg-gray-700" : "bg-blue-50")
                  : (isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"),
                isDarkMode ? "border-gray-700" : "border-gray-100"
              )}
            >
              <Avatar className="w-12 h-12 mr-3">
                <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                  {getInitials(conversation.contact_name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={cn("font-semibold text-sm truncate", isDarkMode ? "text-white" : "text-gray-900")}>
                    {conversation.contact_name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={cn("text-xs px-2 py-1", getStatusColor(conversation.status))}>
                      {conversation.status === 'unread' && 'Nova'}
                      {conversation.status === 'in_progress' && 'Ativa'}
                      {conversation.status === 'resolved' && 'Resolvida'}
                    </Badge>
                    {conversation.last_message_time && (
                      <span className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        {format(new Date(conversation.last_message_time), 'HH:mm', { locale: ptBR })}
                      </span>
                    )}
                  </div>
                </div>
                <p className={cn("text-xs mb-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  {conversation.contact_phone}
                </p>
                {conversation.last_message && (
                  <p className={cn("text-xs truncate", isDarkMode ? "text-gray-300" : "text-gray-600")}>
                    {conversation.last_message}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
