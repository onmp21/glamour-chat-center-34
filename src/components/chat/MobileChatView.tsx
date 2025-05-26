
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';
import { ArrowLeft, Send } from 'lucide-react';

interface MobileChatViewProps {
  isDarkMode: boolean;
  mobileConversationId: string | null;
  mobileConversations: any[];
  onBack: () => void;
}

export const MobileChatView: React.FC<MobileChatViewProps> = ({
  isDarkMode,
  mobileConversationId,
  mobileConversations,
  onBack
}) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() && mobileConversationId) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-messages');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-2 py-3 border-b gap-2" 
           style={{ borderColor: isDarkMode ? "#2a2a2a" : "#ececec" }}>
        <Button size="icon" variant="ghost" className="mr-2" onClick={onBack}>
          <ArrowLeft size={22} />
        </Button>
        <div className="flex-1">
          <span className={cn("font-semibold text-base", isDarkMode ? "text-white" : "text-gray-900")}>
            {mobileConversations.find(conv => conv.id === mobileConversationId)?.contactName || 'Conversa'}
          </span>
          <div className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            Online
          </div>
        </div>
      </div>
      <div className={cn("flex-1 overflow-y-auto chat-messages", isDarkMode ? "bg-[#181818]" : "bg-gray-50")}>
        <div className="p-4 space-y-4">
          <div className="text-center text-xs text-gray-400 mb-2">
            Conversa iniciada hoje
          </div>
          <div className="flex justify-start">
            <div className={cn(
              "p-3 rounded-lg shadow max-w-[80%]",
              isDarkMode ? "bg-[#26272b] text-white" : "bg-white text-gray-900"
            )}>
              <span className="text-sm">Gostaria de saber sobre os produtos em promoção</span>
              <div className="text-xs text-gray-400 mt-1">10:30</div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-[#b5103c] p-3 rounded-lg shadow max-w-[80%]">
              <span className="text-sm text-white">Olá! Claro, posso ajudá-la com informações sobre nossas promoções.</span>
              <div className="text-xs text-white/70 mt-1">10:32</div>
            </div>
          </div>
        </div>
      </div>
      <form className="flex items-center gap-2 px-3 py-3 border-t bg-white dark:bg-[#232323]"
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{ borderColor: isDarkMode ? "#2a2a2a" : "#ececec" }}>
        <Input
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className={cn(
            "flex-1 rounded-full",
            isDarkMode ? "bg-[#181818] border-[#2a2a2a] text-white placeholder:text-gray-400" : "bg-gray-50 border-gray-200"
          )}
        />
        <Button 
          className="bg-[#b5103c] text-white hover:bg-primary/90 rounded-full w-10 h-10 p-0" 
          type="submit"
          disabled={!newMessage.trim()}
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};
