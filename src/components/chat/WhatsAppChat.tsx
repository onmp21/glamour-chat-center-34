
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useChannelConversations } from '@/hooks/useChannelConversations';
import { useMessages } from '@/hooks/useMessages';
import { cn } from '@/lib/utils';
import { Search, Send, MoreVertical, Phone, Video } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WhatsAppChatProps {
  isDarkMode: boolean;
  channelId: string;
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ isDarkMode, channelId }) => {
  const { conversations, loading: conversationsLoading } = useChannelConversations(channelId);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  
  const { messages, loading: messagesLoading, sendMessage, sending } = useMessages(selectedConversation || '');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    
    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.contact_phone.includes(searchTerm)
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={cn(
      "flex h-full",
      isDarkMode ? "dark-bg-primary" : "bg-gray-50"
    )}>
      {/* Lista de Conversas - Estilo WhatsApp */}
      <div className={cn(
        "w-96 border-r flex flex-col",
        isDarkMode ? "dark-bg-secondary dark-border" : "bg-white border-gray-200"
      )}>
        {/* Header da lista */}
        <div className={cn("p-4 border-b", isDarkMode ? "dark-border" : "border-gray-200")}>
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
                "pl-10 rounded-full",
                isDarkMode
                  ? "dark-bg-primary dark-border text-white placeholder:text-gray-400"
                  : "bg-gray-50 border-gray-200"
              )}
            />
          </div>
        </div>

        {/* Lista de conversas */}
        <div className="flex-1 overflow-y-auto">
          {conversationsLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                Nenhuma conversa encontrada
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={cn(
                  "flex items-center p-4 hover:bg-opacity-50 cursor-pointer transition-colors border-b",
                  selectedConversation === conversation.id 
                    ? (isDarkMode ? "bg-gray-700" : "bg-blue-50")
                    : (isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"),
                  isDarkMode ? "border-gray-700" : "border-gray-100"
                )}
              >
                <Avatar className="w-12 h-12 mr-3">
                  <AvatarFallback className="bg-green-500 text-white text-sm font-medium">
                    {getInitials(conversation.contact_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={cn("font-medium text-sm truncate", isDarkMode ? "text-white" : "text-gray-900")}>
                      {conversation.contact_name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={cn("text-xs", getStatusColor(conversation.status))}>
                        {conversation.status === 'unread' ? 'Nova' : 
                         conversation.status === 'in_progress' ? 'Em andamento' : 'Resolvida'}
                      </Badge>
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
                  {conversation.last_message_time && (
                    <p className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                      {format(new Date(conversation.last_message_time), 'HH:mm', { locale: ptBR })}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Área de Chat - Estilo WhatsApp */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Header do chat */}
            <div className={cn(
              "flex items-center justify-between p-4 border-b",
              isDarkMode ? "dark-bg-secondary dark-border" : "bg-white border-gray-200"
            )}>
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-green-500 text-white">
                    {getInitials(selectedConv.contact_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                    {selectedConv.contact_name}
                  </h3>
                  <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    {selectedConv.contact_phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <Phone size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Video size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <MoreVertical size={16} />
                </Button>
              </div>
            </div>

            {/* Mensagens */}
            <div className={cn(
              "flex-1 overflow-y-auto p-4 space-y-4",
              isDarkMode ? "dark-bg-primary" : "bg-gray-50"
            )}>
              {messagesLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    Nenhuma mensagem ainda
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.message_type === 'sent' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
                        message.message_type === 'sent'
                          ? "bg-green-500 text-white rounded-br-md"
                          : isDarkMode
                            ? "bg-gray-700 text-gray-100 rounded-bl-md"
                            : "bg-white text-gray-900 rounded-bl-md shadow-sm"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={cn(
                        "text-xs mt-1",
                        message.message_type === 'sent' 
                          ? "text-green-100" 
                          : isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}>
                        {format(new Date(message.created_at), 'HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input de mensagem */}
            <div className={cn(
              "p-4 border-t",
              isDarkMode ? "dark-bg-secondary dark-border" : "bg-white border-gray-200"
            )}>
              <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                <div className="flex-1">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite uma mensagem..."
                    className={cn(
                      "rounded-full resize-none",
                      isDarkMode
                        ? "dark-bg-primary dark-border text-white placeholder:text-gray-400"
                        : "bg-gray-50 border-gray-200"
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="rounded-full p-3 bg-green-500 hover:bg-green-600"
                >
                  {sending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send size={16} />
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className={cn(
            "flex-1 flex items-center justify-center",
            isDarkMode ? "dark-bg-primary" : "bg-gray-50"
          )}>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Send size={24} className="text-white" />
                </div>
              </div>
              <h3 className={cn("text-lg font-medium mb-2", isDarkMode ? "text-white" : "text-gray-900")}>
                Selecione uma conversa
              </h3>
              <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                Escolha uma conversa da lista para começar a conversar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
