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
  console.log('Mapeando canal:', channelId);
  
  // Mapeamento direto por ID do canal
  const channelToTableMap: Record<string, TableName> = {
    'af1e5797-edc6-4ba3-a57a-25cf7297c4d6': 'canarana_conversas', // Yelena-AI (default)
    '011b69ba-cf25-4f63-af2e-4ad0260d9516': 'canarana_conversas', // Canarana
    'b7996f75-41a7-4725-8229-564f31868027': 'souto_soares_conversas', // Souto Soares
    '621abb21-60b2-4ff2-a0a6-172a94b4b65c': 'joao_dourado_conversas', // João Dourado
    '64d8acad-c645-4544-a1e6-2f0825fae00b': 'america_dourada_conversas', // América Dourada
    'd8087e7b-5b06-4e26-aa05-6fc51fd4cdce': 'gerente_lojas_conversas', // Gerente das Lojas
    'd2892900-ca8f-4b08-a73f-6b7aa5866ff7': 'gerente_externo_conversas', // Gerente do Externo
    '1e233898-5235-40d7-bf9c-55d46e4c16a1': 'pedro_conversas', // Pedro
  };
  
  // Fallback para nomes antigos se necessário
  const nameToTableMap: Record<string, TableName> = {
    'chat': 'canarana_conversas',
    'canarana': 'canarana_conversas',
    'souto-soares': 'souto_soares_conversas',
    'joao-dourado': 'joao_dourado_conversas',
    'america-dourada': 'america_dourada_conversas',
    'gerente-lojas': 'gerente_lojas_conversas',
    'gerente-externo': 'gerente_externo_conversas',
    'pedro': 'pedro_conversas'
  };
  
  const tableName = channelToTableMap[channelId] || nameToTableMap[channelId] || 'canarana_conversas';
  console.log('Usando tabela:', tableName, 'para canal:', channelId);
  return tableName;
};

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
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }
      
      console.log('Dados brutos do Supabase:', data);
      
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
      
      console.log('Conversas processadas:', typedConversations);
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
      const tableName = getTableNameForChannel(channelId);
      console.log('Atualizando na tabela:', tableName);
      
      const { error } = await supabase
        .from(tableName)
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        throw error;
      }

      // Atualizar estado local
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, status, updated_at: new Date().toISOString() } : conv
      ));
      
      console.log('Status da conversa atualizado com sucesso');
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
