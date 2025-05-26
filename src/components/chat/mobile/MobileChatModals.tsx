
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Phone, Mail, Bell, Shield, MessageCircle, Trash2 } from 'lucide-react';

interface MobileChatModalsProps {
  isDarkMode: boolean;
  conversation: any;
  showContactDetails: boolean;
  showContactSettings: boolean;
  showMoreOptions: boolean;
  onCloseContactDetails: () => void;
  onCloseContactSettings: () => void;
  onCloseMoreOptions: () => void;
}

export const MobileChatModals: React.FC<MobileChatModalsProps> = ({
  isDarkMode,
  conversation,
  showContactDetails,
  showContactSettings,
  showMoreOptions,
  onCloseContactDetails,
  onCloseContactSettings,
  onCloseMoreOptions
}) => {
  return (
    <>
      {/* Contact Details Modal */}
      <Dialog open={showContactDetails} onOpenChange={onCloseContactDetails}>
        <DialogContent className={cn(
          "sm:max-w-md",
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

      {/* Contact Settings Modal */}
      <Dialog open={showContactSettings} onOpenChange={onCloseContactSettings}>
        <DialogContent className={cn(
          "sm:max-w-md",
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

      {/* More Options Modal */}
      <Dialog open={showMoreOptions} onOpenChange={onCloseMoreOptions}>
        <DialogContent className={cn(
          "sm:max-w-md",
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
                onCloseMoreOptions();
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
                onCloseMoreOptions();
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
