import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Smile, Paperclip, Mic } from 'lucide-react'; // Importar novos ícones
import { cn } from '@/lib/utils';
import { useMessageSenderRefactored } from '@/hooks/useMessageSenderRefactored';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedEmojiPicker } from './input/EnhancedEmojiPicker';

interface ChatInputProps {
  channelId: string;
  conversationId: string;
  isDarkMode: boolean;
  onMessageSent?: () => void;
  // Adicionar prop para lidar com clique no anexo, se necessário
  // onAttachmentClick?: () => void; 
  // Adicionar prop para lidar com clique no microfone, se necessário
  // onMicClick?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  channelId,
  conversationId,
  isDarkMode,
  onMessageSent,
  // onAttachmentClick,
  // onMicClick
}) => {
  const [message, setMessage] = useState('');
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
      onMessageSent?.();
      // Focar no textarea após enviar pode ser útil
      textareaRef.current?.focus(); 
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
      
      // Ajustar cursor após inserção
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setMessage(prev => prev + emoji);
    }
  };

  // Placeholder para clique no anexo
  const handleAttachmentClick = () => {
    console.log("Attachment button clicked");
    // Chamar onAttachmentClick?.(); se a prop for implementada
  };

  // Placeholder para clique no microfone
  const handleMicClick = () => {
    console.log("Mic button clicked");
    // Chamar onMicClick?.(); se a prop for implementada
  };

  return (
    <div className={cn(
      "border-t p-2 sm:p-3", // Ajustar padding
      isDarkMode ? "border-zinc-800 bg-zinc-900" : "border-gray-200 bg-white"
    )}>
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Ícones à Esquerda (Emoji e Anexo) */}
        <div className="flex items-center flex-shrink-0">
          <EnhancedEmojiPicker onEmojiSelect={handleEmojiSelect} isDarkMode={isDarkMode} />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAttachmentClick}
            className={cn(
              "h-9 w-9 rounded-full",
              isDarkMode ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            )}
          >
            <Paperclip size={20} />
          </Button>
        </div>

        {/* Campo de Texto Central */}
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mensagem"
            className={cn(
              "min-h-[40px] max-h-32 resize-none rounded-xl border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-offset-0", // Estilo mais simples
              isDarkMode 
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600" 
                : "bg-gray-50 border-gray-300 focus-visible:ring-gray-400"
            )}
            disabled={sending}
            rows={1} // Começar com uma linha
          />
        </div>

        {/* Ícone à Direita (Microfone ou Enviar) */}
        <div className="flex-shrink-0">
          {message.trim() ? (
            // Mostrar botão Enviar se houver texto
            <Button
              onClick={handleSend}
              disabled={sending}
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full transition-all duration-200",
                sending
                  ? isDarkMode 
                    ? "bg-zinc-700 text-zinc-500 cursor-not-allowed" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#b5103c] hover:bg-[#a00f36] text-white"
              )}
            >
              {sending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <Send size={18} />
              )}
            </Button>
          ) : (
            // Mostrar botão Microfone se não houver texto
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMicClick}
              className={cn(
                "h-9 w-9 rounded-full",
                isDarkMode ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              )}
            >
              <Mic size={20} />
            </Button>
          )}
        </div>
      </div>
      {/* Remover dica de Shift+Enter se o layout for mais limpo */}
      {/* <p className={cn("text-xs mt-1 text-right", isDarkMode ? "text-zinc-500" : "text-gray-400")}>
        Shift+Enter para nova linha
      </p> */}
    </div>
  );
};
