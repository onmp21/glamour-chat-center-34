
import { useState, useEffect } from 'react';
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

  const getStorageKey = () => `conversation_notes_${channelId}_${conversationId}`;

  const loadNotes = () => {
    if (!channelId || !conversationId) return;
    
    try {
      setLoading(true);
      const storageKey = getStorageKey();
      const storedNotes = localStorage.getItem(storageKey);
      
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        setNotes(parsedNotes);
      }
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
      const newNote: ConversationNote = {
        id: Date.now().toString(),
        conversation_id: conversationId,
        channel_id: channelId,
        content,
        created_at: new Date().toISOString(),
        created_by: 'agent' // TODO: Get from auth context
      };

      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);

      // Save to localStorage
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
      
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
      const updatedNotes = notes.filter(note => note.id !== noteId);
      setNotes(updatedNotes);

      // Save to localStorage
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
      
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
