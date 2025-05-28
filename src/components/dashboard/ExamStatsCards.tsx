
import React from 'react';
import { cn } from '@/lib/utils';
import { FileText, Calendar, TrendingUp } from 'lucide-react';

interface ExamStats {
  totalExams: number;
  examsThisMonth: number;
  examsThisWeek: number;
}

interface ExamStatsCardsProps {
  isDarkMode: boolean;
  examStats: ExamStats;
}

export const ExamStatsCards: React.FC<ExamStatsCardsProps> = ({
  isDarkMode,
  examStats
}) => {
  const cards = [
    {
      title: 'Total de Exames',
      value: examStats.totalExams,
      icon: FileText,
      color: isDarkMode ? 'text-purple-400' : 'text-purple-600'
    },
    {
      title: 'Este Mês',
      value: examStats.examsThisMonth,
      icon: Calendar,
      color: isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
    },
    {
      title: 'Esta Semana',
      value: examStats.examsThisWeek,
      icon: TrendingUp,
      color: isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
    }
  ];

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h2 className={cn(
        "text-xl font-bold",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>
        Estatísticas de Exames
      </h2>
      
      {/* Container com altura fixa para consistência */}
      <div className="flex-1 min-h-[400px] max-h-[400px] flex flex-col justify-start">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className={cn(
                  "rounded-lg border p-6 flex flex-col justify-between min-h-[120px]",
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
