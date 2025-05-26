
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { MessageCircle, AlertCircle, Clock, CheckCircle, BarChart3, Store } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { conversations, tabs } = useChat();

  // Filtrar conversas baseado nas permissões do usuário
  const allowedConversations = conversations.filter(conv => 
    user?.assignedTabs.includes(conv.tabId)
  );

  const stats = {
    totalConversations: allowedConversations.length,
    unreadConversations: allowedConversations.filter(c => c.status === 'unread').length,
    inProgressConversations: allowedConversations.filter(c => c.status === 'in_progress').length,
    resolvedConversations: allowedConversations.filter(c => c.status === 'resolved').length,
    availableTabs: tabs.filter(tab => user?.assignedTabs.includes(tab.id)).length
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

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Painel de Controle</h1>
        <p className="text-gray-600">Bem-vindo, {user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="animate-fade-in bg-white" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <IconComponent size={20} className="text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 size={20} className="text-gray-500" />
              <span>Status dos Atendimentos</span>
            </CardTitle>
            <CardDescription>
              Distribuição das conversas por status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Não lidas</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(stats.unreadConversations / stats.totalConversations) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.unreadConversations}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Em andamento</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(stats.inProgressConversations / stats.totalConversations) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.inProgressConversations}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Resolvidas</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(stats.resolvedConversations / stats.totalConversations) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.resolvedConversations}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store size={20} className="text-gray-500" />
              <span>Suas Abas de Atendimento</span>
            </CardTitle>
            <CardDescription>
              Abas que você tem acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tabs
                .filter(tab => user?.assignedTabs.includes(tab.id))
                .map(tab => {
                  const tabConversations = allowedConversations.filter(c => c.tabId === tab.id);
                  return (
                    <div key={tab.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div>
                        <p className="font-medium text-gray-900">{tab.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{tab.type.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-villa-primary">{tabConversations.length}</p>
                        <p className="text-xs text-gray-500">conversas</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
