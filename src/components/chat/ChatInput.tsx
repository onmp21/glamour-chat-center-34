
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Send, Paperclip, Smile, Tag, MoreHorizontal, Image, FileText } from 'lucide-react';

interface ChatInputProps {
  isDarkMode: boolean;
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  sending: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  isDarkMode,
  newMessage,
  setNewMessage,
  onSendMessage,
  sending
}) => {
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTagOptions, setShowTagOptions] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (type: 'image' | 'document') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.txt';
      fileInputRef.current.click();
    }
    setShowFileOptions(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Arquivo selecionado:', file.name);
      // TODO: Implementar upload do arquivo
    }
  };

  const addEmoji = (emoji: string) => {
    const input = inputRef.current;
    if (input) {
      const cursorPosition = input.selectionStart || 0;
      const textBefore = newMessage.substring(0, cursorPosition);
      const textAfter = newMessage.substring(cursorPosition);
      const newText = textBefore + emoji + textAfter;
      
      setNewMessage(newText);
      
      // Reposicionar cursor após o emoji
      setTimeout(() => {
        if (input) {
          input.selectionStart = input.selectionEnd = cursorPosition + emoji.length;
          input.focus();
        }
      }, 10);
    }
    setShowEmojiPicker(false);
  };

  const addTag = (tag: string) => {
    const input = inputRef.current;
    if (input) {
      const cursorPosition = input.selectionStart || 0;
      const textBefore = newMessage.substring(0, cursorPosition);
      const textAfter = newMessage.substring(cursorPosition);
      const newText = textBefore + tag + ' ' + textAfter;
      
      setNewMessage(newText);
      
      // Reposicionar cursor após a tag
      setTimeout(() => {
        if (input) {
          input.selectionStart = input.selectionEnd = cursorPosition + tag.length + 1;
          input.focus();
        }
      }, 10);
    }
    setShowTagOptions(false);
  };

  // Fechar dropdowns quando clicar fora
  const handleDocumentClick = (e: Event) => {
    if (!(e.target as Element).closest('.dropdown-container')) {
      setShowFileOptions(false);
      setShowEmojiPicker(false);
      setShowTagOptions(false);
      setShowMoreOptions(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  return (
    <div className={cn(
      "p-4 border-t",
      isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
    )}>
      <form onSubmit={onSendMessage} className="flex items-center space-x-2">
        {/* Botão de Anexos */}
        <div className="relative dropdown-container">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9", isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-100")}
            onClick={(e) => {
              e.stopPropagation();
              setShowFileOptions(!showFileOptions);
              setShowEmojiPicker(false);
              setShowTagOptions(false);
              setShowMoreOptions(false);
            }}
          >
            <Paperclip size={18} />
          </Button>
          
          {showFileOptions && (
            <div className={cn(
              "absolute bottom-12 left-0 rounded-lg shadow-lg border p-2 z-50 min-w-[140px]",
              isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
            )}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 mb-1"
                onClick={() => handleFileUpload('image')}
              >
                <Image size={16} className={isDarkMode ? "text-zinc-400" : "text-gray-600"} />
                <span className={isDarkMode ? "text-zinc-200" : "text-gray-700"}>Imagem</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => handleFileUpload('document')}
              >
                <FileText size={16} className={isDarkMode ? "text-zinc-400" : "text-gray-600"} />
                <span className={isDarkMode ? "text-zinc-200" : "text-gray-700"}>Documento</span>
              </Button>
            </div>
          )}
        </div>

        {/* Botão de Emojis */}
        <div className="relative dropdown-container">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9", isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-100")}
            onClick={(e) => {
              e.stopPropagation();
              setShowEmojiPicker(!showEmojiPicker);
              setShowFileOptions(false);
              setShowTagOptions(false);
              setShowMoreOptions(false);
            }}
          >
            <Smile size={18} />
          </Button>
          
          {showEmojiPicker && (
            <div className={cn(
              "absolute bottom-12 left-0 rounded-lg shadow-lg border p-3 z-50 grid grid-cols-5 gap-1 max-w-[200px]",
              isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
            )}>
              {['😀', '😂', '😍', '😢', '😡', '👍', '👎', '❤️', '🎉', '🔥', '😊', '😎', '🤔', '😅', '🙌', '💪', '🎯', '✨', '🚀', '💯'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={cn(
                    "p-2 rounded text-lg transition-colors hover:scale-110",
                    isDarkMode ? "hover:bg-zinc-700" : "hover:bg-gray-100"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    addEmoji(emoji);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botão de Tags */}
        <div className="relative dropdown-container">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9", isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-100")}
            onClick={(e) => {
              e.stopPropagation();
              setShowTagOptions(!showTagOptions);
              setShowFileOptions(false);
              setShowEmojiPicker(false);
              setShowMoreOptions(false);
            }}
          >
            <Tag size={18} />
          </Button>
          
          {showTagOptions && (
            <div className={cn(
              "absolute bottom-12 left-0 rounded-lg shadow-lg border p-2 z-50 min-w-[120px]",
              isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
            )}>
              {['#urgente', '#venda', '#suporte', '#dúvida'].map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start mb-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    addTag(tag);
                  }}
                >
                  <span className={isDarkMode ? "text-zinc-200" : "text-gray-700"}>{tag}</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Campo de texto */}
        <Input
          ref={inputRef}
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSendMessage(e);
            }
          }}
          className={cn(
            "flex-1",
            isDarkMode 
              ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-[#b5103c]"
              : "bg-gray-50 border-gray-200 focus:border-[#b5103c]"
          )}
        />

        {/* Botão de Mais Opções */}
        <div className="relative dropdown-container">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9", isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-100")}
            onClick={(e) => {
              e.stopPropagation();
              setShowMoreOptions(!showMoreOptions);
              setShowFileOptions(false);
              setShowEmojiPicker(false);
              setShowTagOptions(false);
            }}
          >
            <MoreHorizontal size={18} />
          </Button>
          
          {showMoreOptions && (
            <div className={cn(
              "absolute bottom-12 right-0 rounded-lg shadow-lg border p-2 z-50 min-w-[150px]",
              isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
            )}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start mb-1"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Abrir configurações');
                  setShowMoreOptions(false);
                }}
              >
                <span className={isDarkMode ? "text-zinc-200" : "text-gray-700"}>Configurações</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Arquivar conversa');
                  setShowMoreOptions(false);
                }}
              >
                <span className={isDarkMode ? "text-zinc-200" : "text-gray-700"}>Arquivar</span>
              </Button>
            </div>
          )}
        </div>

        {/* Botão de Enviar - ÚNICA cor vermelha permitida */}
        <Button 
          type="submit"
          disabled={!newMessage.trim() || sending}
          className={cn(
            "px-4 transition-all duration-200",
            !newMessage.trim() || sending
              ? isDarkMode 
                ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#b5103c] hover:bg-[#9d0e34] text-white"
          )}
        >
          {sending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Send size={16} className="mr-2" />
          )}
          Enviar
        </Button>
        
        {/* Input de arquivo oculto */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      </form>
    </div>
  );
};
