import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';
import { MessageHistory } from './MessageHistory'; // Assuming MessageHistory handles fetching/displaying
import { ChatInput } from './ChatInput'; // Re-using the existing ChatInput
// import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored'; // May need conversation details for header

interface MobileChatViewProps {
  isDarkMode: boolean;
  mobileConversationId: string | null;
  onBack: () => void;
  channelId: string | null;
  // Add other necessary props, e.g., conversation details for header
}

export const MobileChatView: React.FC<MobileChatViewProps> = ({
  isDarkMode,
  mobileConversationId,
  onBack,
  channelId,
}) => {

  // Placeholder: Fetch conversation details if needed for the header
  // const { conversations } = useChannelConversationsRefactored(channelId || '');
  // const conversation = conversations.find(c => c.id === mobileConversationId);
  const conversationName = "Nome do Contato"; // Placeholder
  const conversationPhone = mobileConversationId || ""; // Placeholder

  if (!mobileConversationId || !channelId) {
    // Handle case where conversation or channel is not selected
    return (
      <div className={cn("flex flex-col h-full items-center justify-center p-4", isDarkMode ? "bg-zinc-900 text-zinc-400" : "bg-gray-100 text-gray-600")}>
        <p>Erro: Conversa ou canal não selecionado.</p>
        <Button variant="ghost" onClick={onBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full w-full", isDarkMode ? "bg-zinc-950" : "bg-white")}>
      {/* Header */}
      <div className={cn(
        "flex items-center p-3 border-b sticky top-0 z-10",
        isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
      )}>
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className={cn("h-5 w-5", isDarkMode ? "text-zinc-300" : "text-gray-700")} />
        </Button>
        <div className="flex-1 min-w-0">
          <h3 className={cn("font-semibold text-base truncate", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
            {conversationName} {/* Placeholder */}
          </h3>
          <p className={cn("text-xs truncate", isDarkMode ? "text-zinc-400" : "text-gray-500")}>
            {conversationPhone} {/* Placeholder */}
          </p>
        </div>
        {/* Add other header buttons if needed */}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <MessageHistory
            channelId={channelId}
            conversationId={mobileConversationId}
            isDarkMode={isDarkMode}
            className="h-full px-3 pt-3" // Adjust padding for mobile
          />
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className={cn("flex-shrink-0 border-t p-2", isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200")}>
        <ChatInput 
          channelId={channelId} 
          conversationId={mobileConversationId} 
          isDarkMode={isDarkMode} 
          // onMessageSent might be needed here too
        />
      </div>
    </div>
  );
};
