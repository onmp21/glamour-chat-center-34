import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useChannels } from '@/contexts/ChannelContext';
import { cn } from '@/lib/utils';
import { Search, Send, Phone, Tag, FileText, ArrowRight, CheckCircle, Users, ArrowLeft } from 'lucide-react';
// Import ChannelCard
import { ChannelCard } from "@/components/ui/channel-card";

interface ChatInterfaceProps {
  isDarkMode: boolean;
  activeChannel: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isDarkMode,
  activeChannel
}) => {
  const { user } = useAuth();
  // Add setActiveTab to destructure from useChat
  const { conversations, getTabConversations, activeConversation, setActiveConversation, updateConversationStatus, setActiveTab } = useChat();
  const { channels } = useChannels();
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  // Navegação para mobile (tipo WhatsApp empilhado)
  const [mobileView, setMobileView] = useState<'channels' | 'conversations' | 'chat'>('channels');
  const [mobileChannelId, setMobileChannelId] = useState<string | null>(null);
  const [mobileConversationId, setMobileConversationId] = useState<string | null>(null);

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

  // Filtragem para desktop
  const filteredConversations = getTabConversations(activeChannel).filter(conv => 
    conv.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtragem mobile
  const mobileConversations = mobileChannelId
    ? getTabConversations(mobileChannelId)
    : [];

  // ---------- RENDER ----------
  return (
    <div className={cn(
      "relative h-screen",
      isDarkMode ? "dark-bg-primary" : "bg-gray-50"
    )}>
      {/* MOBILE: apenas mobile */}
      <div className="md:hidden w-full h-full absolute top-0 left-0 bg-inherit">
        {/* 1. Lista de canais */}
        {mobileView === 'channels' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center px-4 py-3 border-b"
                 style={{ borderColor: isDarkMode ? "#2a2a2a" : "#ececec" }}>
              <span className={cn("text-lg font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Canais</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 pb-20">
              {channels.filter((c) => c.isActive).map((channel) => (
                <ChannelCard
                  key={channel.id}
                  name={channel.name}
                  subtitle={channel.type === "general" ? "Geral" : channel.name}
                  isDarkMode={isDarkMode}
                  onClick={() => {
                    setMobileChannelId(channel.id);
                    setMobileView('conversations');
                  }}
                  compact={false}
                />
              ))}
            </div>
          </div>
        )}
        {/* 2. Lista de conversas do canal */}
        {mobileView === 'conversations' && (
          <div className="h-full flex flex-col">
            {/* Header com botão voltar */}
            <div className="flex items-center px-2 py-3 border-b gap-2"
                 style={{ borderColor: isDarkMode ? "#2a2a2a" : "#ececec" }}>
              <Button size="icon" variant="ghost" className="mr-2" onClick={() => setMobileView('channels')}>
                <ArrowLeft size={22} />
              </Button>
              <span className={cn("text-base font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
                {mobileChannelId ? channels.find((c) => c.id === mobileChannelId)?.name : ''}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 pb-20">
              {mobileConversations.map(conversation => (
                <div
                  key={conversation.id}
                  onClick={() => {
                    setMobileConversationId(conversation.id);
                    setMobileView('chat');
                  }}
                  className={cn(
                    "p-3 rounded-lg mb-2 cursor-pointer shadow hover:bg-primary/10 transition",
                    isDarkMode ? "bg-[#232323] text-white" : "bg-gray-100 text-gray-900"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{conversation.contactName}</span>
                    <Badge className={getStatusColor(conversation.status) + " text-xs ml-2"}>
                      {getStatusLabel(conversation.status)}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{conversation.lastMessage}</div>
                </div>
              ))}
              {mobileConversations.length === 0 &&
                <div className="text-center text-gray-400 py-8">Nenhuma conversa neste canal.</div>}
            </div>
          </div>
        )}
        {/* 3. Tela de chat individual */}
        {mobileView === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center px-2 py-3 border-b gap-2" style={{ borderColor: isDarkMode ? "#2a2a2a" : "#ececec" }}>
              <Button size="icon" variant="ghost" className="mr-2" onClick={() => setMobileView('conversations')}>
                <ArrowLeft size={22} />
              </Button>
              <span className={cn("font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
                {mobileConversations.find(conv => conv.id === mobileConversationId)?.contactName || 'Conversa'}
              </span>
            </div>
            <div className={cn("flex-1 overflow-y-auto", isDarkMode ? "bg-[#181818]" : "bg-gray-50")}>
              {/* MESSAGES MOCK */}
              {/* Troque aqui pelo loop dos messages se houver */}
              <div className="p-4 space-y-4">
                <div className="text-center text-xs text-gray-400 mb-2">
                  Conversa iniciada hoje
                </div>
                <div className="flex justify-start">
                  <div className={cn(
                    "p-3 rounded-lg shadow max-w-[80%]",
                    isDarkMode ? "bg-[#26272b] text-white" : "bg-white text-gray-900"
                  )}>
                    <span className="text-sm">Gostaria de saber sobre os produtos em promoção</span>
                    <div className="text-xs text-gray-400 mt-1">10:30</div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#b5103c] p-3 rounded-lg shadow max-w-[80%]">
                    <span className="text-sm text-white">Olá! Claro, posso ajudá-la com informações sobre nossas promoções.</span>
                    <div className="text-xs text-white/70 mt-1">10:32</div>
                  </div>
                </div>
              </div>
            </div>
            <form className="flex items-center gap-2 px-3 py-2 border-t"
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{ borderColor: isDarkMode ? "#2a2a2a" : "#ececec" }}>
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                className={cn(
                  "flex-1",
                  isDarkMode ? "bg-[#232323] border-[#2a2a2a] text-white placeholder:text-gray-400" : "bg-white border-gray-200"
                )}
              />
              <Button className="bg-[#b5103c] text-white hover:bg-primary/90" type="submit">
                <Send size={18} />
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* DESKTOP/WEB: 2 colunas (sem canais!) */}
      <div className="hidden md:flex h-full w-full flex-row">
        {/* Coluna 1: Conversas (alargada) */}
        <div className={cn(
          "w-96 border-r h-full overflow-y-auto py-2",
        )} style={{ backgroundColor: isDarkMode ? "#232323" : "#fafafa", borderColor: isDarkMode ? "#2a2a2a" : "#ececec" }}>
          <Card className={cn(
            "border-0 border-r rounded-none h-full",
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
                  onChange={e => setSearchTerm(e.target.value)}
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
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {filteredConversations.map(conversation => {
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setActiveConversation(conversation.id)}
                      className={cn(
                        "p-2 hover:bg-primary/10 rounded-lg mb-1 cursor-pointer transition-colors",
                        activeConversation === conversation.id && (isDarkMode ? "bg-[#1b1b1b]" : "bg-gray-100")
                      )}
                    >
                      <h4 className={cn("font-medium truncate text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                        {conversation.contactName}
                      </h4>
                      <span className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        {conversation.lastMessage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Coluna 2: Chat principal mais largo */}
        <div className="flex-1 flex flex-col h-full">
          <Card className={cn(
            "flex-1 flex flex-col border-0 rounded-none h-full",
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
        </div>
      </div>
    </div>
  );
};
