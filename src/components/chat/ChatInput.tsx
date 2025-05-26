
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
    setNewMessage(newMessage + emoji);
    setShowEmojiPicker(false);
  };

  const addTag = (tag: string) => {
    setNewMessage(newMessage + tag);
    setShowTagOptions(false);
  };

  return (
    <div className={cn(
      "p-4 border-t",
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    )}>
      <form onSubmit={onSendMessage} className="flex items-center space-x-2">
        {/* Botão de Anexos */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9", isDarkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")}
            onClick={() => setShowFileOptions(!showFileOptions)}
          >
            <Paperclip size={18} />
          </Button>
          
          {showFileOptions && (
            <div className={cn(
              "absolute bottom-12 left-0 rounded-lg shadow-lg border p-2 z-50 min-w-[140px]",
              isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
            )}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 mb-1"
                onClick={() => handleFileUpload('image')}
              >
                <Image size={16} className="text-blue-500" />
                <span className={isDarkMode ? "text-gray-200" : "text-gray-700"}>Imagem</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => handleFileUpload('document')}
              >
                <FileText size={16} className="text-blue-500" />
                <span className={isDarkMode ? "text-gray-200" : "text-gray-700"}>Documento</span>
              </Button>
            </div>
          )}
        </div>

        {/* Botão de Emojis */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9", isDarkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={18} />
          </Button>
          
          {showEmojiPicker && (
            <div className={cn(
              "absolute bottom-12 left-0 rounded-lg shadow-lg border p-3 z-50 grid grid-cols-5 gap-1",
              isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
            )}>
              {['😀', '😂', '😍', '😢', '😡', '👍', '👎', '❤️', '🎉', '🔥'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="p-1 hover:bg-gray-100 rounded text-lg"
                  onClick={() => addEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botão de Tags */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9", isDarkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")}
            onClick={() => setShowTagOptions(!showTagOptions)}
          >
            <Tag size={18} />
          </Button>
          
          {showTagOptions && (
            <div className={cn(
              "absolute bottom-12 left-0 rounded-lg shadow-lg border p-2 z-50 min-w-[120px]",
              isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
            )}>
              {['#urgente', '#venda', '#suporte', '#dúvida'].map((tag) => (
                <Button
                  key={tag}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start mb-1"
                  onClick={() => addTag(tag + ' ')}
                >
                  <span className={isDarkMode ? "text-gray-200" : "text-gray-700"}>{tag}</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Campo de texto */}
        <Input
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className={cn(
            "flex-1",
            isDarkMode 
              ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
              : "bg-gray-50 border-gray-200 focus:border-blue-500"
          )}
        />

        {/* Botão de Mais Opções */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9", isDarkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")}
            onClick={() => setShowMoreOptions(!showMoreOptions)}
          >
            <MoreHorizontal size={18} />
          </Button>
          
          {showMoreOptions && (
            <div className={cn(
              "absolute bottom-12 right-0 rounded-lg shadow-lg border p-2 z-50 min-w-[150px]",
              isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
            )}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start mb-1"
                onClick={() => {
                  console.log('Abrir configurações');
                  setShowMoreOptions(false);
                }}
              >
                <span className={isDarkMode ? "text-gray-200" : "text-gray-700"}>Configurações</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  console.log('Arquivar conversa');
                  setShowMoreOptions(false);
                }}
              >
                <span className={isDarkMode ? "text-gray-200" : "text-gray-700"}>Arquivar</span>
              </Button>
            </div>
          )}
        </div>

        {/* Botão de Enviar */}
        <Button 
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4"
        >
          <Send size={16} className="mr-2" />
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
