
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useChannelConversations } from '@/hooks/useChannelConversations';
import { useToast } from '@/hooks/use-toast';
import { ConversationsList } from './ConversationsList';
import { ChatHeader } from './ChatHeader';
import { ChatArea } from './ChatArea';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';

interface WhatsAppChatProps {
  isDarkMode: boolean;
  channelId: string;
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ isDarkMode, channelId }) => {
  const { conversations, loading: conversationsLoading, updateConversationStatus } = useChannelConversations(channelId);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sending) return;
    
    try {
      setSending(true);
      
      console.log('Enviando mensagem:', { channelId, conversationId: selectedConversation, content: newMessage });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso",
      });
      
      setNewMessage('');
      
      await updateConversationStatus(selectedConversation, 'in_progress');
      
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

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className={cn(
      "flex h-full max-h-screen border rounded-lg overflow-hidden",
      isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
    )}>
      <ConversationsList
        isDarkMode={isDarkMode}
        conversations={conversations}
        loading={conversationsLoading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedConversation={selectedConversation}
        onConversationSelect={setSelectedConversation}
      />

      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            <ChatHeader isDarkMode={isDarkMode} conversation={selectedConv} />
            <ChatArea isDarkMode={isDarkMode} conversation={selectedConv} />
            <ChatInput
              isDarkMode={isDarkMode}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={handleSendMessage}
              sending={sending}
            />
          </>
        ) : (
          <EmptyState isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  );
};
