
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { usePermissions } from '@/hooks/usePermissions';
import { MessageCircle, AlertCircle, Clock, CheckCircle, FileText, Calendar, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExamLineCharts } from './ExamLineCharts';

// Mock exam data - in a real app this would come from your exam database
const mockExamData = [
  { id: '1', date: '2024-01-15', city: 'Canarana', type: 'Ultrassom' },
  { id: '2', date: '2024-01-18', city: 'Souto Soares', type: 'Mamografia' },
  { id: '3', date: '2024-01-22', city: 'João Dourado', type: 'Ultrassom' },
  { id: '4', date: '2024-02-03', city: 'América Dourada', type: 'Mamografia' },
  { id: '5', date: '2024-02-08', city: 'Canarana', type: 'Ultrassom' },
  // Add more mock data to simulate a realistic dataset
  ...Array.from({ length: 340 }, (_, i) => ({
    id: `${i + 6}`,
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    city: ['Canarana', 'Souto Soares', 'João Dourado', 'América Dourada'][Math.floor(Math.random() * 4)],
    type: ['Ultrassom', 'Mamografia', 'Raio-X'][Math.floor(Math.random() * 3)]
  }))
];

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
        "cursor-pointer transition-all duration-200 hover:shadow-md border mobile-touch",
        isPinned ? "ring-2 ring-offset-2 ring-primary" : ""
      )} 
      style={{
        backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
        borderColor: isDarkMode ? '#686868' : '#e5e7eb'
      }} 
      onClick={() => onClick(id)}
    >
      <CardHeader className="pb-2 p-2 md:p-4">
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            "text-sm md:text-base font-medium",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            {name}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={e => {
              e.stopPropagation();
              onTogglePin(id);
            }} 
            className={cn(
              "h-6 w-6 p-0 mobile-touch",
              isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
            )}
          >
            {isPinned ? '📌' : '📍'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-lg md:text-xl font-bold",
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}>
            {conversationCount}
          </span>
          <MessageCircle size={14} className="md:w-4 md:h-4" style={{ color: '#686868' }} />
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

