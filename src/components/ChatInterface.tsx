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
import { ChannelCard } from "@/components/ui/channel-card";
import { ContactActionsHeader } from './ContactActionsHeader';

interface ChatInterfaceProps {
  isDarkMode: boolean;
  activeChannel: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isDarkMode,
  activeChannel
}) => {
  const { user } = useAuth();
  const { conversations, getTabConversations, activeConversation, setActiveConversation, updateConversationStatus, setActiveTab } = useChat();
  const { channels } = useChannels();
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
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
      console.log('Sending message:', newMessage);
      setNewMessage('');
      // Auto scroll to bottom (simulação)
      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-messages');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    }
  };

  const activeConv = conversations.find(conv => conv.id === activeConversation);

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
        {/* 1. Lista de canais com badges de conversas */}
        {mobileView === 'channels' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center px-4 py-3 border-b"
                 style={{ borderColor: isDarkMode ? "#2a2a2a" : "#ececec" }}>
              <span className={cn("text-lg font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Canais</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 pb-20">
              {channels.filter((c) => c.isActive).map((channel) => {
                const channelConversations = getTabConversations(channel.id);
                const unreadCount = channelConversations.filter(c => c.status === 'unread').length;
                
                return (
                  <div key={channel.id} className="relative mb-3">
                    <ChannelCard
                      name={channel.name}
                      subtitle={channel.type === "general" ? "Geral" : channel.name}
                      count={channelConversations.length}
                      isDarkMode={isDarkMode}
                      onClick={() => {
                        setMobileChannelId(channel.id);
                        setMobileView('conversations');
                      }}
                      compact={false}
                    />
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                );
              })}
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
                    setActiveConversation(conversation.id);
                    setMobileView('chat');
                  }}
                  className={cn(
                    "p-4 rounded-xl mb-3 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200",
                    isDarkMode ? "bg-[#232323] text-white border border-[#2a2a2a]" : "bg-white text-gray-900 border border-gray-100"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-base">{conversation.contactName}</span>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs", getStatusColor(conversation.status))}>
                        {getStatusLabel(conversation.status)}
                      </Badge>
                      <span className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        {conversation.lastMessageTime}
                      </span>
                    </div>
                  </div>
                  <div className={cn("text-sm truncate", isDarkMode ? "text-gray-300" : "text-gray-600")}>
                    {conversation.lastMessage}
                  </div>
                </div>
              ))}
              {mobileConversations.length === 0 &&
                <div className="text-center text-gray-400 py-8">Nenhuma conversa neste canal.</div>}
            </div>
          </div>
        )}
        {/* 3. Tela de chat individual melhorada */}
        {mobileView === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center px-2 py-3 border-b gap-2" style={{ borderColor: isDarkMode ? "#2a2a2a" : "#ececec" }}>
              <Button size="icon" variant="ghost" className="mr-2" onClick={() => setMobileView('conversations')}>
                <ArrowLeft size={22} />
              </Button>
              <div className="flex-1">
                <span className={cn("font-semibold text-base", isDarkMode ? "text-white" : "text-gray-900")}>
                  {mobileConversations.find(conv => conv.id === mobileConversationId)?.contactName || 'Conversa'}
                </span>
                <div className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  Online
                </div>
              </div>
            </div>
            <div className={cn("flex-1 overflow-y-auto chat-messages", isDarkMode ? "bg-[#181818]" : "bg-gray-50")}>
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
            <form className="flex items-center gap-2 px-3 py-3 border-t bg-white dark:bg-[#232323]"
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
                  "flex-1 rounded-full",
                  isDarkMode ? "bg-[#181818] border-[#2a2a2a] text-white placeholder:text-gray-400" : "bg-gray-50 border-gray-200"
                )}
              />
              <Button 
                className="bg-[#b5103c] text-white hover:bg-primary/90 rounded-full w-10 h-10 p-0" 
                type="submit"
                disabled={!newMessage.trim()}
              >
                <Send size={18} />
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* DESKTOP/WEB: Interface mais limpa e moderna */}
      <div className="hidden md:flex h-full w-full flex-row">
        {/* Coluna 1: Conversas com design mais limpo */}
        <div className={cn(
          "w-96 border-r h-full overflow-y-auto",
        )} style={{ backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff", borderColor: isDarkMode ? "#2a2a2a" : "#e5e7eb" }}>
          <Card className={cn(
            "border-0 border-r rounded-none h-full shadow-none",
            isDarkMode ? "dark-bg-secondary dark-border" : "bg-white"
          )}>
            <CardHeader className="pb-4 p-6 border-b" style={{ borderColor: isDarkMode ? "#2a2a2a" : "#f1f5f9" }}>
              <CardTitle className={cn(
                "text-lg flex items-center font-semibold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Conversas
              </CardTitle>
              <div className="relative mt-3">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar conversas..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={cn(
                    "pl-10 rounded-full border-2",
                    isDarkMode
                      ? "dark-bg-primary dark-border text-white placeholder:text-gray-400 focus:border-[#b5103c]"
                      : "bg-gray-50 border-gray-200 focus:border-[#b5103c]"
                  )}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
                {filteredConversations.map(conversation => {
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setActiveConversation(conversation.id)}
                      className={cn(
                        "p-4 hover:bg-primary/5 cursor-pointer transition-all duration-200 border-b border-opacity-20",
                        activeConversation === conversation.id && (isDarkMode ? "bg-[#b5103c]/10 border-l-4 border-l-[#b5103c]" : "bg-[#b5103c]/5 border-l-4 border-l-[#b5103c]"),
                        isDarkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-100 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={cn("font-semibold text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                          {conversation.contactName}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-xs px-2 py-1", getStatusColor(conversation.status))}>
                            {getStatusLabel(conversation.status)}
                          </Badge>
                          <span className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                      </div>
                      <p className={cn("text-xs leading-relaxed truncate", isDarkMode ? "text-gray-300" : "text-gray-600")}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna 2: Chat principal com header de ações */}
        <div className="flex-1 flex flex-col h-full">
          <Card className={cn(
            "flex-1 flex flex-col border-0 rounded-none h-full shadow-none",
            isDarkMode ? "dark-bg-secondary dark-border" : "bg-white"
          )}>
            {activeConversation ? (
              <>
                <ContactActionsHeader 
                  isDarkMode={isDarkMode} 
                  contactName={activeConv?.contactName}
                />
                <CardContent className="flex-1 flex flex-col p-0">
                  <div className={cn(
                    "flex-1 p-6 overflow-y-auto chat-messages",
                    isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-50"
                  )}>
                    <div className="max-w-4xl mx-auto space-y-4">
                      <div className="text-center text-sm text-gray-500 mb-6">
                        Conversa iniciada hoje
                      </div>
                      <div className="flex justify-start">
                        <div className={cn(
                          "p-4 rounded-2xl shadow-sm max-w-md border",
                          isDarkMode
                            ? "bg-[#232323] border-[#2a2a2a] text-white"
                            : "bg-white border-gray-200"
                        )}>
                          <p className="text-sm leading-relaxed">
                            Gostaria de saber sobre os produtos em promoção
                          </p>
                          <span className="text-xs text-gray-400 mt-2 block">10:30</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-[#b5103c] p-4 rounded-2xl shadow-sm max-w-md">
                          <p className="text-sm text-white leading-relaxed">
                            Olá! Claro, posso ajudá-la com informações sobre nossas promoções.
                          </p>
                          <span className="text-xs text-white/70 mt-2 block">10:32</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t" style={{ borderColor: isDarkMode ? "#2a2a2a" : "#e5e7eb" }}>
                    <div className="max-w-4xl mx-auto flex space-x-3">
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className={cn(
                          "flex-1 rounded-full border-2",
                          isDarkMode
                            ? "dark-bg-primary dark-border text-white placeholder:text-gray-400 focus:border-[#b5103c]"
                            : "bg-white border-gray-200 focus:border-[#b5103c]"
                        )}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-[#b5103c] hover:bg-[#9d0e35] rounded-full px-6"
                      >
                        <Send size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-6">💬</div>
                  <h3 className={cn("text-xl font-semibold mb-2", isDarkMode ? "text-white" : "text-gray-900")}>
                    Selecione uma conversa
                  </h3>
                  <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    Escolha uma conversa para começar a atender
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
