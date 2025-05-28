
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MessageSquare, Eye, Clock } from 'lucide-react';
import { useAuditLogger } from '@/hooks/useAuditLogger';

interface ConversationStatsCardsProps {
  stats: {
    totalConversations: number;
    unreadConversations: number;
    inProgressConversations: number;
  };
  loading: boolean;
  isDarkMode: boolean;
}

export const ConversationStatsCards: React.FC<ConversationStatsCardsProps> = ({
  stats,
  loading,
  isDarkMode
}) => {
  const { logDashboardAction } = useAuditLogger();

  const handleCardClick = (cardType: string, value: number) => {
    logDashboardAction('stats_card_clicked', 'conversation_stats', {
      card_type: cardType,
      value: value
    });
  };

  const conversationStatsCards = [
    {
      title: 'Total de Conversas',
      value: loading ? 0 : stats.totalConversations,
      description: 'Total de conversas no sistema',
      icon: MessageSquare,
      color: '#b5103c',
      type: 'total'
    },
    {
      title: 'Não Lidas',
      value: loading ? 0 : stats.unreadConversations,
      description: 'Conversas aguardando resposta',
      icon: Eye,
      color: '#d97706',
      type: 'unread'
    },
    {
      title: 'Em Andamento',
      value: loading ? 0 : stats.inProgressConversations,
      description: 'Conversas sendo atendidas',
      icon: Clock,
      color: '#059669',
      type: 'in_progress'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
      {conversationStatsCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card 
            key={index} 
            className="animate-fade-in border cursor-pointer hover:shadow-md transition-shadow" 
            style={{
              animationDelay: `${index * 0.1}s`,
              backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
              borderColor: isDarkMode ? '#686868' : '#e5e7eb'
            }}
            onClick={() => handleCardClick(stat.type, stat.value)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className={cn("text-xs md:text-sm font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                {stat.title}
              </CardTitle>
              <IconComponent size={14} className="md:w-4 md:h-4" style={{ color: '#686868' }} />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold" style={{ color: stat.color }}>
                {loading ? '...' : stat.value}
              </div>
              <p className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
