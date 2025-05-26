
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useChannelConversations } from '@/hooks/useChannelConversations';
import { cn } from '@/lib/utils';
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppChatProps {
  isDarkMode: boolean;
  channelId: string;
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ isDarkMode, channelId }) => {
  const { conversations, loading: conversationsLoading, updateConversationStatus } = useChannelConversations(channelId);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sending) return;
    
    try {
      setSending(true);
      
      console.log('Enviando mensagem:', { channelId, conversationId: selectedConversation, content: newMessage });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso",
      });
      
      setNewMessage('');
      
      await updateConversationStatus(selectedConversation, 'in_progress');
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem",
        variant: "destructive"
      });
    } finally {
      setSending(false);
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
      "flex h-full max-h-screen",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Lista de Conversas - Estilo WhatsApp Web */}
      <div className={cn(
        "w-[400px] border-r flex flex-col",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        {/* Header da lista */}
        <div className={cn(
          "p-4 border-b bg-gradient-to-r from-green-500 to-green-600",
          "border-gray-200"
        )}>
          <h2 className="text-lg font-semibold mb-3 text-white">
            WhatsApp Business
          </h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar ou começar uma nova conversa"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "pl-10 rounded-lg bg-white border-0 focus:ring-2 focus:ring-green-300",
                "placeholder:text-gray-500 text-gray-900"
              )}
            />
          </div>
        </div>

        {/* Lista de conversas */}
        <div className="flex-1 overflow-y-auto">
          {conversationsLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
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
                  "flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b",
                  selectedConversation === conversation.id 
                    ? (isDarkMode ? "bg-gray-700" : "bg-green-50")
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
                      {conversation.status === 'unread' && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
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

      {/* Área de Chat - Estilo WhatsApp Web */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Header do chat */}
            <div className={cn(
              "flex items-center justify-between p-4 border-b bg-gray-50",
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
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
                <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-200">
                  <Phone size={16} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-200">
                  <Video size={16} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-200">
                  <MoreVertical size={16} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
                </Button>
              </div>
            </div>

            {/* Mensagens */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{
                backgroundImage: isDarkMode 
                  ? 'none' 
                  : "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                backgroundColor: isDarkMode ? '#1f2937' : '#e5ddd5'
              }}
            >
              {selectedConv.last_message ? (
                <div className="space-y-3">
                  {/* Mensagem do cliente */}
                  <div className="flex justify-start">
                    <div className={cn(
                      "max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm",
                      "bg-white text-gray-900 rounded-bl-sm"
                    )}>
                      <p className="text-sm">{selectedConv.last_message}</p>
                      {selectedConv.last_message_time && (
                        <p className="text-xs mt-1 text-gray-500 text-right">
                          {format(new Date(selectedConv.last_message_time), 'HH:mm', { locale: ptBR })}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Mensagem de exemplo do atendente */}
                  <div className="flex justify-end">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm bg-green-500 text-white rounded-br-sm">
                      <p className="text-sm">Olá! Como posso ajudá-lo hoje?</p>
                      <p className="text-xs mt-1 text-green-100 text-right">
                        {format(new Date(), 'HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    Nenhuma mensagem ainda
                  </p>
                </div>
              )}
            </div>

            {/* Input de mensagem - Estilo WhatsApp Web */}
            <div className={cn(
              "p-4 bg-gray-50",
              isDarkMode ? "bg-gray-800" : "bg-gray-50"
            )}>
              <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-200"
                >
                  <Paperclip size={20} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite uma mensagem"
                    className={cn(
                      "rounded-full pr-12 py-3 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500",
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-gray-300"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200"
                  >
                    <Smile size={16} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
                  </Button>
                </div>
                
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="rounded-full p-3 bg-green-500 hover:bg-green-600 text-white border-0"
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
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          )}>
            <div className="text-center max-w-md mx-auto px-8">
              <div className="w-64 h-64 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center">
                  <Send size={48} className="text-white" />
                </div>
              </div>
              <h3 className={cn("text-2xl font-light mb-4", isDarkMode ? "text-white" : "text-gray-700")}>
                WhatsApp Web
              </h3>
              <p className={cn("text-sm leading-relaxed", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                Agora você pode enviar e receber mensagens sem precisar manter o seu telefone conectado.
              </p>
              <p className={cn("text-sm mt-2", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                Selecione uma conversa para começar a conversar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
