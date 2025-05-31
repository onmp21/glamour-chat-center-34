import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
    const autoResolveOldConversations = async () => {
      try {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const { error } = await supabase
          .from('conversation_status')
          .update({ 
            status: 'resolved',
            updated_at: new Date().toISOString()
          })
          .lt('updated_at', twentyFourHoursAgo.toISOString())
          .neq('status', 'resolved');

        if (error) {
          console.error('❌ Error auto-resolving conversations:', error);
        } else {
          console.log('🤖 Auto-resolved old conversations');
        }
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
      
      // Upsert status in database
      const { data, error } = await supabase
        .from('conversation_status')
        .upsert({
          channel_id: channelId,
          conversation_id: conversationId,
          status: status,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'channel_id,conversation_id'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [CONVERSATION_STATUS] Database error:', error);
        throw error;
      }

      // Also keep localStorage for immediate UI updates
      const statusKey = `conversation_status_${channelId}_${conversationId}`;
      localStorage.setItem(statusKey, status);
      
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
      // First try to get from database
      const { data, error } = await supabase
        .from('conversation_status')
        .select('status')
        .eq('channel_id', channelId)
        .eq('conversation_id', conversationId)
        .single();

      if (!error && data) {
        return data.status;
      }

      // Fallback to localStorage
      const statusKey = `conversation_status_${channelId}_${conversationId}`;
      const savedStatus = localStorage.getItem(statusKey);
      return (savedStatus as ConversationStatus) || 'unread';
    } catch (error) {
      console.error('❌ [CONVERSATION_STATUS] Error getting status:', error);
      return 'unread';
    }
  }, []);

  const getStatusCounts = useCallback(async (channelId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversation_status')
        .select('status')
        .eq('channel_id', channelId);

      if (error) throw error;

      const counts = {
        total: data?.length || 0,
        pending: data?.filter(item => item.status === 'unread').length || 0,
        inProgress: data?.filter(item => item.status === 'in_progress').length || 0,
        resolved: data?.filter(item => item.status === 'resolved').length || 0
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
