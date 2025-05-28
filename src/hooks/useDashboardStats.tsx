
import { useState, useEffect } from 'react';
import { useExams } from './useExams';
import { useChannels } from '@/contexts/ChannelContext';
import { useChannelConversationsRefactored } from './useChannelConversationsRefactored';
import { useAuditLogger } from './useAuditLogger';

export const useDashboardStats = () => {
  const { getExamStats } = useExams();
  const { channels } = useChannels();
  const { logDashboardAction } = useAuditLogger();
  const [loading, setLoading] = useState(true);
  const [conversationStats, setConversationStats] = useState({
    totalConversations: 0,
    unreadConversations: 0,
    inProgressConversations: 0
  });

  // Mapear canais do banco para IDs legados
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

  // Hook personalizado para coletar dados de todos os canais
  const useAllChannelsData = () => {
    const channelIds = channels
      .filter(channel => channel.isActive)
      .map(channel => getChannelLegacyId(channel));

    const channelsData = channelIds.map(channelId => {
      const { conversations } = useChannelConversationsRefactored(channelId);
      return { channelId, conversations };
    });

    return channelsData;
  };

  const allChannelsData = useAllChannelsData();

  useEffect(() => {
    const calculateStats = () => {
      setLoading(true);
      
      logDashboardAction('stats_calculation_started', 'dashboard', {
        channels_count: allChannelsData.length
      });

      let totalConversations = 0;
      let unreadConversations = 0;
      let inProgressConversations = 0;

      allChannelsData.forEach(({ channelId, conversations }) => {
        totalConversations += conversations.length;
        
        conversations.forEach(conversation => {
          // Verificar status no localStorage
          const statusKey = `conversation_status_${channelId}_${conversation.id}`;
          const status = localStorage.getItem(statusKey) || 'unread';
          
          if (status === 'unread') {
            unreadConversations++;
          } else if (status === 'in_progress') {
            inProgressConversations++;
          }
        });
      });

      setConversationStats({
        totalConversations,
        unreadConversations,
        inProgressConversations
      });

      logDashboardAction('stats_calculated', 'dashboard', {
        total_conversations: totalConversations,
        unread_conversations: unreadConversations,
        in_progress_conversations: inProgressConversations
      });

      setLoading(false);
    };

    // Calcular stats quando houver dados dos canais
    if (allChannelsData.length > 0 && allChannelsData.some(data => data.conversations.length > 0)) {
      calculateStats();
    } else {
      // Se não houver dados ainda, manter loading
      setTimeout(() => {
        if (allChannelsData.length > 0) {
          calculateStats();
        }
      }, 1000);
    }
  }, [allChannelsData, channels]);

  const examStats = getExamStats();

  const stats = {
    // Conversas com dados reais
    ...conversationStats,
    
    // Exames com dados reais
    totalExams: examStats.total,
    weeklyExams: examStats.thisWeek,
    monthlyExams: examStats.thisMonth,
    examsByCity: examStats.byCity,
    
    // Conversas por canal com dados reais
    conversationsByChannel: allChannelsData.reduce((acc, { channelId, conversations }) => {
      const channelName = channels.find(c => getChannelLegacyId(c) === channelId)?.name || channelId;
      acc[channelName] = conversations.length;
      return acc;
    }, {} as Record<string, number>)
  };

  return {
    stats,
    loading
  };
};