export const Dashboard: React.FC<DashboardProps> = ({
  isDarkMode,
  onNavigateToChannel
}) => {
  const { user } = useAuth();
  const { conversations, getTabConversations } = useChat();
  const { getAccessibleChannels, canAccessChannel } = usePermissions();
  const [pinnedChannels, setPinnedChannels] = useState<string[]>(['chat', 'canarana']);

  // Calculate exam statistics from mock data
  const examStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get start of current week (Sunday)
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);
    
    const totalExams = mockExamData.length;
    
    const examsThisMonth = mockExamData.filter(exam => {
      const examDate = new Date(exam.date);
      return examDate.getMonth() === currentMonth && examDate.getFullYear() === currentYear;
    }).length;
    
    const examsThisWeek = mockExamData.filter(exam => {
      const examDate = new Date(exam.date);
      return examDate >= currentWeekStart;
    }).length;
    
    return {
      totalExams,
      examsThisMonth,
      examsThisWeek
    };
  }, []);

  // Canais baseados nas permissões do usuário usando o hook
  const getUserChannels = () => {
    if (!user) return [];
    const channelMap = [{
      id: 'chat',
      name: 'Canal Geral',
      type: 'general'
    }, {
      id: 'canarana',
      name: 'Canarana',
      type: 'store'
    }, {
      id: 'souto-soares',
      name: 'Souto Soares',
      type: 'store'
    }, {
      id: 'joao-dourado',
      name: 'João Dourado',
      type: 'store'
    }, {
      id: 'america-dourada',
      name: 'América Dourada',
      type: 'store'
    }, {
      id: 'gerente-lojas',
      name: 'Gerente das Lojas',
      type: 'manager'
    }, {
      id: 'gerente-externo',
      name: 'Gerente do Externo',
      type: 'manager'
    }];
    const accessibleChannels = getAccessibleChannels();
    return channelMap.filter(channel => accessibleChannels.includes(channel.id)).map(channel => ({
      ...channel,
      conversationCount: getTabConversations(channel.id).length
    }));
  };
  const availableChannels = getUserChannels();

  // Filtrar conversas baseado nas permissões do usuário
  const allowedConversations = conversations.filter(conv => canAccessChannel(conv.tabId));
  const stats = {
    totalConversations: allowedConversations.length,
    unreadConversations: allowedConversations.filter(c => c.status === 'unread').length,
    inProgressConversations: allowedConversations.filter(c => c.status === 'in_progress').length,
    resolvedConversations: allowedConversations.filter(c => c.status === 'resolved').length
  };

  // Stats cards for conversations with different colors
  const statsCards = [{
    title: 'Total de Conversas',
    value: stats.totalConversations,
    description: 'conversas no sistema',
    icon: MessageCircle,
    color: '#b5103c',
    bgColor: isDarkMode ? '#4a1625' : '#fef2f2'
  }, {
    title: 'Não Lidas',
    value: stats.unreadConversations,
    description: 'aguardando resposta',
    icon: AlertCircle,
    color: '#d97706',
    bgColor: isDarkMode ? '#451a03' : '#fffbeb'
  }, {
    title: 'Em Andamento',
    value: stats.inProgressConversations,
    description: 'sendo atendidas',
    icon: Clock,
    color: '#059669',
    bgColor: isDarkMode ? '#022c22' : '#f0fdf4'
  }, {
    title: 'Resolvidas',
    value: stats.resolvedConversations,
    description: 'finalizadas hoje',
    icon: CheckCircle,
    color: '#6366f1',
    bgColor: isDarkMode ? '#1e1b4b' : '#f8fafc'
  }];

  // Estatísticas de exames simuladas com cores diferentes
  const examStatsCards = [{
    title: 'Total de Exames',
    value: examStats.totalExams,
    description: 'Exames realizados no total',
    icon: FileText,
    color: '#b5103c',
    bgColor: isDarkMode ? '#4a1625' : '#fef2f2'
  }, {
    title: 'Exames Este Mês',
    value: examStats.examsThisMonth,
    description: 'Exames realizados este mês',
    icon: Calendar,
    color: '#8b5cf6',
    bgColor: isDarkMode ? '#2d1b69' : '#faf5ff'
  }, {
    title: 'Exames Esta Semana',
    value: examStats.examsThisWeek,
    description: 'Exames realizados esta semana',
    icon: CalendarDays,
    color: '#06b6d4',
    bgColor: isDarkMode ? '#164e63' : '#f0f9ff'
  }];

  const handleTogglePin = (channelId: string) => {
    setPinnedChannels(prev => prev.includes(channelId) ? prev.filter(id => id !== channelId) : [...prev, channelId]);
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
    <div className="space-y-4 md:space-y-6 min-h-screen p-3 md:p-6 mobile-padding" style={{
      backgroundColor: isDarkMode ? '#3a3a3a' : '#f9fafb'
    }}>
      {/* Header */}
      <div className="mobile-fade-in">
        <h1 style={{ color: '#b5103c' }} className="text-xl md:text-2xl lg:text-4xl font-extrabold">
          Painel de Controle
        </h1>
        <p className={cn(
          "text-sm md:text-base",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}>
          Bem-vindo, {user?.name}
        </p>
      </div>

      {/* Stats Cards - Conversas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="animate-fade-in border" style={{
              animationDelay: `${index * 0.1}s`,
              backgroundColor: stat.bgColor,
              borderColor: isDarkMode ? '#686868' : '#e5e7eb'
            }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
                <CardTitle className={cn(
                  "text-xs md:text-sm font-medium",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  {stat.title}
                </CardTitle>
                <IconComponent size={14} className="md:w-4 md:h-4" style={{ color: stat.color }} />
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="text-lg md:text-2xl font-bold" style={{ color: stat.color }}>
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

      {/* Stats Cards - Exames */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
        {examStatsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="animate-fade-in border" style={{
              animationDelay: `${(index + 4) * 0.1}s`,
              backgroundColor: stat.bgColor,
              borderColor: isDarkMode ? '#686868' : '#e5e7eb'
            }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
                <CardTitle className={cn(
                  "text-xs md:text-sm font-medium",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  {stat.title}
                </CardTitle>
                <IconComponent size={14} className="md:w-4 md:h-4" style={{ color: stat.color }} />
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="text-lg md:text-2xl font-bold" style={{ color: stat.color }}>
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
          <h2 style={{ color: '#b5103c' }} className="text-lg md:text-xl lg:text-3xl font-semibold">
            Canais de Atendimento
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
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

      {/* Exam Line Charts Section */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold mb-4" style={{ color: '#b5103c' }}>
          Estatísticas de Exames
        </h2>
        <ExamLineCharts isDarkMode={isDarkMode} examData={mockExamData} />
      </div>
    </div>
  );
};
