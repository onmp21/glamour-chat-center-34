
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FileText, Calendar, CalendarDays } from 'lucide-react';

interface ExamStatsCardsProps {
  isDarkMode: boolean;
  examStats: {
    totalExams: number;
    examsThisMonth: number;
    examsThisWeek: number;
  };
}

export const ExamStatsCards: React.FC<ExamStatsCardsProps> = ({
  isDarkMode,
  examStats
}) => {
  const examStatsCards = [
    {
      title: 'Total de Exames',
      value: examStats.totalExams,
      description: 'Exames realizados no total',
      icon: FileText,
      color: '#b5103c'
    },
    {
      title: 'Exames Este Mês',
      value: examStats.examsThisMonth,
      description: 'Exames realizados este mês',
      icon: Calendar,
      color: '#059669'
    },
    {
      title: 'Exames Esta Semana',
      value: examStats.examsThisWeek,
      description: 'Exames realizados esta semana',
      icon: CalendarDays,
      color: '#d97706'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
      {examStatsCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card 
            key={index} 
            className="animate-fade-in border" 
            style={{
              animationDelay: `${(index + 4) * 0.1}s`,
              backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
              borderColor: isDarkMode ? '#686868' : '#e5e7eb'
            }}
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
