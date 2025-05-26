
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';
import { Search, Send, Phone, Tag, FileText, ArrowRight, CheckCircle, Users } from 'lucide-react';

interface ChatInterfaceProps {
  isDarkMode: boolean;
  activeChannel: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isDarkMode,
  activeChannel
}) => {
  const { user } = useAuth();
  const { conversations, getTabConversations, activeConversation, setActiveConversation, updateConversationStatus } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // Auto-mark conversation as read when opened
  useEffect(() => {
    if (activeConversation) {
      const conversation = conversations.find(c => c.id === activeConversation);
      if (conversation && conversation.status === 'unread') {
        updateConversationStatus(activeConversation, 'in_progress');
      }
    }
  }, [activeConversation, conversations, updateConversationStatus]);

  const getChannelName = (channel: string) => {
    const names: Record<string, string> = {
      'chat': 'Geral',
      'canarana': 'Canarana',
      'souto-soares': 'Souto Soares',
      'joao-dourado': 'João Dourado',
      'america-dourada': 'América Dourada',
      'gerente-lojas': 'Gerente das Lojas',
      'gerente-externo': 'Gerente do Externo'
    };
    return names[channel] || channel;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-red-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'unread':
        return 'Não lida';
      case 'in_progress':
        return 'Em andamento';
      case 'resolved':
        return 'Resolvida';
      default:
        return status;
    }
  };

  const handleTransferConversation = () => {
    if (activeConversation) {
      // In a real app, this would open a modal to select the target channel/user
      console.log('Transferring conversation:', activeConversation);
      // For now, just show feedback
      alert('Funcionalidade de transferir conversa será implementada');
    }
  };

  const handleFinishConversation = () => {
    if (activeConversation) {
      updateConversationStatus(activeConversation, 'resolved');
      setActiveConversation(null);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && activeConversation) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const filteredConversations = getTabConversations(activeChannel).filter(conv => 
    conv.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn(
      "h-screen flex flex-col",
      isDarkMode ? "dark-bg-primary" : "bg-gray-50"
    )}>
      {/* Header */}
      <div className={cn(
        "p-3 md:p-4 border-b mobile-padding",
        isDarkMode ? "dark-border" : "border-gray-200"
      )}>
        <h1 className={cn(
          "text-lg md:text-2xl lg:text-3xl font-bold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          {getChannelName(activeChannel)}
        </h1>
        <p className={cn(
          "text-sm",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}>
          Gerencie suas conversas do WhatsApp
        </p>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        {/* Lista de Conversas - Mobile: full width, Desktop: 4 cols */}
        <Card className={cn(
          "col-span-12 md:col-span-4 border-0 border-r rounded-none h-full",
          isDarkMode ? "dark-bg-secondary dark-border" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-3 p-3 md:p-6">
            <CardTitle className={cn(
              "text-base md:text-lg flex items-center",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              <Search size={18} className="mr-2 text-gray-500" />
              Conversas
            </CardTitle>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "pl-10 mobile-touch",
                  isDarkMode
                    ? "dark-bg-primary dark-border text-white placeholder:text-gray-400"
                    : "bg-white border-gray-200"
                )}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[calc(100vh-280px)] md:max-h-[calc(100vh-240px)] overflow-y-auto">
              {filteredConversations.map(conversation => {
                const hasNewMessages = conversation.status === 'unread';
                return (
                  <div
                    key={conversation.id}
                    onClick={() => setActiveConversation(conversation.id)}
                    className={cn(
                      "p-3 md:p-4 border-b cursor-pointer transition-colors mobile-touch",
                      activeConversation === conversation.id
                        ? isDarkMode ? "dark-accent border-primary" : "bg-primary/10 border-primary"
                        : isDarkMode
                          ? "dark-border hover:bg-gray-700"
                          : "border-gray-100 hover:bg-gray-50",
                      hasNewMessages && "ring-2 ring-red-500 ring-opacity-50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className={cn(
                            "font-medium truncate",
                            isDarkMode ? "text-white" : "text-gray-900"
                          )}>
                            {conversation.contactName}
                          </h4>
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            getStatusColor(conversation.status)
                          )}></span>
                          {hasNewMessages && (
                            <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                              Nova
                            </Badge>
                          )}
                        </div>
                        <div className={cn(
                          "flex items-center text-sm mt-1",
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        )}>
                          <Phone size={12} className="mr-1" />
                          {conversation.contactNumber}
                        </div>
                        <p className={cn(
                          "text-sm mt-1 truncate",
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        )}>
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={cn(
                            "text-xs",
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          )}>
                            {conversation.lastMessageTime}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {getStatusLabel(conversation.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Área do Chat - Desktop: 6 cols, Mobile: hidden when list is shown */}
        <Card className={cn(
          "hidden md:flex md:col-span-6 border-0 border-r rounded-none h-full flex-col",
          isDarkMode ? "dark-bg-secondary dark-border" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-3 p-3 md:p-6">
            <CardTitle className={cn(
              "text-base md:text-lg",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              {activeConversation ? 'Chat Ativo' : 'Selecione uma conversa'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-3 md:p-4">
            {activeConversation ? (
              <>
                <div className={cn(
                  "flex-1 rounded-lg p-3 md:p-4 mb-4 overflow-y-auto",
                  isDarkMode ? "dark-bg-primary" : "bg-gray-50"
                )}>
                  <div className="space-y-4">
                    <div className="text-center text-sm text-gray-500 mb-4">
                      Conversa iniciada hoje
                    </div>
                    
                    <div className="flex justify-start">
                      <div className={cn(
                        "p-3 rounded-lg shadow-sm max-w-xs border",
                        isDarkMode
                          ? "dark-bg-secondary dark-border text-white"
                          : "bg-white border-gray-200"
                      )}>
                        <p className="text-sm">
                          Gostaria de saber sobre os produtos em promoção
                        </p>
                        <span className="text-xs text-gray-400">10:30</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="dark-accent p-3 rounded-lg shadow-sm max-w-xs">
                        <p className="text-sm text-white">
                          Olá! Claro, posso ajudá-la com informações sobre nossas promoções.
                        </p>
                        <span className="text-xs text-primary/70">10:32</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className={cn(
                      "flex-1 mobile-touch",
                      isDarkMode
                        ? "dark-bg-primary dark-border text-white placeholder:text-gray-400"
                        : "bg-white border-gray-200"
                    )}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="dark-accent hover:opacity-90 mobile-touch"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <p>Selecione uma conversa para começar</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações do Contato - Desktop: 2 cols, Mobile: hidden */}
        <Card className={cn(
          "hidden lg:flex lg:col-span-2 border-0 rounded-none h-full flex-col",
          isDarkMode ? "dark-bg-secondary dark-border" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-3 p-3 md:p-6">
            <CardTitle className={cn(
              "text-base md:text-lg flex items-center",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              <Phone size={18} className="mr-2 text-gray-500" />
              Informações
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-3 md:p-6">
            {activeConversation ? (
              <div className="space-y-4">
                <div>
                  <h4 className={cn(
                    "font-medium",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    Maria Silva
                  </h4>
                  <p className={cn(
                    "text-sm flex items-center",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    <Phone size={14} className="mr-1" />
                    (77) 99999-1234
                  </p>
                </div>
                
                <div>
                  <h5 className={cn(
                    "font-medium mb-2",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}>
                    Status
                  </h5>
                  <Badge className="bg-red-100 text-red-800">Não lida</Badge>
                </div>

                <div>
                  <h5 className={cn(
                    "font-medium mb-2 flex items-center",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}>
                    <Tag size={16} className="mr-1" />
                    Tags
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">promoção</Badge>
                    <Badge variant="outline">produtos</Badge>
                  </div>
                </div>

                <div>
                  <h5 className={cn(
                    "font-medium mb-2 flex items-center",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}>
                    <FileText size={16} className="mr-1" />
                    Notas
                  </h5>
                  <textarea
                    className={cn(
                      "w-full p-2 border rounded-md text-sm resize-none",
                      isDarkMode
                        ? "dark-bg-primary dark-border text-white placeholder:text-gray-400"
                        : "bg-white border-gray-200"
                    )}
                    placeholder="Adicionar notas sobre o cliente..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleTransferConversation}
                    variant="outline"
                    className={cn(
                      "w-full mobile-touch",
                      isDarkMode
                        ? "dark-border text-gray-300 hover:bg-gray-700"
                        : "border-gray-300"
                    )}
                  >
                    <Users size={16} className="mr-2" />
                    Transferir Conversa
                  </Button>
                  <Button 
                    onClick={handleFinishConversation}
                    className="w-full bg-green-600 hover:bg-green-700 text-white mobile-touch"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Finalizar Atendimento
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <div className="text-3xl mb-2">👤</div>
                <p className="text-sm">Selecione uma conversa para ver as informações</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
