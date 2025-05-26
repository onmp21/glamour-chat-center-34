
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { MessageCircle, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExamChart } from './ExamChart';

interface DashboardProps {
  isDarkMode: boolean;
  onNavigateToChannel: (channelId: string) => void;
}

interface ChannelCardProps {
  id: string;
  name: string;
  conversationCount: number;
  isPinned: boolean;
  isDarkMode: boolean;
  onTogglePin: (channelId: string) => void;
  onClick: (channelId: string) => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  id,
  name,
  conversationCount,
  isPinned,
  isDarkMode,
  onTogglePin,
  onClick
}) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md border",
        isPinned ? "ring-2 ring-offset-2" : ""
      )}
      style={{
        backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
        borderColor: isDarkMode ? '#686868' : '#e5e7eb',
        ...(isPinned && { ringColor: '#b5103c' })
      }}
      onClick={() => onClick(id)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            "text-sm font-medium",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            {name}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(id);
            }}
            className={cn(
              "h-6 w-6 p-0",
              isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
            )}
          >
            {isPinned ? '📌' : '📍'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-2xl font-bold",
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}>
            {conversationCount}
          </span>
          <MessageCircle size={20} style={{ color: '#686868' }} />
        </div>
        <p className={cn(
          "text-xs mt-1",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}>
          conversas ativas
        </p>
      </CardContent>
    </Card>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ isDarkMode, onNavigateToChannel }) => {
  const { user } = useAuth();
  const { conversations, getTabConversations } = useChat();
  
  const [pinnedChannels, setPinnedChannels] = useState<string[]>(['chat', 'canarana']);
  
  // Canais baseados nas permissões do usuário
  const getUserChannels = () => {
    if (!user) return [];
    
    const channelMap = [
      { id: 'chat', name: 'Canal Geral', type: 'general' },
      { id: 'canarana', name: 'Canarana', type: 'store' },
      { id: 'souto-soares', name: 'Souto Soares', type: 'store' },
      { id: 'joao-dourado', name: 'João Dourado', type: 'store' },
      { id: 'america-dourada', name: 'América Dourada', type: 'store' },
      { id: 'gerente-lojas', name: 'Gerente das Lojas', type: 'manager' },
      { id: 'gerente-externo', name: 'Gerente do Externo', type: 'manager' }
    ];

    // Filtrar canais baseado nas permissões do usuário
    return channelMap.filter(channel => {
      if (user.role === 'admin') return true;
      return user.assignedTabs?.includes(channel.id) || false;
    }).map(channel => ({
      ...channel,
      conversationCount: getTabConversations(channel.id).length
    }));
  };

  const availableChannels = getUserChannels();

  // Filtrar conversas baseado nas permissões do usuário
  const allowedConversations = conversations.filter(conv => 
    user?.assignedTabs?.includes(conv.tabId) || false
  );

  const stats = {
    totalConversations: allowedConversations.length,
    unreadConversations: allowedConversations.filter(c => c.status === 'unread').length,
    inProgressConversations: allowedConversations.filter(c => c.status === 'in_progress').length,
    resolvedConversations: allowedConversations.filter(c => c.status === 'resolved').length,
  };

  const statsCards = [
    {
      title: 'Total de Conversas',
      value: stats.totalConversations,
      description: 'Conversas totais nas suas abas',
      icon: MessageCircle,
      color: '#b5103c'
    },
    {
      title: 'Não Lidas',
      value: stats.unreadConversations,
      description: 'Mensagens aguardando resposta',
      icon: AlertCircle,
      color: '#dc2626'
    },
    {
      title: 'Em Andamento',
      value: stats.inProgressConversations,
      description: 'Conversas sendo atendidas',
      icon: Clock,
      color: '#d97706'
    },
    {
      title: 'Resolvidas',
      value: stats.resolvedConversations,
      description: 'Atendimentos finalizados',
      icon: CheckCircle,
      color: '#059669'
    }
  ];

  const handleTogglePin = (channelId: string) => {
    setPinnedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleChannelClick = (channelId: string) => {
    console.log('Navegando para canal:', channelId);
    onNavigateToChannel(channelId);
  };

  const sortedChannels = [...availableChannels].sort((a, b) => {
    const aIsPinned = pinnedChannels.includes(a.id);
    const bIsPinned = pinnedChannels.includes(b.id);
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return 0;
  });

  return (
    <div className="space-y-6 min-h-screen p-6" style={{
      backgroundColor: isDarkMode ? '#000000' : '#f9fafb'
    }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#b5103c' }}>
          Painel de Controle
        </h1>
        <p className={cn(
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}>
          Bem-vindo, {user?.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="animate-fade-in border" style={{ 
              animationDelay: `${index * 0.1}s`,
              backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
              borderColor: isDarkMode ? '#686868' : '#e5e7eb'
            }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  {stat.title}
                </CardTitle>
                <IconComponent size={20} style={{ color: '#686868' }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <p className={cn(
                  "text-xs mt-1",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Channels Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: '#b5103c' }}>
            Canais de Atendimento
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedChannels.map(channel => (
            <ChannelCard
              key={channel.id}
              id={channel.id}
              name={channel.name}
              conversationCount={channel.conversationCount}
              isPinned={pinnedChannels.includes(channel.id)}
              isDarkMode={isDarkMode}
              onTogglePin={handleTogglePin}
              onClick={handleChannelClick}
            />
          ))}
        </div>
      </div>

      {/* Exam Chart Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#b5103c' }}>
          Estatísticas de Exames
        </h2>
        <ExamChart isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};
