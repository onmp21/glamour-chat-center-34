
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ConversationStatsCardsProps {
  isDarkMode: boolean;
}

export const ConversationStatsCards: React.FC<ConversationStatsCardsProps> = ({ isDarkMode }) => {
  const stats = [
    {
      title: 'Total de Conversas',
      value: '1,234',
      change: '+12%',
      changeType: 'positive' as const,
      icon: MessageCircle,
      color: 'blue'
    },
    {
      title: 'Não Lidas',
      value: '45',
      change: '+8%',
      changeType: 'neutral' as const,
      icon: AlertCircle,
      color: 'red'
    },
    {
      title: 'Em Andamento',
      value: '89',
      change: '-3%',
      changeType: 'negative' as const,
      icon: Clock,
      color: 'yellow'
    },
    {
      title: 'Resolvidas',
      value: '1,100',
      change: '+15%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'green'
    }
  ];

  const getChangeColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
    }
  };

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      red: 'text-red-600',
      yellow: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
      green: 'text-green-600'
    };
    return colors[color as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card 
            key={index} 
            className={cn(
              "transition-all duration-200 hover:shadow-lg",
              isDarkMode ? "dark-bg-secondary dark-border" : "bg-white border-gray-200"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={cn(
                "text-sm font-medium leading-tight",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}>
                {stat.title}
              </CardTitle>
              <IconComponent className={cn("h-4 w-4", getIconColor(stat.color))} />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className={cn(
                  "text-2xl font-bold leading-none",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  {stat.value}
                </div>
                <p className={cn(
                  "text-xs font-medium leading-none",
                  getChangeColor(stat.changeType)
                )}>
                  {stat.change}
                </p>
              </div>
              <p className={cn(
                "text-xs mt-1 leading-relaxed",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                desde o último mês
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
