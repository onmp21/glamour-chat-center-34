
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useConversationStatus = () => {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const updateConversationStatus = useCallback(async (
    channelId: string,
    conversationId: string, 
    status: 'unread' | 'in_progress' | 'resolved'
  ) => {
    if (!channelId || !conversationId) {
      console.error('❌ Missing channelId or conversationId for updateConversationStatus');
      return false;
    }
    
    try {
      setUpdating(true);
      console.log(`🔄 Updating conversation ${conversationId} status to ${status} in channel ${channelId}`);
      
      // Determinar o nome da tabela baseado no channelId
      const getTableNameForChannel = (id: string) => {
        const channelToTable: Record<string, string> = {
          'chat': 'yelena_ai_conversas',
          'canarana': 'canarana_conversas',
          'souto-soares': 'souto_soares_conversas',
          'joao-dourado': 'joao_dourado_conversas',
          'america-dourada': 'america_dourada_conversas',
          'gerente-lojas': 'gerente_lojas_conversas',
          'gerente-externo': 'gerente_externo_conversas',
          'pedro': 'pedro_conversas'
        };
        return channelToTable[id] || 'yelena_ai_conversas';
      };

      const tableName = getTableNameForChannel(channelId);
      
      // Marcar mensagens como lidas se o status for 'in_progress' ou 'resolved'
      if (status === 'in_progress' || status === 'resolved') {
        console.log(`📖 Marking messages as read in table ${tableName} for session ${conversationId}`);
        
        // Para canal Yelena, usar session_id que pode ter formatos diferentes
        let sessionIdToMark = conversationId;
        if (channelId === 'chat') {
          // Buscar todas as variações possíveis do session_id
          const { data: existingSessions } = await supabase
            .from(tableName)
            .select('session_id')
            .or(`session_id.eq.${conversationId},session_id.like.${conversationId}-%,session_id.like.%-${conversationId}`);
          
          if (existingSessions && existingSessions.length > 0) {
            // Marcar todas as variações como lidas
            for (const session of existingSessions) {
              const { error: markReadError } = await supabase.rpc('mark_messages_as_read', {
                table_name: tableName,
                p_session_id: session.session_id
              });
              
              if (markReadError) {
                console.error('❌ Error marking messages as read:', markReadError);
              } else {
                console.log(`✅ Messages marked as read for ${session.session_id} in ${tableName}`);
              }
            }
          }
        } else {
          // Para outros canais, usar o método normal
          const { error: markReadError } = await supabase.rpc('mark_messages_as_read', {
            table_name: tableName,
            p_session_id: sessionIdToMark
          });
          
          if (markReadError) {
            console.error('❌ Error marking messages as read:', markReadError);
            throw markReadError;
          }
          
          console.log(`✅ Messages marked as read for ${sessionIdToMark} in ${tableName}`);
        }
      }
      
      // Salvar status no localStorage para persistência da UI
      const statusKey = `conversation_status_${channelId}_${conversationId}`;
      localStorage.setItem(statusKey, status);
      
      console.log(`✅ Conversation status updated to ${status} and saved locally`);
      
      const statusMessages = {
        'unread': 'não lida',
        'in_progress': 'em andamento', 
        'resolved': 'resolvida'
      };
      
      toast({
        title: "Status atualizado",
        description: `Conversa marcada como ${statusMessages[status]}`,
      });
      
      return true;
    } catch (err) {
      console.error('❌ Error updating conversation status:', err);
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
