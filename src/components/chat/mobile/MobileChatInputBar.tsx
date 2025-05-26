
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Send, Paperclip, Image, FileText } from 'lucide-react';

interface MobileChatInputBarProps {
  isDarkMode: boolean;
  onSendMessage: (message: string) => void;
}

export const MobileChatInputBar: React.FC<MobileChatInputBarProps> = ({
  isDarkMode,
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showFileOptions, setShowFileOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

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
      console.log('File selected:', file.name);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 border-t p-3" style={{ 
      borderColor: isDarkMode ? "#404040" : "#e5e7eb",
      backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
      paddingBottom: '12px'
    }}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "h-12 w-12 rounded-full flex-shrink-0",
              isDarkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"
            )}
            onClick={() => setShowFileOptions(!showFileOptions)}
          >
            <Paperclip size={20} />
          </Button>
          
          {showFileOptions && (
            <div className={cn(
              "absolute bottom-16 left-0 rounded-lg shadow-lg border p-2 z-50 min-w-[140px]",
              isDarkMode ? "bg-[#1a1a1a] border-[#404040]" : "bg-white border-gray-200"
            )}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 mb-1"
                onClick={() => handleFileUpload('image')}
              >
                <Image size={14} className="text-[#b5103c]" />
                <span className={isDarkMode ? "text-gray-200" : "text-gray-700"}>Imagem</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => handleFileUpload('document')}
              >
                <FileText size={14} className="text-[#b5103c]" />
                <span className={isDarkMode ? "text-gray-200" : "text-gray-700"}>Documento</span>
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex-1 relative">
          <Input
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className={cn(
              "h-12 pr-14 rounded-full border-2 text-base",
              isDarkMode 
                ? "bg-[#2a2a2a] border-[#404040] text-white placeholder:text-gray-400 focus:border-[#b5103c]" 
                : "bg-white border-gray-300 focus:border-[#b5103c]"
            )}
            style={{ paddingLeft: '16px', paddingRight: '56px' }}
          />
          
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="absolute right-1 top-1 h-10 w-10 rounded-full bg-[#b5103c] text-white hover:bg-[#9d0e34] disabled:bg-gray-400 disabled:hover:bg-gray-400 flex-shrink-0" 
            size="icon"
          >
            <Send size={18} />
          </Button>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};
