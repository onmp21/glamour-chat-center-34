
import React from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, Clock, CheckCircle2 } from 'lucide-react';

interface ConversationStats {
  totalConversations: number;
  unreadConversations: number;
  inProgressConversations: number;
}

interface ConversationStatsCardsProps {
  stats: ConversationStats;
  loading: boolean;
  isDarkMode: boolean;
}

export const ConversationStatsCards: React.FC<ConversationStatsCardsProps> = ({
  stats,
  loading,
  isDarkMode
}) => {
  const cards = [
    {
      title: 'Total de Conversas',
      value: stats.totalConversations,
      icon: MessageCircle,
      color: isDarkMode ? 'text-blue-400' : 'text-blue-600'
    },
    {
      title: 'Não Lidas',
      value: stats.unreadConversations,
      icon: Clock,
      color: isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
    },
    {
      title: 'Em Andamento',
      value: stats.inProgressConversations,
      icon: CheckCircle2,
      color: isDarkMode ? 'text-green-400' : 'text-green-600'
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className={cn(
                "rounded-lg border p-6 h-32 flex flex-col justify-between", // Altura fixa
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
                  <IconComponent size={20} className={card.color} />
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                )}>
                  {card.title}
                </h3>
                <p className={cn(
                  "text-2xl font-bold mt-1",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  {loading ? '...' : card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
