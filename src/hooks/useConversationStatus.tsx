import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getTableNameForChannel } from '@/utils/channelMapping';

export type ConversationStatus = 'unread' | 'in_progress' | 'resolved';

// Helper function to safely interact with localStorage
const safeLocalStorageGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn(`[LocalStorage] Failed to get item '${key}':`, e);
    return null;
  }
};

const safeLocalStorageSet = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`[LocalStorage] Failed to set item '${key}':`, e);
  }
};

export const useConversationStatus = () => {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  // Note: The backend Supabase function 'auto-resolve-conversations' is intended
  // to handle the 24h auto-resolution logic when triggered periodically.
  // The client-side check is removed to avoid conflicts and rely on the backend trigger.

  const updateConversationStatus = useCallback(async (
    channelId: string,
    conversationId: string, 
    status: ConversationStatus,
    showToastNotification: boolean = true
  ) => {
    if (!channelId || !conversationId) {
      console.error('❌ [CONVERSATION_STATUS] Missing channelId or conversationId');
      return false;
    }
    
    const statusKey = `conversation_status_${channelId}_${conversationId}`;
    const lastActivityKey = `last_activity_${channelId}_${conversationId}`;

    // Avoid redundant updates if status is already the same
    const currentStatus = safeLocalStorageGet(statusKey);
    if (currentStatus === status) {
      console.log(`[CONVERSATION_STATUS] Status for ${conversationId} is already '${status}'. No update needed.`);
      return true; // Indicate success as no change was needed
    }

    try {
      setUpdating(true);
      
      const tableName = getTableNameForChannel(channelId);
      
      // Mark messages as read in Supabase if status changes to 'in_progress' or 'resolved'
      // This assumes the backend function exists and works correctly.
      if (status === 'in_progress' || status === 'resolved') {
        console.log(`[CONVERSATION_STATUS] Marking messages as read for ${conversationId} in table ${tableName}`);
        const { error: markReadError } = await supabase.rpc('mark_messages_as_read', {
          table_name: tableName,
          p_session_id: conversationId // Assuming conversationId corresponds to session_id pattern
        });
        
        if (markReadError) {
          // Log error but continue, as status update is primary
          console.error('❌ [CONVERSATION_STATUS] Error marking messages as read:', markReadError);
        } else {
          console.log(`✅ [CONVERSATION_STATUS] Messages marked as read for ${conversationId}`);
        }
      }
      
      // Save status in localStorage for UI persistence
      safeLocalStorageSet(statusKey, status);
      console.log(`[CONVERSATION_STATUS] Status for ${conversationId} set to '${status}' in localStorage.`);
      
      // Update timestamp of the last activity (status change)
      safeLocalStorageSet(lastActivityKey, new Date().toISOString());
      
      // Display toast notification if requested
      if (showToastNotification) {
        const statusMessages: Record<ConversationStatus, string> = {
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

  const getConversationStatus = useCallback((channelId: string, conversationId: string): ConversationStatus => {
    if (!channelId || !conversationId) return 'unread'; // Default status if IDs are missing
    const statusKey = `conversation_status_${channelId}_${conversationId}`;
    const savedStatus = safeLocalStorageGet(statusKey);
    // Ensure the returned status is one of the allowed types
    if (savedStatus === 'in_progress' || savedStatus === 'resolved') {
      return savedStatus;
    }
    return 'unread'; // Default to 'unread' if not set or invalid
  }, []);

  return {
    updateConversationStatus,
    getConversationStatus,
    updating
  };
};
