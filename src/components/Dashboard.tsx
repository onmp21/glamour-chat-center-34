
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
      <ChannelStatsAggregator />
      
      <div className={cn(
        "max-w-7xl mx-auto",
        isMobile ? "p-4 pb-20" : "p-4 md:p-6"
      )}>
        <DashboardHeader isDarkMode={isDarkMode} />
        
        {isMobile ? (
          /* Layout Mobile - Com padding extra para evitar corte pela hotbar */
          <div className="space-y-4 mt-6">
            <ConversationStatsCards
              isDarkMode={isDarkMode}
              conversationStats={conversationStats}
            />
            
            <ExamStatsCards
              isDarkMode={isDarkMode}
              examStats={examStats}
            />
          </div>
        ) : (
          /* Layout Desktop - Cards soltos sem blocos extras */
          <div className="space-y-6 mt-6">
            <ConversationStatsCards
              isDarkMode={isDarkMode}
              conversationStats={conversationStats}
            />
            
            <ExamStatsCards
              isDarkMode={isDarkMode}
              examStats={examStats}
            />
            
            {/* Canais de atendimento - apenas Desktop */}
            <div className={cn(
              "rounded-lg border p-6",
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
          </div>
        )}
      </div>
    </div>
  );
};
