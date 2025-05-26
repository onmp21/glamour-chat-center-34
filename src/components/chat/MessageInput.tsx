
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useChannelConversations } from '@/hooks/useChannelConversations';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';

interface MessageInputProps {
  channelId: string;
  conversationId?: string;
  isDarkMode: boolean;
  className?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  channelId,
  conversationId,
  isDarkMode,
  className
}) => {
  const { updateConversationStatus } = useChannelConversations(channelId);
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || sending) return;

    try {
      setSending(true);
      
      // Por enquanto, apenas simular o envio
      // Em uma implementação real, aqui você salvaria a mensagem na conversa
      console.log('Enviando mensagem:', { channelId, conversationId, content });
      
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso",
      });
      
      setContent('');
      
      // Marcar conversa como em andamento se tiver conversationId
      if (conversationId) {
        await updateConversationStatus(conversationId, 'in_progress');
      }
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={cn("border-t p-4", className)} style={{
      borderColor: isDarkMode ? '#374151' : '#e5e7eb'
    }}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Label className={cn(
          "text-sm font-medium",
          isDarkMode ? "text-gray-300" : "text-gray-700"
        )}>
          Nova mensagem
        </Label>

        <div className="flex space-x-2">
          <Textarea
            placeholder="Digite sua mensagem..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="flex-1 min-h-[60px] resize-none"
            style={{
              backgroundColor: isDarkMode ? '#374151' : '#ffffff',
              borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
              color: isDarkMode ? '#ffffff' : '#111827'
            }}
          />
          <Button
            type="submit"
            disabled={!content.trim() || sending}
            className="px-3"
            style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send size={16} />
            )}
          </Button>
        </div>

        <p className={cn(
          "text-xs",
          isDarkMode ? "text-gray-500" : "text-gray-400"
        )}>
          Pressione Enter para enviar, Shift+Enter para nova linha
        </p>
      </form>
    </div>
  );
};
