
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getTableNameForChannel } from '@/utils/channelMapping';
import { groupMessagesByPhone } from '@/utils/conversationGrouper';

export interface ChannelConversation {
  id: string;
  contact_name: string;
  contact_phone: string;
  last_message: string | null;
  last_message_time: string | null;
  status: 'unread' | 'in_progress' | 'resolved';
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export const useChannelConversations = (channelId?: string) => {
  const [conversations, setConversations] = useState<ChannelConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadConversations = async () => {
    if (!channelId) {
      console.log('Nenhum channelId fornecido');
      setLoading(false);
      setConversations([]);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Carregando conversas para o canal:', channelId);
      
      const tableName = getTableNameForChannel(channelId);
      console.log('Fazendo query na tabela:', tableName);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }
      
      console.log('Dados brutos do Supabase:', data);
      
      const typedConversations = groupMessagesByPhone(data || []);
      
      console.log('Conversas agrupadas:', typedConversations);
      setConversations(typedConversations);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      setConversations([]);
      
      if (error && typeof error === 'object' && 'message' in error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar conversas. Verifique sua conexão.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateConversationStatus = async (conversationId: string, status: 'unread' | 'in_progress' | 'resolved') => {
    if (!channelId) {
      console.error('Nenhum channelId fornecido para updateConversationStatus');
      return;
    }
    
    try {
      console.log('Atualizando status da conversa:', conversationId, 'para:', status);
      
      // Atualizar apenas estado local, pois as tabelas originais não têm campo status
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, status, updated_at: new Date().toISOString() } : conv
      ));
      
      console.log('Status da conversa atualizado localmente');
    } catch (error) {
      console.error('Erro ao atualizar status da conversa:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da conversa",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadConversations();
  }, [channelId]);

  return {
    conversations,
    loading,
    loadConversations,
    updateConversationStatus
  };
};
