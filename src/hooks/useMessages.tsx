
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  channel_id: string;
  user_id: string | null;
  content: string;
  message_type: 'sent' | 'received';
  sender_name: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  created_at: string;
  updated_at: string;
}

export const useMessages = (channelId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadMessages = async () => {
    if (!channelId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar mensagens:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar mensagens",
          variant: "destructive"
        });
        return;
      }

      setMessages(data || []);
    } catch (err) {
      console.error('Erro inesperado ao carregar mensagens:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, customerInfo?: { name?: string; phone?: string }) => {
    if (!user || !content.trim()) return false;

    try {
      setSending(true);
      const messageData = {
        channel_id: channelId,
        user_id: user.id,
        content: content.trim(),
        message_type: 'sent' as const,
        sender_name: user.name,
        customer_name: customerInfo?.name || null,
        customer_phone: customerInfo?.phone || null
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) {
        console.error('Erro ao enviar mensagem:', error);
        toast({
          title: "Erro",
          description: "Erro ao enviar mensagem",
          variant: "destructive"
        });
        return false;
      }

      // Adicionar mensagem à lista local
      setMessages(prev => [...prev, data]);
      return true;
    } catch (err) {
      console.error('Erro inesperado ao enviar mensagem:', err);
      return false;
    } finally {
      setSending(false);
    }
  };

  const receiveMessage = async (content: string, senderName: string, customerInfo?: { name?: string; phone?: string }) => {
    try {
      const messageData = {
        channel_id: channelId,
        user_id: null, // Mensagem recebida não tem user_id
        content: content.trim(),
        message_type: 'received' as const,
        sender_name: senderName,
        customer_name: customerInfo?.name || null,
        customer_phone: customerInfo?.phone || null
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) {
        console.error('Erro ao receber mensagem:', error);
        return false;
      }

      // Adicionar mensagem à lista local
      setMessages(prev => [...prev, data]);
      return true;
    } catch (err) {
      console.error('Erro inesperado ao receber mensagem:', err);
      return false;
    }
  };

  useEffect(() => {
    loadMessages();
  }, [channelId]);

  // Configurar realtime para novas mensagens
  useEffect(() => {
    if (!channelId) return;

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => {
            // Evitar duplicatas
            if (prev.some(msg => msg.id === newMessage.id)) {
              return prev;
            }
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId]);

  return {
    messages,
    loading,
    sending,
    sendMessage,
    receiveMessage,
    loadMessages
  };
};
