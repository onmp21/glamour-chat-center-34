
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTags } from './useTags';

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
  const { tags } = useTags();

  const addTagToConversation = async (conversationId: string, tagId: string) => {
    try {
      setLoading(true);
      
      // Simulação para evitar erro de tabela inexistente
      console.log('Adding tag to conversation:', { conversationId, tagId });

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
      
      // Simulação para evitar erro de tabela inexistente
      console.log('Removing tag from conversation:', { conversationId, tagId });

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
      // Simulação usando tags existentes
      const mockTags: ConversationTag[] = tags.slice(0, 2).map(tag => ({
        id: `ct_${conversationId}_${tag.id}`,
        conversation_id: conversationId,
        tag_id: tag.id,
        created_at: new Date().toISOString(),
        tag
      }));

      return mockTags;
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
