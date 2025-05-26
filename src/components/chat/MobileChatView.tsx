import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';
import { ArrowLeft, Send, MoreVertical, User, Settings, Phone, Mail, Bell, Shield, MessageCircle, Trash2, Paperclip, Image, FileText } from 'lucide-react';

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
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showContactSettings, setShowContactSettings] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const conversation = mobileConversations.find(conv => conv.id === mobileConversationId);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center px-2 py-3 border-b gap-2" 
             style={{ borderColor: isDarkMode ? "#404040" : "#ececec", backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" }}>
          <Button size="icon" variant="ghost" className="mr-2" onClick={onBack}>
            <ArrowLeft size={22} className={isDarkMode ? "text-gray-200" : "text-gray-700"} />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-1">
              <span className={cn("font-semibold text-base", isDarkMode ? "text-white" : "text-gray-900")}>
                {conversation?.contactName || 'Conversa'}
              </span>
              <div className={cn("text-xs", isDarkMode ? "text-gray-200" : "text-gray-500")}>
                Online
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", isDarkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")}
              onClick={() => setShowContactDetails(true)}
            >
              <User size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", isDarkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")}
              onClick={() => setShowContactSettings(true)}
            >
              <Settings size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", isDarkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")}
              onClick={() => setShowMoreOptions(true)}
            >
              <MoreVertical size={18} />
            </Button>
          </div>
        </div>
        
        <div className={cn("flex-1 overflow-y-auto chat-messages", isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-50")}>
          <div className="p-4 space-y-4">
            <div className={cn("text-center text-xs mb-2", isDarkMode ? "text-gray-200" : "text-gray-400")}>
              Conversa iniciada hoje
            </div>
            <div className="flex justify-start">
              <div className={cn(
                "p-3 rounded-lg shadow max-w-[80%]",
                isDarkMode ? "bg-[#1a1a1a] text-white border border-[#404040]" : "bg-white text-gray-900"
              )}>
                <span className="text-sm">Gostaria de saber sobre os produtos em promoção</span>
                <div className={cn("text-xs mt-1", isDarkMode ? "text-gray-200" : "text-gray-400")}>10:30</div>
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
        
        {/* Chat Input Bar - Fixed at bottom */}
        <div className={cn("border-t bg-inherit")}
             style={{ 
               borderColor: isDarkMode ? "#404040" : "#ececec",
               backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff"
             }}>
          <form className="flex items-center gap-2 px-3 py-3"
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}>
            
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", isDarkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")}
                onClick={() => setShowFileOptions(!showFileOptions)}
              >
                <Paperclip size={16} />
              </Button>
              
              {showFileOptions && (
                <div className={cn(
                  "absolute bottom-12 left-0 rounded-lg shadow-lg border p-2 z-50 min-w-[120px]",
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
            
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              className={cn(
                "flex-1 rounded-full border-2",
                isDarkMode 
                  ? "bg-[#0f0f0f] border-[#404040] text-white placeholder:text-gray-400 focus:border-[#b5103c]" 
                  : "bg-gray-50 border-gray-200 focus:border-[#b5103c]"
              )}
            />
            <Button 
              className="bg-[#b5103c] text-white hover:bg-[#9d0e34] rounded-full w-10 h-10 p-0" 
              type="submit"
              disabled={!newMessage.trim()}
            >
              <Send size={18} />
            </Button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
          </form>
        </div>
      </div>

      {/* Contact Details Modal - Centered */}
      <Dialog open={showContactDetails} onOpenChange={setShowContactDetails}>
        <DialogContent className={cn(
          "sm:max-w-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50",
          isDarkMode ? "bg-[#1a1a1a] border-[#404040] text-white" : "bg-white border-gray-200"
        )}>
          <DialogHeader>
            <DialogTitle className={cn(isDarkMode ? "text-white" : "text-gray-900")}>
              Dados do Contato
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <h3 className={cn("font-semibold text-lg", isDarkMode ? "text-white" : "text-gray-900")}>
                {conversation?.contactName || 'Nome do Contato'}
              </h3>
              <p className={cn("text-sm", isDarkMode ? "text-gray-200" : "text-gray-500")}>
                Online agora
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f3f4f6" }}>
                <Phone size={16} className="text-[#b5103c]" />
                <div>
                  <p className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                    Telefone
                  </p>
                  <p className={cn("text-sm", isDarkMode ? "text-gray-200" : "text-gray-500")}>
                    {conversation?.contactNumber || '(77) 99999-1234'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f3f4f6" }}>
                <Mail size={16} className="text-[#b5103c]" />
                <div>
                  <p className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                    Email
                  </p>
                  <p className={cn("text-sm", isDarkMode ? "text-gray-200" : "text-gray-500")}>
                    contato@exemplo.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Settings Modal - Centered */}
      <Dialog open={showContactSettings} onOpenChange={setShowContactSettings}>
        <DialogContent className={cn(
          "sm:max-w-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50",
          isDarkMode ? "bg-[#1a1a1a] border-[#404040] text-white" : "bg-white border-gray-200"
        )}>
          <DialogHeader>
            <DialogTitle className={cn(isDarkMode ? "text-white" : "text-gray-900")}>
              Configurações do Contato
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f3f4f6" }}>
                <div className="flex items-center gap-3">
                  <Bell size={16} className="text-[#b5103c]" />
                  <div>
                    <p className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                      Notificações
                    </p>
                    <p className={cn("text-xs", isDarkMode ? "text-gray-200" : "text-gray-500")}>
                      Receber notificações
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" style={{
                  borderColor: isDarkMode ? '#404040' : '#d1d5db',
                  color: isDarkMode ? '#ffffff' : '#374151'
                }}>
                  Ativado
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f3f4f6" }}>
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-[#b5103c]" />
                  <div>
                    <p className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                      Bloquear Contato
                    </p>
                    <p className={cn("text-xs", isDarkMode ? "text-gray-200" : "text-gray-500")}>
                      Impedir mensagens
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" style={{
                  borderColor: isDarkMode ? '#404040' : '#d1d5db',
                  color: isDarkMode ? '#ffffff' : '#374151'
                }}>
                  Bloquear
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* More Options Modal - Centered */}
      <Dialog open={showMoreOptions} onOpenChange={setShowMoreOptions}>
        <DialogContent className={cn(
          "sm:max-w-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50",
          isDarkMode ? "bg-[#1a1a1a] border-[#404040] text-white" : "bg-white border-gray-200"
        )}>
          <DialogHeader>
            <DialogTitle className={cn(isDarkMode ? "text-white" : "text-gray-900")}>
              Mais Opções
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                console.log('Exportar conversa');
                setShowMoreOptions(false);
              }}
            >
              <MessageCircle size={16} className="text-[#b5103c]" />
              <span className={isDarkMode ? "text-gray-200" : "text-gray-700"}>Exportar Conversa</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 h-12 text-red-500 hover:text-red-600"
              onClick={() => {
                console.log('Excluir conversa');
                setShowMoreOptions(false);
              }}
            >
              <Trash2 size={16} />
              <span>Excluir Conversa</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
