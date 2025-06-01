
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConversationStatsCards } from '@/components/dashboard/ConversationStatsCards';
import { ExamStatsCardsCompact } from '@/components/dashboard/ExamStatsCardsCompact';
import { ChannelCardsGrid } from '@/components/dashboard/ChannelCards';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { cn } from '@/lib/utils';
import { BarChart3, Users, Calendar, MessageSquare } from 'lucide-react';

interface DashboardProps {
  isDarkMode: boolean;
  onSectionSelect: (section: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  isDarkMode, 
  onSectionSelect 
}) => {
  const { 
    conversationStats, 
    examStats, 
    availableChannels, 
    loading,
    ChannelStatsAggregator 
  } = useDashboardStats();

  return (
    <div className={cn(
      "p-6 space-y-6",
      isDarkMode ? "bg-zinc-900" : "bg-gray-50"
    )}>
      <ChannelStatsAggregator />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className={cn(
            "text-3xl font-bold",
            isDarkMode ? "text-zinc-100" : "text-gray-900"
          )}>
            Painel de Controle
          </h1>
          <p className={cn(
            "text-lg",
            isDarkMode ? "text-zinc-400" : "text-gray-600"
          )}>
            Villa Glamour - Sistema de Atendimento
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <ConversationStatsCards 
        isDarkMode={isDarkMode}
        stats={conversationStats}
        loading={loading}
      />

      {/* Channels Section */}
      <Card className={cn(
        isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center",
            isDarkMode ? "text-zinc-100" : "text-gray-900"
          )}>
            <MessageSquare className="mr-2 h-5 w-5" />
            Canais de Atendimento
          </CardTitle>
          <CardDescription className={isDarkMode ? "text-zinc-400" : "text-gray-600"}>
            Clique em um canal para acessá-lo diretamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChannelCardsGrid
            channels={availableChannels}
            isDarkMode={isDarkMode}
            onChannelClick={onSectionSelect}
          />
        </CardContent>
      </Card>

      {/* Exams Section */}
      <Card className={cn(
        isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center",
            isDarkMode ? "text-zinc-100" : "text-gray-900"
          )}>
            <Calendar className="mr-2 h-5 w-5" />
            Estatísticas de Exames
          </CardTitle>
          <CardDescription className={isDarkMode ? "text-zinc-400" : "text-gray-600"}>
            Resumo dos exames agendados e realizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExamStatsCardsCompact
            isDarkMode={isDarkMode}
            totalExams={examStats.totalExams}
            examsThisMonth={examStats.examsThisMonth}
            examsThisWeek={examStats.examsThisWeek}
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className={cn(
            "cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg",
            isDarkMode ? "bg-zinc-800 border-zinc-700 hover:border-zinc-600" : "bg-white border-gray-200 hover:border-gray-300"
          )}
          onClick={() => onSectionSelect('channels')}
        >
          <CardContent className="p-4 text-center">
            <MessageSquare className={cn(
              "w-8 h-8 mx-auto mb-2",
              isDarkMode ? "text-zinc-400" : "text-gray-600"
            )} />
            <p className={cn(
              "text-sm font-medium",
              isDarkMode ? "text-zinc-100" : "text-gray-900"
            )}>
              Ver Todos os Canais
            </p>
          </CardContent>
        </Card>

        <Card 
          className={cn(
            "cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg",
            isDarkMode ? "bg-zinc-800 border-zinc-700 hover:border-zinc-600" : "bg-white border-gray-200 hover:border-gray-300"
          )}
          onClick={() => onSectionSelect('exames')}
        >
          <CardContent className="p-4 text-center">
            <Calendar className={cn(
              "w-8 h-8 mx-auto mb-2",
              isDarkMode ? "text-zinc-400" : "text-gray-600"
            )} />
            <p className={cn(
              "text-sm font-medium",
              isDarkMode ? "text-zinc-100" : "text-gray-900"
            )}>
              Gerenciar Exames
            </p>
          </CardContent>
        </Card>

        <Card 
          className={cn(
            "cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg",
            isDarkMode ? "bg-zinc-800 border-zinc-700 hover:border-zinc-600" : "bg-white border-gray-200 hover:border-gray-300"
          )}
          onClick={() => onSectionSelect('reports')}
        >
          <CardContent className="p-4 text-center">
            <BarChart3 className={cn(
              "w-8 h-8 mx-auto mb-2",
              isDarkMode ? "text-zinc-400" : "text-gray-600"
            )} />
            <p className={cn(
              "text-sm font-medium",
              isDarkMode ? "text-zinc-100" : "text-gray-900"
            )}>
              Relatórios
            </p>
          </CardContent>
        </Card>

        <Card 
          className={cn(
            "cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg",
            isDarkMode ? "bg-zinc-800 border-zinc-700 hover:border-zinc-600" : "bg-white border-gray-200 hover:border-gray-300"
          )}
          onClick={() => onSectionSelect('tags')}
        >
          <CardContent className="p-4 text-center">
            <Users className={cn(
              "w-8 h-8 mx-auto mb-2",
              isDarkMode ? "text-zinc-400" : "text-gray-600"
            )} />
            <p className={cn(
              "text-sm font-medium",
              isDarkMode ? "text-zinc-100" : "text-gray-900"
            )}>
              Tags de Contatos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
