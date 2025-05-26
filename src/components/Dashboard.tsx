
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useExams } from '@/hooks/useExams';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { ConversationStatsCards } from './dashboard/ConversationStatsCards';
import { ExamStatsCards } from './dashboard/ExamStatsCards';
import { ChannelsSection } from './dashboard/ChannelsSection';

interface DashboardProps {
  isDarkMode: boolean;
  onNavigateToChannel: (channelId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  isDarkMode,
  onNavigateToChannel
}) => {
  const { user } = useAuth();
  const { conversations, getTabConversations } = useChat();
  const { getAccessibleChannels, canAccessChannel } = usePermissions();
  const { getExamStats } = useExams();
  const [pinnedChannels, setPinnedChannels] = useState<string[]>(['chat', 'canarana']);

  // Canais baseados nas permissões do usuário usando o hook
  const getUserChannels = () => {
    if (!user) return [];
    const channelMap = [
      { id: 'chat', name: 'Canal Geral', type: 'general' },
      { id: 'canarana', name: 'Canarana', type: 'store' },
      { id: 'souto-soares', name: 'Souto Soares', type: 'store' },
      { id: 'joao-dourado', name: 'João Dourado', type: 'store' },
      { id: 'america-dourada', name: 'América Dourada', type: 'store' },
      { id: 'gerente-lojas', name: 'Gerente das Lojas', type: 'manager' },
      { id: 'gerente-externo', name: 'Gerente do Externo', type: 'manager' }
    ];
    const accessibleChannels = getAccessibleChannels();
    return channelMap.filter(channel => accessibleChannels.includes(channel.id)).map(channel => ({
      ...channel,
      conversationCount: getTabConversations(channel.id).length
    }));
  };

  const availableChannels = getUserChannels();

  // Filtrar conversas baseado nas permissões do usuário
  const allowedConversations = conversations.filter(conv => canAccessChannel(conv.tabId));
  const conversationStats = {
    totalConversations: allowedConversations.length,
    unreadConversations: allowedConversations.filter(c => c.status === 'unread').length,
    inProgressConversations: allowedConversations.filter(c => c.status === 'in_progress').length,
    resolvedConversations: allowedConversations.filter(c => c.status === 'resolved').length
  };

  const handleChannelClick = (channelId: string) => {
    console.log('Navegando para canal:', channelId);
    onNavigateToChannel(channelId);
  };

  const handleConversationCardClick = () => {
    // Redireciona para canais quando clica no card de conversas
    onNavigateToChannel('chat');
  };

  // Usar dados reais dos exames
  const examStats = getExamStats();
  const examStatsForCards = {
    totalExams: examStats.total,
    examsThisMonth: examStats.thisMonth,
    examsThisWeek: examStats.thisWeek
  };

  return (
    <div className="space-y-4 md:space-y-6 min-h-screen p-3 md:p-6 mobile-padding pb-20" style={{
      backgroundColor: isDarkMode ? "#111112" : "#f9fafb"
    }}>
      <DashboardHeader isDarkMode={isDarkMode} />

      {/* Stats Cards - Conversas com funcionalidade de clique mobile */}
      <ConversationStatsCards 
        isDarkMode={isDarkMode}
        stats={conversationStats}
        onConversationCardClick={handleConversationCardClick}
      />

      {/* Stats Cards - Exames */}
      <ExamStatsCards 
        isDarkMode={isDarkMode}
        examStats={examStatsForCards}
      />

      {/* Channels Section */}
      <ChannelsSection 
        isDarkMode={isDarkMode}
        availableChannels={availableChannels}
        onChannelClick={handleChannelClick}
      />

      {/* Exam Chart Section */}
    </div>
  );
};
