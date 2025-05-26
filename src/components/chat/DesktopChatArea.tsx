
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';
import { Send, Paperclip, Image, FileText } from 'lucide-react';
import { ContactActionsHeader } from '../ContactActionsHeader';

interface DesktopChatAreaProps {
  isDarkMode: boolean;
  activeConversation: string | null;
  conversations: any[];
  updateConversationStatus: (conversationId: string, status: string) => void;
  setActiveConversation: (conversationId: string | null) => void;
}

export const DesktopChatArea: React.FC<DesktopChatAreaProps> = ({
  isDarkMode,
  activeConversation,
  conversations,
  updateConversationStatus,
  setActiveConversation
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showFileOptions, setShowFileOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() && activeConversation) {
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
      // TODO: Implementar upload do arquivo
    }
  };

  const activeConv = conversations.find(conv => conv.id === activeConversation);

  return (
    <div className="flex-1 flex flex-col h-full">
      <Card className={cn(
        "flex-1 flex flex-col border-0 rounded-none h-full shadow-none",
        isDarkMode ? "dark-bg-secondary dark-border" : "bg-white"
      )}>
        {activeConversation ? (
          <>
            <ContactActionsHeader 
              isDarkMode={isDarkMode} 
              contactName={activeConv?.contactName}
            />
            <CardContent className="flex-1 flex flex-col p-0">
              <div className={cn(
                "flex-1 p-6 overflow-y-auto chat-messages",
                isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-50"
              )}>
                <div className="max-w-4xl mx-auto space-y-4">
                  <div className="text-center text-sm text-gray-500 mb-6">
                    Conversa iniciada hoje
                  </div>
                  <div className="flex justify-start">
                    <div className={cn(
                      "p-4 rounded-2xl shadow-sm max-w-md border",
                      isDarkMode
                        ? "bg-[#232323] border-[#2a2a2a] text-white"
                        : "bg-white border-gray-200"
                    )}>
                      <p className="text-sm leading-relaxed">
                        Gostaria de saber sobre os produtos em promoção
                      </p>
                      <span className="text-xs text-gray-400 mt-2 block">10:30</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[#b5103c] p-4 rounded-2xl shadow-sm max-w-md">
                      <p className="text-sm text-white leading-relaxed">
                        Olá! Claro, posso ajudá-la com informações sobre nossas promoções.
                      </p>
                      <span className="text-xs text-white/70 mt-2 block">10:32</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t" style={{ borderColor: isDarkMode ? "#2a2a2a" : "#e5e7eb" }}>
                <div className="max-w-4xl mx-auto flex space-x-3">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-10 w-10 p-0 rounded-full",
                        isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                      )}
                      onClick={() => setShowFileOptions(!showFileOptions)}
                    >
                      <Paperclip size={16} />
                    </Button>
                    
                    {showFileOptions && (
                      <div className={cn(
                        "absolute bottom-12 left-0 rounded-lg shadow-lg border p-2 z-10",
                        isDarkMode ? "bg-[#232323] border-[#2a2a2a]" : "bg-white border-gray-200"
                      )}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2 mb-1"
                          onClick={() => handleFileUpload('image')}
                        >
                          <Image size={16} className="text-[#b5103c]" />
                          Imagem
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2"
                          onClick={() => handleFileUpload('document')}
                        >
                          <FileText size={16} className="text-[#b5103c]" />
                          Documento
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className={cn(
                      "flex-1 rounded-full border-2",
                      isDarkMode
                        ? "dark-bg-primary dark-border text-white placeholder:text-gray-400 focus:border-[#b5103c]"
                        : "bg-white border-gray-200 focus:border-[#b5103c]"
                    )}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-[#b5103c] hover:bg-[#9d0e35] rounded-full px-6"
                  >
                    <Send size={16} />
                  </Button>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-6">💬</div>
              <h3 className={cn("text-xl font-semibold mb-2", isDarkMode ? "text-white" : "text-gray-900")}>
                Selecione uma conversa
              </h3>
              <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                Escolha uma conversa para começar a atender
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
