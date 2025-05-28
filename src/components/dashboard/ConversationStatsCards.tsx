
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
}

export const ConversationStatsCards: React.FC<ConversationStatsCardsProps> = ({
  isDarkMode,
  conversationStats
}) => {
  const cards = [
    {
      title: 'Total',
      value: conversationStats.total,
      icon: MessageCircle,
      color: isDarkMode ? 'text-blue-400' : 'text-blue-600'
    },
    {
      title: 'Pendentes',
      value: conversationStats.pending,
      icon: Clock,
      color: isDarkMode ? 'text-orange-400' : 'text-orange-600'
    },
    {
      title: 'Em Andamento',
      value: conversationStats.inProgress,
      icon: AlertCircle,
      color: isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
    },
    {
      title: 'Resolvidas',
      value: conversationStats.resolved,
      icon: CheckCircle,
      color: isDarkMode ? 'text-green-400' : 'text-green-600'
    }
  ];

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h2 className={cn(
        "text-xl font-bold",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>
        Estatísticas de Conversas
      </h2>
      
      {/* Container com altura fixa para consistência */}
      <div className="flex-1 min-h-[400px] max-h-[400px] flex flex-col justify-start">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className={cn(
                  "rounded-lg border p-4 flex flex-col justify-between min-h-[120px]",
                  isDarkMode 
                    ? "bg-[#18181b] border-[#3f3f46]" 
                    : "bg-white border-gray-200"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "p-2 rounded-full",
                    isDarkMode ? "bg-[#27272a]" : "bg-gray-100"
                  )}>
                    <IconComponent size={18} className={card.color} />
                  </div>
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
    </div>
  );
};
