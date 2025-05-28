
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { ChannelsSection } from './dashboard/ChannelsSection';
import { ConversationStatsCards } from './dashboard/ConversationStatsCards';
import { ExamStatsCards } from './dashboard/ExamStatsCards';
import { DashboardHeader } from './dashboard/DashboardHeader';

interface DashboardProps {
  isDarkMode: boolean;
  onSectionSelect: (section: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  isDarkMode,
  onSectionSelect
}) => {
  const { isMobile } = useResponsive();
  const { 
    conversationStats, 
    examStats, 
    availableChannels, 
    loading 
  } = useDashboardStats();
  const { logDashboardAction } = useAuditLogger();

  useEffect(() => {
    logDashboardAction('dashboard_accessed', 'main', {
      timestamp: new Date().toISOString(),
      device_type: isMobile ? 'mobile' : 'desktop'
    });
  }, []);

  const handleChannelClick = (channelId: string) => {
    logDashboardAction('channel_navigation', channelId, {
      source: 'dashboard_channels_section',
      timestamp: new Date().toISOString()
    });
    onSectionSelect(channelId);
  };

  if (loading) {
    return (
      <div className={cn(
        "flex items-center justify-center h-full",
        isDarkMode ? "bg-[#09090b]" : "bg-white"
      )}>
        <div className={cn(
          "animate-spin rounded-full h-8 w-8 border-b-2",
          isDarkMode ? "border-white" : "border-gray-900"
        )}></div>
      </div>
    );
  }

  return (
    <div className={cn(
      "h-full overflow-auto",
      isDarkMode ? "bg-[#09090b]" : "bg-white"
    )}>
      <div className="max-w-7xl mx-auto p-6">
        <DashboardHeader isDarkMode={isDarkMode} />
        
        {/* Grid com altura fixa para todas as seções */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {/* Seção de Canais - apenas na versão web */}
          {!isMobile && (
            <div className={cn(
              "rounded-lg border p-6 h-[500px] flex flex-col",
              isDarkMode 
                ? "bg-[#18181b] border-[#3f3f46]" 
                : "bg-white border-gray-200"
            )}>
              <ChannelsSection
                isDarkMode={isDarkMode}
                availableChannels={availableChannels}
                onChannelClick={handleChannelClick}
              />
            </div>
          )}
          
          {/* Estatísticas de Conversas */}
          <div className={cn(
            "rounded-lg border p-6 h-[500px] flex flex-col",
            isDarkMode 
              ? "bg-[#18181b] border-[#3f3f46]" 
              : "bg-white border-gray-200"
          )}>
            <ConversationStatsCards
              isDarkMode={isDarkMode}
              conversationStats={conversationStats}
            />
          </div>
          
          {/* Estatísticas de Exames */}
          <div className={cn(
            "rounded-lg border p-6 h-[500px] flex flex-col",
            isDarkMode 
              ? "bg-[#18181b] border-[#3f3f46]" 
              : "bg-white border-gray-200",
            // Para mobile e quando não há seção de canais, ocupar toda a largura
            isMobile ? "col-span-1" : "lg:col-span-1"
          )}>
            <ExamStatsCards
              isDarkMode={isDarkMode}
              examStats={examStats}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
