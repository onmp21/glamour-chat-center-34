
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
import { useToast } from '@/hooks/use-toast';
import { ConversationsList } from './ConversationsList';
import { ChatHeader } from './ChatHeader';
import { ChatArea } from './ChatArea';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface WhatsAppChatProps {
  isDarkMode: boolean;
  channelId: string;
  onToggleSidebar?: () => void;
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ 
  isDarkMode, 
  channelId, 
  onToggleSidebar 
}) => {
  const { 
    conversations, 
    loading: conversationsLoading, 
    updateConversationStatus, 
    refreshConversations 
  } = useChannelConversationsRefactored(channelId);
  
  // Estado único por canal para evitar conflitos e loops infinitos
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { toast } = useToast();

  // Resetar conversa selecionada quando mudar de canal (sem dependência problemática)
  useEffect(() => {
    console.log(`🔄 Channel changed to: ${channelId}, resetting selected conversation`);
    setSelectedConversationId(null);
  }, [channelId]);

  const handleConversationSelect = useCallback(async (conversationId: string) => {
    console.log(`📱 Selecting conversation: ${conversationId}`);
    setSelectedConversationId(conversationId);
    
    // Auto-marcar como lido APENAS quando abrir a conversa no chat
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation && conversation.status === 'unread') {
      console.log(`📖 Marking conversation ${conversationId} as read`);
      await updateConversationStatus(conversationId, 'in_progress');
    }
  }, [conversations, updateConversationStatus]);

  const selectedConv = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="flex h-screen w-full relative">
      {/* Botão de Menu - fixo no canto superior esquerdo */}
      {onToggleSidebar && (
        <Button
          onClick={onToggleSidebar}
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-4 left-4 z-50 p-2 rounded-lg",
            isDarkMode 
              ? "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700" 
              : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 shadow-sm"
          )}
        >
          <Menu size={20} />
        </Button>
      )}

      <div className={cn(
        "flex h-screen w-full border-0 overflow-hidden",
        isDarkMode ? "bg-zinc-950" : "bg-white"
      )}>
        {/* Lista de Conversas */}
        <div className={cn(
          "w-80 flex-shrink-0 border-r",
          isDarkMode ? "border-zinc-800" : "border-gray-200"
        )}>
          <ConversationsList
            channelId={channelId}
            activeConversation={selectedConversationId}
            onConversationSelect={handleConversationSelect}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Área Principal do Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedConv ? (
            <>
              <ChatHeader isDarkMode={isDarkMode} conversation={selectedConv} />
              <ChatArea 
                isDarkMode={isDarkMode} 
                conversation={selectedConv} 
                channelId={channelId} 
              />
              <ChatInput
                channelId={channelId}
                conversationId={selectedConversationId!}
                isDarkMode={isDarkMode}
                onMessageSent={refreshConversations}
              />
            </>
          ) : (
            <EmptyState isDarkMode={isDarkMode} />
          )}
        </div>
      </div>
    </div>
  );
};
