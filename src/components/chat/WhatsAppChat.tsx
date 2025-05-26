
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useChannelConversations } from '@/hooks/useChannelConversations';
import { useToast } from '@/hooks/use-toast';
import { useMessageSender } from '@/hooks/useMessageSender';
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
  const { sendMessage, sending } = useMessageSender();
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    
    try {
      const success = await sendMessage({
        conversationId: selectedConversation,
        channelId,
        content: newMessage.trim(),
        sender: 'agent',
        agentName: 'Atendente'
      });
      
      if (success) {
        setNewMessage('');
        await updateConversationStatus(selectedConversation, 'in_progress');
      }
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem",
        variant: "destructive"
      });
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className={cn(
      "flex h-screen w-full border-0 overflow-hidden",
      isDarkMode ? "bg-zinc-950" : "bg-white"
    )}>
      {/* Lista de Conversas - Monocromático */}
      <div className={cn(
        "w-80 flex-shrink-0 border-r",
        isDarkMode ? "border-zinc-800" : "border-gray-200"
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
      </div>

      {/* Área Principal do Chat - Monocromático */}
      <div className="flex-1 flex flex-col min-w-0">
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
