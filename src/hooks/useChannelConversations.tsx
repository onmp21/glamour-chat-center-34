
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const getTableNameForChannel = (channelId: string): string => {
  const tableMap: Record<string, string> = {
    'chat': 'yelena_ai_conversas',
    'canarana': 'canarana_conversas',
    'souto-soares': 'souto_soares_conversas',
    'joao-dourado': 'joao_dourado_conversas',
    'america-dourada': 'america_dourada_conversas',
    'gerente-lojas': 'gerente_lojas_conversas',
    'gerente-externo': 'gerente_externo_conversas',
    'pedro': 'pedro_conversas'
  };
  return tableMap[channelId] || 'yelena_ai_conversas';
};

export const useChannelConversations = (channelId?: string) => {
  const [conversations, setConversations] = useState<ChannelConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadConversations = async () => {
    if (!channelId) return;
    
    try {
      setLoading(true);
      const tableName = getTableNameForChannel(channelId);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      const typedConversations: ChannelConversation[] = (data || []).map(conv => ({
        ...conv,
        status: conv.status as 'unread' | 'in_progress' | 'resolved'
      }));
      
      setConversations(typedConversations);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conversas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConversationStatus = async (conversationId: string, status: 'unread' | 'in_progress' | 'resolved') => {
    if (!channelId) return;
    
    try {
      const tableName = getTableNameForChannel(channelId);
      
      const { error } = await supabase
        .from(tableName)
        .update({ status })
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, status } : conv
      ));
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
