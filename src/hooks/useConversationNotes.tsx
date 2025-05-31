
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ConversationNote {
  id: string;
  conversation_id: string;
  channel_id: string;
  content: string;
  created_at: string;
  created_by: string;
}

export const useConversationNotes = (channelId: string, conversationId: string) => {
  const [notes, setNotes] = useState<ConversationNote[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadNotes = async () => {
    if (!channelId || !conversationId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversation_notes')
        .select('*')
        .eq('channel_id', channelId)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar notas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (content: string) => {
    try {
      const { data, error } = await supabase
        .from('conversation_notes')
        .insert({
          conversation_id: conversationId,
          channel_id: channelId,
          content,
          created_by: 'agent' // TODO: Get from auth context
        })
        .select()
        .single();

      if (error) throw error;
      
      setNotes(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Nota adicionada com sucesso"
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar nota",
        variant: "destructive"
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('conversation_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      
      setNotes(prev => prev.filter(note => note.id !== noteId));
      toast({
        title: "Sucesso",
        description: "Nota removida com sucesso"
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover nota",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadNotes();
  }, [channelId, conversationId]);

  return {
    notes,
    loading,
    addNote,
    deleteNote,
    refreshNotes: loadNotes
  };
};
