
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
  const { toast } = useToast();

  const fetchChannels = async () => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setChannels(data || []);
    } catch (error) {
      console.error('Erro ao buscar canais:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar canais",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateChannelStatus = async (channelId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('channels')
        .update({ is_active: isActive })
        .eq('id', channelId);

      if (error) throw error;

      // Atualizar estado local
      setChannels(prev => 
        prev.map(channel => 
          channel.id === channelId 
            ? { ...channel, is_active: isActive }
            : channel
        )
      );

      toast({
        title: "Sucesso",
        description: `Canal ${isActive ? 'ativado' : 'desativado'} com sucesso`,
        variant: "default"
      });
    } catch (error) {
      console.error('Erro ao atualizar canal:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar canal",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  return {
    channels,
    loading,
    updateChannelStatus,
    refetch: fetchChannels
  };
};
