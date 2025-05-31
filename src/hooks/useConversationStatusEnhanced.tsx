
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export type ConversationStatus = 'unread' | 'in_progress' | 'resolved';

export interface ConversationStatusData {
  id: string;
  channel_id: string;
  conversation_id: string;
  status: ConversationStatus;
  updated_at: string;
  created_at: string;
}

export const useConversationStatusEnhanced = () => {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  // Auto-resolve old conversations (24h rule)
  useEffect(() => {
    const autoResolveOldConversations = () => {
      try {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        // Get all conversation statuses from localStorage
        const keys = Object.keys(localStorage).filter(key => key.startsWith('conversation_status_'));
        
        keys.forEach(key => {
          const statusData = localStorage.getItem(key);
          if (statusData) {
            try {
              const parsed = JSON.parse(statusData);
              const updatedAt = new Date(parsed.updated_at || parsed.created_at);
              
              if (updatedAt < twentyFourHoursAgo && parsed.status !== 'resolved') {
                const resolvedData = {
                  ...parsed,
                  status: 'resolved',
                  updated_at: new Date().toISOString()
                };
                localStorage.setItem(key, JSON.stringify(resolvedData));
                console.log('🤖 Auto-resolved conversation:', key);
              }
            } catch (error) {
              console.error('❌ Error parsing status data:', error);
            }
          }
        });
      } catch (error) {
        console.error('❌ Error in auto-resolve process:', error);
      }
    };

    // Run immediately
    autoResolveOldConversations();

    // Set up interval to run every hour
    const interval = setInterval(autoResolveOldConversations, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const updateConversationStatus = useCallback(async (
    channelId: string,
    conversationId: string, 
    status: ConversationStatus,
    showToastNotification: boolean = true
  ): Promise<boolean> => {
    if (!channelId || !conversationId) {
      console.error('❌ [CONVERSATION_STATUS] Missing channelId or conversationId');
      return false;
    }
    
    try {
      setUpdating(true);
      
      const statusKey = `conversation_status_${channelId}_${conversationId}`;
      const statusData: ConversationStatusData = {
        id: `${channelId}_${conversationId}`,
        channel_id: channelId,
        conversation_id: conversationId,
        status: status,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      localStorage.setItem(statusKey, JSON.stringify(statusData));
      
      if (showToastNotification) {
        const statusMessages = {
          'unread': 'não lida',
          'in_progress': 'em andamento', 
          'resolved': 'resolvida'
        };
        
        toast({
          title: "Status atualizado",
          description: `Conversa marcada como ${statusMessages[status]}`,
        });
      }
      
      return true;
    } catch (err) {
      console.error('❌ [CONVERSATION_STATUS] Error updating conversation status:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da conversa",
        variant: "destructive"
      });
      return false;
    } finally {
      setUpdating(false);
    }
  }, [toast]);

  const getConversationStatus = useCallback(async (channelId: string, conversationId: string): Promise<ConversationStatus> => {
    try {
      const statusKey = `conversation_status_${channelId}_${conversationId}`;
      const savedStatus = localStorage.getItem(statusKey);
      
      if (savedStatus) {
        const parsed = JSON.parse(savedStatus);
        return parsed.status as ConversationStatus;
      }
      
      return 'unread';
    } catch (error) {
      console.error('❌ [CONVERSATION_STATUS] Error getting status:', error);
      return 'unread';
    }
  }, []);

  const getStatusCounts = useCallback(async (channelId: string) => {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(`conversation_status_${channelId}_`)
      );

      const statuses = keys.map(key => {
        try {
          const data = localStorage.getItem(key);
          return data ? JSON.parse(data).status : 'unread';
        } catch {
          return 'unread';
        }
      });

      const counts = {
        total: statuses.length,
        pending: statuses.filter(status => status === 'unread').length,
        inProgress: statuses.filter(status => status === 'in_progress').length,
        resolved: statuses.filter(status => status === 'resolved').length
      };

      return counts;
    } catch (error) {
      console.error('❌ [CONVERSATION_STATUS] Error getting counts:', error);
      return { total: 0, pending: 0, inProgress: 0, resolved: 0 };
    }
  }, []);

  return {
    updateConversationStatus,
    getConversationStatus,
    getStatusCounts,
    updating
  };
};
