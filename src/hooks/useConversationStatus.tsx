
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getTableNameForChannel } from '@/utils/channelMapping';

export const useConversationStatus = () => {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const updateConversationStatus = useCallback(async (
    channelId: string,
    conversationId: string, 
    status: 'unread' | 'in_progress' | 'resolved',
    showToastNotification: boolean = true // Adicionar parâmetro opcional
  ) => {
    if (!channelId || !conversationId) {
      console.error('❌ [CONVERSATION_STATUS] Missing channelId or conversationId');
      return false;
    }
    
    try {
      setUpdating(true);
      
      const tableName = getTableNameForChannel(channelId);
      
      // Marcar mensagens como lidas se o status for 'in_progress' ou 'resolved'
      if (status === 'in_progress' || status === 'resolved') {
        
        const { error: markReadError } = await supabase.rpc('mark_messages_as_read', {
          table_name: tableName,
          p_session_id: conversationId
        });
        
        if (markReadError) {
          console.error('❌ [CONVERSATION_STATUS] Error marking messages as read:', markReadError);
        } else {
        }
      }
      
      // Salvar status no localStorage para persistência da UI
      const statusKey = `conversation_status_${channelId}_${conversationId}`;
      localStorage.setItem(statusKey, status);
      
      
      // Exibir toast apenas se showToastNotification for true
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

  const getConversationStatus = useCallback((channelId: string, conversationId: string): 'unread' | 'in_progress' | 'resolved' => {
    const statusKey = `conversation_status_${channelId}_${conversationId}`;
    const savedStatus = localStorage.getItem(statusKey);
    return (savedStatus as 'unread' | 'in_progress' | 'resolved') || 'unread';
  }, []);

  return {
    updateConversationStatus,
    getConversationStatus,
    updating
  };
};
