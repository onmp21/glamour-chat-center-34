
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar, Clock, CheckCircle, TrendingUp } from 'lucide-react';

interface ExamStatsCardsCompactProps {
  isDarkMode: boolean;
  totalExams: number;
  examsThisMonth: number;
  examsThisWeek: number;
}

export const ExamStatsCardsCompact: React.FC<ExamStatsCardsCompactProps> = ({
  isDarkMode,
  totalExams,
  examsThisMonth,
  examsThisWeek
}) => {
  const stats = [
    {
      title: "Total de Exames",
      value: totalExams,
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Este Mês",
      value: examsThisMonth,
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Esta Semana",
      value: examsThisWeek,
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          className={cn(
            "transition-all duration-200",
            isDarkMode 
              ? "bg-zinc-800 border-zinc-700" 
              : "bg-white border-gray-200"
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "p-2 rounded-lg",
                stat.bgColor
              )}>
                <stat.icon className={cn("w-4 h-4", stat.color)} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-xs font-medium",
                  isDarkMode ? "text-zinc-400" : "text-gray-600"
                )}>
                  {stat.title}
                </p>
                <p className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-zinc-100" : "text-gray-900"
                )}>
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
