
import { useState, useEffect, useCallback } from 'react';
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

export const useChannelConversations = (channelId?: string, autoRefresh = false) => {
  const [conversations, setConversations] = useState<ChannelConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadConversations = useCallback(async () => {
    if (!channelId) {
      console.log('❌ Nenhum channelId fornecido');
      setLoading(false);
      setConversations([]);
      return;
    }
    
    try {
      setLoading(false); // Não mostrar loading em refresh automático
      
      const tableName = getTableNameForChannel(channelId);
      console.log('🔍 Carregando conversas do canal:', channelId);
      console.log('📊 Fazendo query na tabela específica:', tableName);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error(`❌ Erro do Supabase na tabela ${tableName}:`, error);
        throw error;
      }
      
      console.log(`📋 Dados brutos da tabela ${tableName}:`, data?.length || 0, 'registros');
      
      const typedConversations = groupMessagesByPhone(data || []);
      
      console.log(`✅ Conversas agrupadas da tabela ${tableName}:`, typedConversations.length);
      setConversations(typedConversations);
    } catch (error) {
      console.error(`❌ Erro ao carregar conversas do canal ${channelId}:`, error);
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
  }, [channelId, toast]);

  const updateConversationStatus = async (conversationId: string, status: 'unread' | 'in_progress' | 'resolved') => {
    if (!channelId) {
      console.error('❌ Nenhum channelId fornecido para updateConversationStatus');
      return;
    }
    
    try {
      const tableName = getTableNameForChannel(channelId);
      console.log(`🔄 Atualizando status da conversa ${conversationId} para ${status} na tabela ${tableName}`);
      
      // Atualizar apenas estado local, pois as tabelas originais não têm campo status
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, status, updated_at: new Date().toISOString() } : conv
      ));
      
      console.log('✅ Status da conversa atualizado localmente');
    } catch (error) {
      console.error('❌ Erro ao atualizar status da conversa:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da conversa",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadConversations();

    if (!channelId) return;

    // Set up real-time subscription para a tabela específica do canal
    const tableName = getTableNameForChannel(channelId);
    console.log(`🔴 Configurando realtime para conversas na tabela: ${tableName}`);
    
    const channel = supabase
      .channel(`realtime-conversations-${channelId}-${tableName}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: tableName,
        },
        async (payload) => {
          console.log(`🔴 Nova conversa via realtime na tabela ${tableName}:`, payload);
          await loadConversations(); // Reload all conversations to get the latest state
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, loadConversations]);

  // Auto refresh a cada minuto se habilitado
  useEffect(() => {
    if (!autoRefresh || !channelId) return;

    const interval = setInterval(() => {
      console.log(`🔄 Auto refresh - carregando conversas do canal ${channelId}...`);
      loadConversations();
    }, 60000); // 1 minuto

    return () => clearInterval(interval);
  }, [autoRefresh, channelId, loadConversations]);

  return {
    conversations,
    loading,
    loadConversations,
    updateConversationStatus
  };
};
