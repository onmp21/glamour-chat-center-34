
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Send, Paperclip, Smile, Image, FileText, Tag, MoreHorizontal } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useTags } from '@/hooks/useTags';

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
  const [showAttachments, setShowAttachments] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { tags } = useTags();

  const commonEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
    '❤️', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️'
  ];

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(newMessage + emoji);
    setShowEmojis(false);
  };

  const handleFileSelect = (type: 'image' | 'document') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.txt';
      fileInputRef.current.click();
    }
    setShowAttachments(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Arquivo selecionado:', file.name);
      // TODO: Implementar upload do arquivo
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className={cn(
      "p-4 border-t bg-white",
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    )}>
      {/* Tags selecionadas */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTags.map(tagId => {
            const tag = tags.find(t => t.id === tagId);
            return tag ? (
              <Badge 
                key={tagId} 
                variant="secondary" 
                className="text-xs"
                style={{ backgroundColor: tag.color + '20', color: tag.color }}
              >
                {tag.name}
                <button
                  onClick={() => toggleTag(tagId)}
                  className="ml-1 text-xs hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            ) : null;
          })}
        </div>
      )}

      <form onSubmit={onSendMessage} className="flex items-end space-x-2">
        {/* Botão de anexos */}
        <Popover open={showAttachments} onOpenChange={setShowAttachments}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn("flex-shrink-0", isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100")}
            >
              <Paperclip size={20} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="start">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => handleFileSelect('image')}
              >
                <Image size={16} className="text-blue-500" />
                Imagem
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => handleFileSelect('document')}
              >
                <FileText size={16} className="text-green-500" />
                Documento
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Área de input */}
        <div className="flex-1 relative">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite uma mensagem"
            className={cn(
              "rounded-full pr-24 py-3 border-0 focus:ring-2 focus:ring-blue-500",
              isDarkMode
                ? "bg-gray-700 text-white placeholder:text-gray-400"
                : "bg-gray-100 text-gray-900 placeholder:text-gray-500"
            )}
          />
          
          {/* Botões internos do input */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {/* Botão de emojis */}
            <Popover open={showEmojis} onOpenChange={setShowEmojis}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6"
                >
                  <Smile size={16} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="end">
                <div className="grid grid-cols-8 gap-1">
                  {commonEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleEmojiSelect(emoji)}
                      className="p-1 hover:bg-gray-100 rounded text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Botão de tags */}
            <Popover open={showTags} onOpenChange={setShowTags}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6"
                >
                  <Tag size={16} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Tags</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={cn(
                          "w-full text-left px-2 py-1 text-sm rounded flex items-center justify-between",
                          selectedTags.includes(tag.id)
                            ? "bg-blue-100 text-blue-800"
                            : "hover:bg-gray-100"
                        )}
                      >
                        <span>{tag.name}</span>
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Mais opções */}
            <Popover open={showMoreOptions} onOpenChange={setShowMoreOptions}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6"
                >
                  <MoreHorizontal size={16} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="end">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      console.log('Agendar mensagem');
                      setShowMoreOptions(false);
                    }}
                  >
                    Agendar mensagem
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      console.log('Mensagem rápida');
                      setShowMoreOptions(false);
                    }}
                  >
                    Mensagem rápida
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Botão de enviar */}
        <Button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="rounded-full p-3 bg-blue-500 hover:bg-blue-600 text-white border-0 flex-shrink-0"
        >
          {sending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Send size={16} />
          )}
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
      </form>
    </div>
  );
};
