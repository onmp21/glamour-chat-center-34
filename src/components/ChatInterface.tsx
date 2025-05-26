import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';
import { Search, Send, Phone, Tag, FileText, ArrowRight, CheckCircle } from 'lucide-react';
interface ChatInterfaceProps {
  isDarkMode: boolean;
  activeChannel: string;
}
export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isDarkMode,
  activeChannel
}) => {
  const {
    user
  } = useAuth();
  const {
    getTabConversations,
    activeConversation,
    setActiveConversation
  } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const getChannelName = (channel: string) => {
    const names: Record<string, string> = {
      'chat': 'Geral',
      'canarana': 'Canarana',
      'souto-soares': 'Souto Soares',
      'joao-dourado': 'João Dourado',
      'america-dourada': 'América Dourada'
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
  return <div className={cn("h-screen p-4 space-y-4", isDarkMode ? "bg-gray-900" : "bg-gray-50")}>
      <div>
        <h1 className={cn("text-3xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
          {getChannelName(activeChannel)}
        </h1>
        <p className={cn(isDarkMode ? "text-gray-400" : "text-gray-600")}>
          Gerencie suas conversas do WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
        {/* Lista de Conversas - mais estreita */}
        <Card className={cn("col-span-3 border", isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
          <CardHeader className="pb-3">
            <CardTitle className={cn("text-lg flex items-center", isDarkMode ? "text-white" : "text-gray-900")}>
              <Search size={20} className="mr-2 text-gray-500" />
              Conversas
            </CardTitle>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Buscar conversas..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={cn("pl-10", isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-white border-gray-200")} />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
              {getTabConversations(activeChannel).filter(conv => conv.contactName.toLowerCase().includes(searchTerm.toLowerCase()) || conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())).map(conversation => <div key={conversation.id} onClick={() => setActiveConversation(conversation.id)} className={cn("p-3 border-b cursor-pointer transition-colors", activeConversation === conversation.id ? "bg-villa-primary/10 border-villa-primary" : isDarkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-100 hover:bg-gray-50")}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className={cn("font-medium truncate", isDarkMode ? "text-white" : "text-gray-900")}>
                            {conversation.contactName}
                          </h4>
                          <span className={cn("w-2 h-2 rounded-full", getStatusColor(conversation.status))}></span>
                        </div>
                        <div className={cn("flex items-center text-sm mt-1", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                          <Phone size={12} className="mr-1" />
                          {conversation.contactNumber}
                        </div>
                        <p className={cn("text-sm mt-1 truncate", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={cn("text-xs", isDarkMode ? "text-gray-500" : "text-gray-400")}>
                            {conversation.lastMessageTime}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {getStatusLabel(conversation.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>)}
            </div>
          </CardContent>
        </Card>

        {/* Área do Chat - mais larga */}
        <Card className={cn("col-span-6 border", isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
          <CardHeader className="pb-3">
            <CardTitle className={cn("text-lg", isDarkMode ? "text-white" : "text-gray-900")}>
              {activeConversation ? 'Chat Ativo' : 'Selecione uma conversa'}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100vh-320px)] flex flex-col py-0 my-0 mx-px px-0 rounded-full">
            {activeConversation ? <>
                <div className={cn("flex-1 rounded-lg p-4 mb-4 overflow-y-auto", isDarkMode ? "bg-gray-900" : "bg-gray-50")}>
                  <div className="space-y-4">
                    <div className="text-center text-sm text-gray-500 mb-4">
                      Conversa iniciada hoje
                    </div>
                    
                    {/* Mensagem do cliente */}
                    <div className="flex justify-start">
                      <div className={cn("p-3 rounded-lg shadow-sm max-w-xs border", isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200")}>
                        <p className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                          Gostaria de saber sobre os produtos em promoção
                        </p>
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
                  <Input placeholder="Digite sua mensagem..." className={cn("flex-1", isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-white border-gray-200")} />
                  <Button className="bg-villa-primary hover:bg-villa-primary/90">
                    <Send size={16} />
                  </Button>
                </div>
              </> : <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <p>Selecione uma conversa para começar</p>
                </div>
              </div>}
          </CardContent>
        </Card>

        {/* Informações do Contato */}
        <Card className={cn("col-span-3 border", isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
          <CardHeader className="pb-3">
            <CardTitle className={cn("text-lg flex items-center", isDarkMode ? "text-white" : "text-gray-900")}>
              <Phone size={20} className="mr-2 text-gray-500" />
              Informações
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeConversation ? <div className="space-y-4">
                <div>
                  <h4 className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                    Maria Silva
                  </h4>
                  <p className={cn("text-sm flex items-center", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                    <Phone size={14} className="mr-1" />
                    (77) 99999-1234
                  </p>
                </div>
                
                <div>
                  <h5 className={cn("font-medium mb-2", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                    Status
                  </h5>
                  <Badge className="bg-red-100 text-red-800">Não lida</Badge>
                </div>

                <div>
                  <h5 className={cn("font-medium mb-2 flex items-center", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                    <Tag size={16} className="mr-1" />
                    Tags
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">promoção</Badge>
                    <Badge variant="outline">produtos</Badge>
                  </div>
                </div>

                <div>
                  <h5 className={cn("font-medium mb-2 flex items-center", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                    <FileText size={16} className="mr-1" />
                    Notas
                  </h5>
                  <textarea className={cn("w-full p-2 border rounded-md text-sm resize-none", isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-white border-gray-200")} placeholder="Adicionar notas sobre o cliente..." rows={3} />
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className={cn("w-full", isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300")}>
                    <ArrowRight size={16} className="mr-2" />
                    Transferir Conversa
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle size={16} className="mr-2" />
                    Finalizar Atendimento
                  </Button>
                </div>
              </div> : <div className="text-center text-gray-500">
                <div className="text-3xl mb-2">👤</div>
                <p className="text-sm">Selecione uma conversa para ver as informações</p>
              </div>}
          </CardContent>
        </Card>
      </div>
    </div>;
};