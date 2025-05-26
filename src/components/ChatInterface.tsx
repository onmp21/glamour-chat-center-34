
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';

export const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const { tabs, activeTab, setActiveTab, getTabConversations, activeConversation, setActiveConversation } = useChat();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar abas baseado nas permissões do usuário
  const allowedTabs = tabs.filter(tab => user?.assignedTabs.includes(tab.id));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'unread': return 'Não lida';
      case 'in_progress': return 'Em andamento';
      case 'resolved': return 'Resolvida';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Atendimento</h1>
        <p className="text-gray-600">Gerencie suas conversas do WhatsApp</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-auto gap-1 h-auto p-1 bg-gray-100">
          {allowedTabs.map(tab => {
            const tabConversations = getTabConversations(tab.id);
            const unreadCount = tabConversations.filter(c => c.status === 'unread').length;
            
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="relative data-[state=active]:bg-villa-primary data-[state=active]:text-white"
              >
                {tab.name}
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {allowedTabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            <div className="grid grid-cols-12 gap-6 h-[600px]">
              {/* Lista de Conversas */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle className="text-lg">Conversas - {tab.name}</CardTitle>
                  <Input
                    placeholder="Buscar conversas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-2"
                  />
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[480px] overflow-y-auto">
                    {getTabConversations(tab.id)
                      .filter(conv => 
                        conv.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(conversation => (
                        <div
                          key={conversation.id}
                          onClick={() => setActiveConversation(conversation.id)}
                          className={cn(
                            "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                            activeConversation === conversation.id && "bg-villa-primary/10 border-villa-primary"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900">{conversation.contactName}</h4>
                                <span className={cn("w-2 h-2 rounded-full", getStatusColor(conversation.status))}></span>
                              </div>
                              <p className="text-sm text-gray-600">{conversation.contactNumber}</p>
                              <p className="text-sm text-gray-500 mt-1 truncate">{conversation.lastMessage}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-400">{conversation.lastMessageTime}</span>
                                <Badge variant="outline" className="text-xs">
                                  {getStatusLabel(conversation.status)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Área do Chat */}
              <Card className="col-span-5">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {activeConversation ? 'Chat Ativo' : 'Selecione uma conversa'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[480px] flex flex-col">
                  {activeConversation ? (
                    <>
                      <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
                        <div className="space-y-4">
                          <div className="text-center text-sm text-gray-500 mb-4">
                            Conversa iniciada hoje
                          </div>
                          
                          {/* Mensagem do cliente */}
                          <div className="flex justify-start">
                            <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                              <p className="text-sm">Gostaria de saber sobre os produtos em promoção</p>
                              <span className="text-xs text-gray-400">10:30</span>
                            </div>
                          </div>

                          {/* Mensagem do atendente */}
                          <div className="flex justify-end">
                            <div className="bg-villa-primary p-3 rounded-lg shadow-sm max-w-xs">
                              <p className="text-sm text-white">Olá! Claro, posso ajudá-la com informações sobre nossas promoções.</p>
                              <span className="text-xs text-villa-primary/70">10:32</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Input placeholder="Digite sua mensagem..." className="flex-1" />
                        <Button className="bg-villa-primary hover:bg-villa-primary/90">
                          Enviar
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

              {/* Informações do Contato */}
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle className="text-lg">Informações do Contato</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeConversation ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Maria Silva</h4>
                        <p className="text-sm text-gray-600">(77) 99999-1234</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Status</h5>
                        <Badge className="bg-red-100 text-red-800">Não lida</Badge>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Tags</h5>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">promoção</Badge>
                          <Badge variant="outline">produtos</Badge>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Notas</h5>
                        <textarea
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Adicionar notas sobre o cliente..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          Transferir Conversa
                        </Button>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
