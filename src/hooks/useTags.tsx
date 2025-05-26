
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Tag {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadTags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar tags",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (name: string, color: string) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert({ name, color })
        .select()
        .single();

      if (error) throw error;

      setTags(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Tag criada com sucesso",
      });
      return true;
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar tag",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateTag = async (id: string, name: string, color: string) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .update({ name, color })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTags(prev => prev.map(tag => tag.id === id ? data : tag));
      toast({
        title: "Sucesso",
        description: "Tag atualizada com sucesso",
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar tag:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar tag",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteTag = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTags(prev => prev.filter(tag => tag.id !== id));
      toast({
        title: "Sucesso",
        description: "Tag excluída com sucesso",
      });
      return true;
    } catch (error) {
      console.error('Erro ao excluir tag:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir tag",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  return {
    tags,
    loading,
    createTag,
    updateTag,
    deleteTag,
    loadTags
  };
};
