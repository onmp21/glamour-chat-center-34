
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip } from 'lucide-react';
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
      
      // Restore cursor position after emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setMessage(prev => prev + emoji);
    }
  };

  const handleFileUpload = () => {
    // TODO: Implementar upload de arquivos
    console.log('File upload not implemented yet');
  };

  return (
    <div className={cn(
      "border-t p-4",
      isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
    )}>
      <div className="flex items-end space-x-2">
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
              "min-h-[44px] max-h-32 resize-none",
              isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"
            )}
            disabled={sending}
          />
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-1">
              <EnhancedEmojiPicker onEmojiSelect={handleEmojiSelect} isDarkMode={isDarkMode} />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFileUpload}
                className={cn(
                  "h-8 w-8 p-0",
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                )}
              >
                <Paperclip size={16} />
              </Button>
            </div>
            
            {isTyping && (
              <span className={cn(
                "text-xs",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                Digitando...
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || sending}
          className="bg-[#b5103c] hover:bg-[#a00f36] text-white h-11 px-4"
        >
          {sending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Send size={16} />
          )}
        </Button>
      </div>
    </div>
  );
};
