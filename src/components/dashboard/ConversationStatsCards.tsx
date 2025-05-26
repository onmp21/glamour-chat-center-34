
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MessageCircle, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface ConversationStatsCardsProps {
  isDarkMode: boolean;
  stats: {
    totalConversations: number;
    unreadConversations: number;
    inProgressConversations: number;
    resolvedConversations: number;
  };
  onConversationCardClick: () => void;
}

export const ConversationStatsCards: React.FC<ConversationStatsCardsProps> = ({
  isDarkMode,
  stats,
  onConversationCardClick
}) => {
  const statsCards = [
    {
      title: 'Total de Conversas',
      value: stats.totalConversations,
      description: 'conversas no sistema',
      icon: MessageCircle,
      color: '#b5103c'
    },
    {
      title: 'Não Lidas',
      value: stats.unreadConversations,
      description: 'aguardando resposta',
      icon: AlertCircle,
      color: '#d97706'
    },
    {
      title: 'Em Andamento',
      value: stats.inProgressConversations,
      description: 'sendo atendidas',
      icon: Clock,
      color: '#059669'
    },
    {
      title: 'Resolvidas',
      value: stats.resolvedConversations,
      description: 'finalizadas hoje',
      icon: CheckCircle,
      color: '#6b7280'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {statsCards.map((stat, index) => {
        const IconComponent = stat.icon;
        const isConversationCard = stat.title === 'Total de Conversas';
        
        return (
          <Card 
            key={index} 
            className={cn(
              "animate-fade-in border transition-all duration-200", 
              isConversationCard && "md:cursor-default cursor-pointer hover:shadow-md"
            )}
            style={{
              animationDelay: `${index * 0.1}s`,
              backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
              borderColor: isDarkMode ? '#686868' : '#e5e7eb'
            }}
            onClick={isConversationCard ? () => {
              // Só funciona no mobile
              if (window.innerWidth < 768) {
                onConversationCardClick();
              }
            } : undefined}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className={cn("text-xs md:text-sm font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                {stat.title}
              </CardTitle>
              <IconComponent size={14} className="md:w-4 md:h-4" style={{ color: '#686868' }} />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
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
