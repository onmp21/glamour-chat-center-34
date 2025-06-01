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
    loading,
    ChannelStatsAggregator
  } = useDashboardStats();
  const { logDashboardAction } = useAuditLogger();

  useEffect(() => {
    logDashboardAction('dashboard_accessed', 'main', {
      timestamp: new Date().toISOString(),
      device_type: isMobile ? 'mobile' : 'desktop'
    });
  }, [logDashboardAction, isMobile]);

  const handleChannelClick = (channelId: string) => {
    logDashboardAction('channel_navigation', channelId, {
      source: 'dashboard_channels_section',
      timestamp: new Date().toISOString()
    });
    onSectionSelect(channelId);
  };

  const handleConversationCardClick = (filter: 'total' | 'pending' | 'inProgress' | 'resolved') => {
    logDashboardAction('conversation_filter_selected', filter, {
      source: 'dashboard_stats_card',
      timestamp: new Date().toISOString()
    });
    
    // Navigate to conversations with filter applied
    const channelWithFilter = `conversations?status=${filter}`;
    onSectionSelect(channelWithFilter);
  };

  const handleExamCardClick = (period: 'total' | 'month' | 'week') => {
    logDashboardAction('exam_filter_selected', period, {
      source: 'dashboard_stats_card',
      timestamp: new Date().toISOString()
    });
    
    // Navigate to exams with period filter
    const examWithFilter = `exams?period=${period}`;
    onSectionSelect(examWithFilter);
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
      <ChannelStatsAggregator />
      
      <div className={cn(
        "max-w-7xl mx-auto",
        isMobile ? "p-4 pb-20" : "p-4 md:p-6"
      )}>
        <DashboardHeader isDarkMode={isDarkMode} />
        
        {isMobile ? (
          <div className="space-y-4 mt-6">
            {/* 1. Estatísticas de Conversas (Topo) */}
            <ConversationStatsCards
              isDarkMode={isDarkMode}
              conversationStats={conversationStats}
              onCardClick={handleConversationCardClick}
            />
            
            {/* 2. Canais de Atendimento (Meio) */}
            <ChannelsSection
              isDarkMode={isDarkMode}
              onChannelClick={handleChannelClick}
            />
            
            {/* 3. Estatísticas de Exames */}
            <ExamStatsCards
              isDarkMode={isDarkMode}
              examStats={examStats}
              onCardClick={handleExamCardClick}
            />
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {/* 1. Estatísticas de Conversas (Topo) */}
            <ConversationStatsCards
              isDarkMode={isDarkMode}
              conversationStats={conversationStats}
              onCardClick={handleConversationCardClick}
            />
            
            {/* 2. Canais de Atendimento (Meio) */}
            <ChannelsSection
              isDarkMode={isDarkMode}
              onChannelClick={handleChannelClick}
            />
            
            {/* 3. Estatísticas de Exames */}
            <ExamStatsCards
              isDarkMode={isDarkMode}
              examStats={examStats}
              onCardClick={handleExamCardClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};
