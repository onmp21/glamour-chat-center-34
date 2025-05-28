
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { cn } from '@/lib/utils';
import { ConversationStatsCards } from './dashboard/ConversationStatsCards';
import { ExamStatsCards } from './dashboard/ExamStatsCards';
import { ChannelsSection } from './dashboard/ChannelsSection';
import { DashboardHeader } from './dashboard/DashboardHeader';

interface DashboardProps {
  isDarkMode: boolean;
  onSectionSelect: (section: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ isDarkMode, onSectionSelect }) => {
  const { user } = useAuth();
  const { channels } = useChannels();
  const { getAccessibleChannels } = usePermissions();
  const { stats, loading: statsLoading } = useDashboardStats();

  // Mapear canais do banco para IDs legados para compatibilidade
  const getChannelLegacyId = (channel: any) => {
    const nameToId: Record<string, string> = {
      'Yelena-AI': 'chat',
      'Canarana': 'canarana',
      'Souto Soares': 'souto-soares',
      'João Dourado': 'joao-dourado',
      'América Dourada': 'america-dourada',
      'Gerente das Lojas': 'gerente-lojas',
      'Gerente do Externo': 'gerente-externo',
      'Pedro': 'pedro'
    };
    return nameToId[channel.name] || channel.id;
  };

  const accessibleChannels = getAccessibleChannels();
  const availableChannels = channels
    .filter(channel => channel.isActive)
    .map(channel => ({
      ...channel,
      legacyId: getChannelLegacyId(channel)
    }))
    .filter(channel => accessibleChannels.includes(channel.legacyId))
    .map(channel => ({
      id: channel.legacyId,
      name: channel.name,
      conversationCount: 0
    }));

  // Buscar contagens de conversas para cada canal
  const channelCounts = availableChannels.map(channel => {
    const { conversations } = useChannelConversationsRefactored(channel.id);
    return {
      ...channel,
      conversationCount: conversations.length
    };
  });

  const handleChannelClick = (channelId: string) => {
    console.log(`🎯 [DASHBOARD] Channel clicked: ${channelId}`);
    onSectionSelect(channelId);
  };

  // Ajustar stats para corresponder à interface esperada
  const conversationStats = {
    totalConversations: stats.totalConversations,
    unreadConversations: stats.activeConversations,
    inProgressConversations: Math.floor(stats.activeConversations * 0.6) // Aproximação para conversas em andamento
  };

  const examStats = {
    totalExams: stats.totalExams || 0,
    examsThisMonth: stats.monthlyExams || 0,
    examsThisWeek: stats.weeklyExams || 0
  };

  return (
    <div className={cn(
      "flex-1 overflow-y-auto w-full",
      isDarkMode ? "bg-[#09090b]" : "bg-gray-50"
    )}>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <DashboardHeader user={user} isDarkMode={isDarkMode} />
        
        <ConversationStatsCards 
          stats={conversationStats} 
          loading={statsLoading} 
          isDarkMode={isDarkMode} 
        />
        
        <ExamStatsCards
          isDarkMode={isDarkMode}
          examStats={examStats}
        />
        
        <ChannelsSection
          isDarkMode={isDarkMode}
          availableChannels={channelCounts}
          onChannelClick={handleChannelClick}
        />
      </div>
    </div>
  );
};
