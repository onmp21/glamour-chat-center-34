
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ConversationTag {
  id: string;
  name: string;
  color: string;
  conversation_id: string;
  channel_id: string;
  created_at: string;
}

export const useConversationTagsEnhanced = (channelId: string, conversationId: string) => {
  const [tags, setTags] = useState<ConversationTag[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const predefinedTags = [
    { name: 'Urgente', color: '#ef4444' },
    { name: 'Importante', color: '#f59e0b' },
    { name: 'Aguardando', color: '#3b82f6' },
    { name: 'Resolvido', color: '#10b981' },
    { name: 'Follow-up', color: '#8b5cf6' },
    { name: 'Cliente VIP', color: '#ec4899' }
  ];

  const loadTags = async () => {
    if (!channelId || !conversationId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversation_tags')
        .select('*')
        .eq('channel_id', channelId)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error loading tags:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar tags",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTag = async (name: string, color: string) => {
    try {
      const { data, error } = await supabase
        .from('conversation_tags')
        .insert({
          conversation_id: conversationId,
          channel_id: channelId,
          name,
          color
        })
        .select()
        .single();

      if (error) throw error;
      
      setTags(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Tag adicionada com sucesso"
      });
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar tag",
        variant: "destructive"
      });
    }
  };

  const removeTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from('conversation_tags')
        .delete()
        .eq('id', tagId);

      if (error) throw error;
      
      setTags(prev => prev.filter(tag => tag.id !== tagId));
      toast({
        title: "Sucesso",
        description: "Tag removida com sucesso"
      });
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover tag",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadTags();
  }, [channelId, conversationId]);

  return {
    tags,
    loading,
    predefinedTags,
    addTag,
    removeTag,
    refreshTags: loadTags
  };
};
