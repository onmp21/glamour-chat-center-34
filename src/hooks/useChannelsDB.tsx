
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Channel {
  id: string;
  name: string;
  type: 'general' | 'store' | 'manager' | 'admin';
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useChannelsDB = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadChannels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando canais do Supabase...');
      
      const { data, error: fetchError } = await supabase
        .from('channels')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Erro detalhado do Supabase:', fetchError);
        throw fetchError;
      }
      
      console.log('Canais carregados com sucesso:', data);
      
      const typedChannels: Channel[] = (data || []).map(channel => ({
        ...channel,
        type: channel.type as 'general' | 'store' | 'manager' | 'admin'
      }));
      
      setChannels(typedChannels);
    } catch (error) {
      console.error('Erro ao buscar canais:', error);
      setError('Erro ao carregar canais');
      setChannels([]);
      
      toast({
        title: "Erro",
        description: "Erro ao carregar canais. Verifique sua conexão.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateChannelStatus = async (channelId: string, isActive: boolean) => {
    try {
      console.log(`Atualizando canal ${channelId} para ${isActive ? 'ativo' : 'inativo'}`);
      
      const { error } = await supabase
        .from('channels')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', channelId);

      if (error) {
        console.error('Erro ao atualizar canal:', error);
        throw error;
      }

      // Atualizar estado local imediatamente
      setChannels(prev => prev.map(channel => 
        channel.id === channelId 
          ? { ...channel, is_active: isActive, updated_at: new Date().toISOString() }
          : channel
      ));

      console.log('Canal atualizado com sucesso');
      
      toast({
        title: "Sucesso",
        description: `Canal ${isActive ? 'ativado' : 'desativado'} com sucesso`,
        variant: "default"
      });
    } catch (error) {
      console.error('Erro ao atualizar canal:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar canal. Tente novamente.",
        variant: "destructive"
      });
      
      // Recarregar canais em caso de erro
      await loadChannels();
    }
  };

  const createChannel = async (name: string, type: 'general' | 'store' | 'manager' | 'admin') => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .insert({ name, type })
        .select()
        .single();

      if (error) throw error;

      await loadChannels();
      toast({
        title: "Sucesso",
        description: "Canal criado com sucesso",
      });
      return true;
    } catch (error) {
      console.error('Erro ao criar canal:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar canal",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteChannel = async (channelId: string) => {
    try {
      const { error } = await supabase
        .from('channels')
        .delete()
        .eq('id', channelId);

      if (error) throw error;

      await loadChannels();
      toast({
        title: "Sucesso",
        description: "Canal excluído com sucesso",
      });
      return true;
    } catch (error) {
      console.error('Erro ao excluir canal:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir canal",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    loadChannels();
  }, []);

  return {
    channels,
    loading,
    error,
    updateChannelStatus,
    createChannel,
    deleteChannel,
    loadChannels,
    refetch: loadChannels
  };
};
