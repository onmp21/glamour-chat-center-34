import React from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom is used

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
  const navigate = useNavigate();

  // Define navigation paths for each card
  // These paths might need adjustment based on the actual routing setup
  const cardNavigationPaths: Record<string, string> = {
    'Total': '/conversations', // Or a specific filter if needed
    'Pendentes': '/conversations?status=unread', // Assuming 'unread' maps to 'Pendentes'
    'Em Andamento': '/conversations?status=in_progress',
    'Resolvidas': '/conversations?status=resolved',
  };

  const cards = [
    {
      title: 'Total',
      value: conversationStats.total,
      icon: MessageCircle,
      color: isDarkMode ? 'text-blue-400' : 'text-blue-600',
      path: cardNavigationPaths['Total']
    },
    {
      title: 'Pendentes',
      value: conversationStats.pending,
      icon: Clock,
      color: isDarkMode ? 'text-orange-400' : 'text-orange-600',
      path: cardNavigationPaths['Pendentes']
    },
    {
      title: 'Em Andamento',
      value: conversationStats.inProgress,
      icon: AlertCircle,
      color: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
      path: cardNavigationPaths['Em Andamento']
    },
    {
      title: 'Resolvidas',
      value: conversationStats.resolved,
      icon: CheckCircle,
      color: isDarkMode ? 'text-green-400' : 'text-green-600',
      path: cardNavigationPaths['Resolvidas']
    }
  ];

  const handleCardClick = (path: string) => {
    if (path) {
      navigate(path);
    }
  };

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
          return (
            <div
              key={index}
              onClick={() => handleCardClick(card.path)}
              className={cn(
                "rounded-lg border p-4 flex flex-col justify-between min-h-[100px] cursor-pointer transition-all duration-200",
                isDarkMode 
                  ? "bg-[#18181b] border-[#3f3f46] hover:bg-[#27272a] hover:border-[#52525b]"
                  : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              )}
              role="button"
              tabIndex={0} // Make it focusable
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCardClick(card.path);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className={cn(
                  "p-2 rounded-full transition-colors",
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
  );
};
