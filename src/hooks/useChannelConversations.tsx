
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

type TableName = 
  | 'canarana_conversas'
  | 'souto_soares_conversas'
  | 'joao_dourado_conversas'
  | 'america_dourada_conversas'
  | 'gerente_lojas_conversas'
  | 'gerente_externo_conversas'
  | 'pedro_conversas';

const getTableNameForChannel = (channelId: string): TableName => {
  console.log('Mapping channel:', channelId);
  
  const tableMap: Record<string, TableName> = {
    'chat': 'canarana_conversas',
    'canarana': 'canarana_conversas',
    'souto-soares': 'souto_soares_conversas',
    'joao-dourado': 'joao_dourado_conversas',
    'america-dourada': 'america_dourada_conversas',
    'gerente-lojas': 'gerente_lojas_conversas',
    'gerente-externo': 'gerente_externo_conversas',
    'pedro': 'pedro_conversas'
  };
  
  const tableName = tableMap[channelId] || 'canarana_conversas';
  console.log('Using table:', tableName);
  return tableName;
};

export const useChannelConversations = (channelId?: string) => {
  const [conversations, setConversations] = useState<ChannelConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadConversations = async () => {
    if (!channelId) {
      console.log('No channelId provided');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Loading conversations for channel:', channelId);
      
      const tableName = getTableNameForChannel(channelId);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Raw data from Supabase:', data);
      
      const typedConversations: ChannelConversation[] = (data || []).map(conv => ({
        id: conv.id,
        contact_name: conv.contact_name,
        contact_phone: conv.contact_phone,
        last_message: conv.last_message,
        last_message_time: conv.last_message_time,
        status: conv.status as 'unread' | 'in_progress' | 'resolved',
        assigned_to: conv.assigned_to,
        created_at: conv.created_at,
        updated_at: conv.updated_at
      }));
      
      console.log('Processed conversations:', typedConversations);
      setConversations(typedConversations);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      setConversations([]);
      
      // Não mostrar toast para evitar spam durante desenvolvimento
      // toast({
      //   title: "Erro",
      //   description: "Erro ao carregar conversas",
      //   variant: "destructive"
      // });
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
