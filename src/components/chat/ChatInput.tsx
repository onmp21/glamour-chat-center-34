
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMessageSenderExtended } from '@/hooks/useMessageSenderExtended';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedEmojiPicker } from './input/EnhancedEmojiPicker';
import { FilePreview } from './input/FilePreview';
import { AudioRecorder } from './input/AudioRecorder';
import { FileService } from '@/services/FileService';
import { FileData } from '@/types/messageTypes';

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
  onMessageSent,
}) => {
  const [message, setMessage] = useState('');
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { sendMessage, sending } = useMessageSenderExtended();
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if ((!message.trim() && !fileData) || sending || !user) return;

    const messageData = {
      conversationId,
      channelId,
      content: message.trim(),
      sender: 'agent' as const,
      agentName: user.name,
      messageType: fileData ? FileService.getFileType(fileData.mimeType) as any : 'text' as any,
      fileData: fileData || undefined
    };

    const success = await sendMessage(messageData);
    if (success) {
      setMessage('');
      setFileData(null);
      onMessageSent?.();
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
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setMessage(prev => prev + emoji);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!FileService.isValidFileType(file)) {
      alert('Tipo de arquivo não suportado');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('Arquivo muito grande. Limite de 10MB.');
      return;
    }

    try {
      const base64 = await FileService.convertToBase64(file);
      setFileData({
        base64,
        fileName: file.name,
        mimeType: file.type,
        size: file.size
      });
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Erro ao processar arquivo');
    }

    // Reset input
    event.target.value = '';
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleAudioReady = (audioData: FileData) => {
    setFileData(audioData);
    setIsRecording(false);
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
  };

  if (isRecording) {
    return (
      <div className={cn(
        "border-t p-2 sm:p-3",
        isDarkMode ? "border-zinc-800 bg-zinc-900" : "border-gray-200 bg-white"
      )}>
        <AudioRecorder
          isDarkMode={isDarkMode}
          onAudioReady={handleAudioReady}
          onCancel={handleCancelRecording}
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "border-t p-2 sm:p-3",
      isDarkMode ? "border-zinc-800 bg-zinc-900" : "border-gray-200 bg-white"
    )}>
      {/* File preview */}
      {fileData && (
        <div className="mb-3">
          <FilePreview
            fileData={fileData}
            isDarkMode={isDarkMode}
            onRemove={() => setFileData(null)}
          />
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Left icons */}
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
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp,.mp3,.wav,.ogg,.webm,.mp4"
          />
        </div>

        {/* Text area */}
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mensagem"
            className={cn(
              "min-h-[40px] max-h-32 resize-none rounded-xl border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-offset-0",
              isDarkMode 
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600" 
                : "bg-gray-50 border-gray-300 focus-visible:ring-gray-400"
            )}
            disabled={sending}
            rows={1}
          />
        </div>

        {/* Right icon */}
        <div className="flex-shrink-0">
          {message.trim() || fileData ? (
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRecording(true)}
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
    </div>
  );
};
