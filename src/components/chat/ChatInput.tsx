
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMessageSenderRefactored } from '@/hooks/useMessageSenderRefactored';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedEmojiPicker } from './input/EnhancedEmojiPicker';

interface ChatInputProps {
  channelId: string;
  conversationId: string;
  isDarkMode: boolean;
  onMessageSent?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  channelId,
  conversationId,
  isDarkMode,
  onMessageSent
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { sendMessage, sending } = useMessageSenderRefactored();
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!message.trim() || sending || !user) return;

    const messageData = {
      conversationId,
      channelId,
      content: message.trim(),
      sender: 'agent' as const,
      agentName: user.name
    };

    const success = await sendMessage(messageData);
    if (success) {
      setMessage('');
      setIsTyping(false);
      onMessageSent?.();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.substring(0, start) + emoji + message.substring(end);
      setMessage(newMessage);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setMessage(prev => prev + emoji);
    }
  };

  return (
    <div className={cn(
      "border-t p-4",
      isDarkMode ? "border-[#3f3f46] bg-[#09090b]" : "border-gray-200 bg-white"
    )}>
      <div className="max-w-full">
        {/* Input principal com emoji e enviar na mesma linha */}
        <div className="flex items-end gap-2">
          {/* Botão emoji à esquerda */}
          <div className="flex-shrink-0 mb-2">
            <EnhancedEmojiPicker onEmojiSelect={handleEmojiSelect} isDarkMode={isDarkMode} />
          </div>

          {/* Campo de texto */}
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className={cn(
                "min-h-[50px] max-h-32 resize-none rounded-2xl border-2 focus:ring-2 focus:ring-offset-1",
                isDarkMode 
                  ? "bg-[#18181b] border-[#3f3f46] text-[#fafafa] placeholder:text-[#a1a1aa] focus:border-[#b5103c] focus:ring-[#b5103c]/20" 
                  : "bg-white border-gray-300 focus:border-[#b5103c] focus:ring-[#b5103c]/20"
              )}
              disabled={sending}
            />
          </div>

          {/* Botão de enviar à direita */}
          <div className="flex-shrink-0 mb-2">
            <Button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className={cn(
                "h-[50px] w-[50px] rounded-full p-0 transition-all duration-200",
                !message.trim() || sending
                  ? isDarkMode 
                    ? "bg-[#27272a] text-[#71717a] cursor-not-allowed" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#b5103c] hover:bg-[#a00f36] text-white shadow-md hover:shadow-lg"
              )}
            >
              {sending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
              ) : (
                <Send size={20} />
              )}
            </Button>
          </div>
        </div>

        {/* Indicador de digitação */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex-1" />
          {isTyping && (
            <span className={cn(
              "text-xs px-3 py-1 rounded-full",
              isDarkMode ? "text-[#a1a1aa] bg-[#18181b]" : "text-gray-500 bg-gray-100"
            )}>
              Digitando...
            </span>
          )}
        </div>

        {/* Dica de uso */}
        <p className={cn(
          "text-xs mt-2 px-1",
          isDarkMode ? "text-[#71717a]" : "text-gray-400"
        )}>
          Pressione Enter para enviar, Shift+Enter para nova linha
        </p>
      </div>
    </div>
  );
};
