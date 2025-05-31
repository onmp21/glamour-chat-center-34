
import React from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ConversationStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

interface ConversationStatsCardsProps {
  isDarkMode: boolean;
  conversationStats: ConversationStats;
  onCardClick?: (filter: 'total' | 'pending' | 'inProgress' | 'resolved') => void;
}

export const ConversationStatsCards: React.FC<ConversationStatsCardsProps> = ({
  isDarkMode,
  conversationStats,
  onCardClick
}) => {
  const cards = [
    {
      title: 'Total',
      value: conversationStats.total,
      icon: MessageCircle,
      color: isDarkMode ? 'text-blue-400' : 'text-blue-600',
      filter: 'total' as const
    },
    {
      title: 'Pendentes',
      value: conversationStats.pending,
      icon: Clock,
      color: isDarkMode ? 'text-orange-400' : 'text-orange-600',
      filter: 'pending' as const
    },
    {
      title: 'Em Andamento',
      value: conversationStats.inProgress,
      icon: AlertCircle,
      color: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
      filter: 'inProgress' as const
    },
    {
      title: 'Resolvidas',
      value: conversationStats.resolved,
      icon: CheckCircle,
      color: isDarkMode ? 'text-green-400' : 'text-green-600',
      filter: 'resolved' as const
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className={cn(
        "text-xl font-bold",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>
        Estatísticas de Conversas
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const IconComponent = card.icon;
          const isClickable = onCardClick && card.filter !== 'total';
          
          return (
            <div
              key={index}
              onClick={() => isClickable && onCardClick(card.filter)}
              className={cn(
                "rounded-lg border p-4 flex flex-col justify-between min-h-[100px] transition-all duration-200",
                isDarkMode 
                  ? "bg-[#18181b] border-[#3f3f46]" 
                  : "bg-white border-gray-200",
                isClickable && "cursor-pointer hover:shadow-lg transform hover:scale-105",
                isClickable && isDarkMode && "hover:bg-[#1f1f23]",
                isClickable && !isDarkMode && "hover:bg-gray-50"
              )}
            >
              <div className="flex items-center justify-between">
                <div className={cn(
                  "p-2 rounded-full transition-colors",
                  isDarkMode ? "bg-[#27272a]" : "bg-gray-100",
                  isClickable && "group-hover:scale-110"
                )}>
                  <IconComponent size={18} className={card.color} />
                </div>
                {isClickable && (
                  <div className={cn(
                    "text-xs opacity-0 transition-opacity",
                    isDarkMode ? "text-zinc-400" : "text-gray-500",
                    "hover:opacity-100"
                  )}>
                    Clique para filtrar
                  </div>
                )}
              </div>
              
              <div className="mt-3">
                <h3 className={cn(
                  "text-xs font-medium",
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                )}>
                  {card.title}
                </h3>
                <p className={cn(
                  "text-xl font-bold mt-1",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
