
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useExams } from '@/hooks/useExams';
import { useChannels } from '@/contexts/ChannelContext';
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
  const { channels } = useChannels();
  const [pinnedChannels, setPinnedChannels] = useState<string[]>(['chat', 'canarana']);

  // Mapear canais para o formato usado pelo chat
  const getChannelMapping = () => {
    const mapping: Record<string, string> = {};
    channels.forEach(channel => {
      if (channel.name === 'Yelena-AI') mapping['chat'] = channel.id;
      else if (channel.name === 'Canarana') mapping['canarana'] = channel.id;
      else if (channel.name === 'Souto Soares') mapping['souto-soares'] = channel.id;
      else if (channel.name === 'João Dourado') mapping['joao-dourado'] = channel.id;
      else if (channel.name === 'América Dourada') mapping['america-dourada'] = channel.id;
      else if (channel.name === 'Gerente das Lojas') mapping['gerente-lojas'] = channel.id;
      else if (channel.name === 'Gerente do Externo') mapping['gerente-externo'] = channel.id;
      else if (channel.name === 'Pedro') mapping['pedro'] = channel.id;
    });
    return mapping;
  };

  // Canais baseados nas permissões do usuário
  const getUserChannels = () => {
    if (!user) return [];
    const channelMapping = getChannelMapping();
    const accessibleChannels = getAccessibleChannels();
    
    return channels
      .filter(channel => channel.isActive)
      .map(channel => {
        const legacyId = Object.keys(channelMapping).find(key => channelMapping[key] === channel.id) || channel.id;
        return {
          id: legacyId,
          name: channel.name,
          type: channel.type,
          conversationCount: getTabConversations(legacyId).length
        };
      })
      .filter(channel => accessibleChannels.includes(channel.id));
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
    onNavigateToChannel('chat');
  };

  const examStats = getExamStats();
  const examStatsForCards = {
    totalExams: examStats.total,
    examsThisMonth: examStats.thisMonth,
    examsThisWeek: examStats.thisWeek
  };

  return (
    <div className="space-y-4 md:space-y-6 min-h-screen p-3 md:p-6 mobile-padding pb-20" style={{
      backgroundColor: isDarkMode ? "#0f0f0f" : "#f9fafb"
    }}>
      <DashboardHeader isDarkMode={isDarkMode} />

      <ConversationStatsCards 
        isDarkMode={isDarkMode}
        stats={conversationStats}
        onConversationCardClick={handleConversationCardClick}
      />

      <ExamStatsCards 
        isDarkMode={isDarkMode}
        examStats={examStatsForCards}
      />

      <ChannelsSection 
        isDarkMode={isDarkMode}
        availableChannels={availableChannels}
        onChannelClick={handleChannelClick}
      />
    </div>
  );
};
