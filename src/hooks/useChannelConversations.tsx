
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
  | 'yelena_ai_conversas'
  | 'canarana_conversas'
  | 'souto_soares_conversas'
  | 'joao_dourado_conversas'
  | 'america_dourada_conversas'
  | 'gerente_lojas_conversas'
  | 'gerente_externo_conversas'
  | 'pedro_conversas';

const getTableNameForChannel = (channelId: string): TableName => {
  console.log('Mapeando canal:', channelId);
  
  const channelToTableMap: Record<string, TableName> = {
    'af1e5797-edc6-4ba3-a57a-25cf7297c4d6': 'yelena_ai_conversas',
    '011b69ba-cf25-4f63-af2e-4ad0260d9516': 'canarana_conversas',
    'b7996f75-41a7-4725-8229-564f31868027': 'souto_soares_conversas',
    '621abb21-60b2-4ff2-a0a6-172a94b4b65c': 'joao_dourado_conversas',
    '64d8acad-c645-4544-a1e6-2f0825fae00b': 'america_dourada_conversas',
    'd8087e7b-5b06-4e26-aa05-6fc51fd4cdce': 'gerente_lojas_conversas',
    'd2892900-ca8f-4b08-a73f-6b7aa5866ff7': 'gerente_externo_conversas',
    '1e233898-5235-40d7-bf9c-55d46e4c16a1': 'pedro_conversas',
  };
  
  const nameToTableMap: Record<string, TableName> = {
    'chat': 'yelena_ai_conversas',
    'canarana': 'canarana_conversas',
    'souto-soares': 'souto_soares_conversas',
    'joao-dourado': 'joao_dourado_conversas',
    'america-dourada': 'america_dourada_conversas',
    'gerente-lojas': 'gerente_lojas_conversas',
    'gerente-externo': 'gerente_externo_conversas',
    'pedro': 'pedro_conversas'
  };
  
  const tableName = channelToTableMap[channelId] || nameToTableMap[channelId] || 'yelena_ai_conversas';
  console.log('Usando tabela:', tableName, 'para canal:', channelId);
  return tableName;
};

// Função para extrair telefone e nome do session_id
const extractContactFromSessionId = (sessionId: string) => {
  // Assumindo formato como "numero_nome" ou "numero-nome" ou similar
  const parts = sessionId.split(/[-_]/);
  
  // Tentar encontrar um número de telefone (sequência de dígitos)
  const phoneMatch = sessionId.match(/(\d{10,15})/);
  const phone = phoneMatch ? phoneMatch[1] : parts[0] || 'Desconhecido';
  
  // Extrair nome (removendo números e caracteres especiais)
  const nameMatch = sessionId.replace(/\d+/g, '').replace(/[-_]/g, ' ').trim();
  const name = nameMatch || 'Cliente';
  
  return {
    phone: phone,
    name: name || 'Cliente'
  };
};

// Função para extrair dados da mensagem JSON
const parseMessageData = (message: any) => {
  if (!message) return null;
  
  // Se a mensagem for uma string JSON, parsear
  if (typeof message === 'string') {
    try {
      message = JSON.parse(message);
    } catch {
      return null;
    }
  }
  
  // Extrair informações da estrutura da mensagem
  return {
    content: message.content || message.text || message.message || '',
    timestamp: message.timestamp || message.created_at || new Date().toISOString()
  };
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
        .order('id', { ascending: false });

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }
      
      console.log('Dados brutos do Supabase:', data);
      
      // Agrupar mensagens por número de telefone extraído do session_id
      const groupedConversations = new Map<string, {
        messages: any[];
        contact: { phone: string; name: string };
        lastMessage: any;
        lastTimestamp: string;
      }>();

      (data || []).forEach((row) => {
        const messageData = parseMessageData(row.message);
        if (!messageData) return;

        const contact = extractContactFromSessionId(row.session_id);
        const phone = contact.phone;

        if (!groupedConversations.has(phone)) {
          groupedConversations.set(phone, {
            messages: [],
            contact: contact,
            lastMessage: messageData,
            lastTimestamp: messageData.timestamp
          });
        }

        const group = groupedConversations.get(phone)!;
        group.messages.push({ ...row, messageData });

        // Atualizar última mensagem se for mais recente
        if (new Date(messageData.timestamp) > new Date(group.lastTimestamp)) {
          group.lastMessage = messageData;
          group.lastTimestamp = messageData.timestamp;
        }
      });

      // Converter grupos em conversas
      const typedConversations: ChannelConversation[] = Array.from(groupedConversations.entries())
        .map(([phone, group]) => ({
          id: phone, // Usar o telefone como ID único da conversa
          contact_name: group.contact.name,
          contact_phone: phone,
          last_message: group.lastMessage.content,
          last_message_time: group.lastTimestamp,
          status: 'unread' as const,
          assigned_to: null,
          created_at: group.lastTimestamp,
          updated_at: group.lastTimestamp
        }))
        .sort((a, b) => new Date(b.last_message_time || 0).getTime() - new Date(a.last_message_time || 0).getTime());
      
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
