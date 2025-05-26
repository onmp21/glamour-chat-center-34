
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { MessageCircle, AlertCircle, Clock, CheckCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChannelButton } from './ChannelButton';

interface DashboardProps {
  isDarkMode: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ isDarkMode }) => {
  const { user } = useAuth();
  const { conversations, tabs } = useChat();
  
  const [pinnedChannels, setPinnedChannels] = useState<string[]>(['chat', 'canarana']);
  const [availableChannels, setAvailableChannels] = useState([
    { id: 'chat', name: 'Geral' },
    { id: 'canarana', name: 'Canarana' },
    { id: 'souto-soares', name: 'Souto Soares' },
    { id: 'joao-dourado', name: 'João Dourado' },
    { id: 'america-dourada', name: 'América Dourada' }
  ]);

  // Filtrar conversas baseado nas permissões do usuário
  const allowedConversations = conversations.filter(conv => 
    user?.assignedTabs.includes(conv.tabId)
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
      color: 'text-blue-600'
    },
    {
      title: 'Não Lidas',
      value: stats.unreadConversations,
      description: 'Mensagens aguardando resposta',
      icon: AlertCircle,
      color: 'text-red-600'
    },
    {
      title: 'Em Andamento',
      value: stats.inProgressConversations,
      description: 'Conversas sendo atendidas',
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Resolvidas',
      value: stats.resolvedConversations,
      description: 'Atendimentos finalizados',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  const handleTogglePin = (channelId: string) => {
    setPinnedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleRemoveChannel = (channelId: string) => {
    setAvailableChannels(prev => prev.filter(channel => channel.id !== channelId));
    setPinnedChannels(prev => prev.filter(id => id !== channelId));
  };

  const handleChannelClick = (channelId: string) => {
    // Navigate to channel (this would be handled by parent component)
    console.log('Navigate to channel:', channelId);
  };

  const sortedChannels = [...availableChannels].sort((a, b) => {
    const aIsPinned = pinnedChannels.includes(a.id);
    const bIsPinned = pinnedChannels.includes(b.id);
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return 0;
  });

  return (
    <div className={cn(
      "space-y-6 min-h-screen p-6",
      isDarkMode ? "bg-black" : "bg-gray-50"
    )}>
      {/* Header */}
      <div>
        <h1 className={cn(
          "text-3xl font-bold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
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
            <Card key={index} className={cn(
              "animate-fade-in border",
              isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
            )} style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  {stat.title}
                </CardTitle>
                <IconComponent size={20} className="text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <p className={cn(
                  "text-xs mt-1",
                  isDarkMode ? "text-gray-500" : "text-gray-500"
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
          <h2 className={cn(
            "text-xl font-semibold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Canais de Atendimento
          </h2>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center space-x-2",
              isDarkMode 
                ? "border-gray-700 text-gray-300 hover:bg-gray-900" 
                : "border-gray-300"
            )}
          >
            <Plus size={16} />
            <span>Adicionar Canal</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedChannels.map(channel => (
            <ChannelButton
              key={channel.id}
              id={channel.id}
              name={channel.name}
              isPinned={pinnedChannels.includes(channel.id)}
              isDarkMode={isDarkMode}
              onTogglePin={handleTogglePin}
              onRemove={handleRemoveChannel}
              onClick={handleChannelClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
