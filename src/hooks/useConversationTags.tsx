
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ConversationTag {
  id: string;
  conversation_id: string;
  tag_id: string;
  created_at: string;
  tag?: {
    id: string;
    name: string;
    color: string;
  };
}

export const useConversationTags = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addTagToConversation = async (conversationId: string, tagId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('conversation_tags')
        .insert({
          conversation_id: conversationId,
          tag_id: tagId
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tag adicionada à conversa",
      });

      return true;
    } catch (error) {
      console.error('Error adding tag to conversation:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar tag",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeTagFromConversation = async (conversationId: string, tagId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('conversation_tags')
        .delete()
        .eq('conversation_id', conversationId)
        .eq('tag_id', tagId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tag removida da conversa",
      });

      return true;
    } catch (error) {
      console.error('Error removing tag from conversation:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover tag",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getConversationTags = async (conversationId: string): Promise<ConversationTag[]> => {
    try {
      const { data, error } = await supabase
        .from('conversation_tags')
        .select(`
          *,
          tag:tags(*)
        `)
        .eq('conversation_id', conversationId);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching conversation tags:', error);
      return [];
    }
  };

  return {
    loading,
    addTagToConversation,
    removeTagFromConversation,
    getConversationTags
  };
};
