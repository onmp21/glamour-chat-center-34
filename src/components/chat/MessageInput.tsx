
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useMessages } from '@/hooks/useMessages';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { cn } from '@/lib/utils';
import { Send, User, Phone } from 'lucide-react';

interface MessageInputProps {
  channelId: string;
  isDarkMode: boolean;
  className?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  channelId,
  isDarkMode,
  className
}) => {
  const { sendMessage, sending } = useMessages(channelId);
  const { logMessageAction } = useAuditLogger();
  const [content, setContent] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || sending) return;

    const customerInfo = {
      name: customerName.trim() || undefined,
      phone: customerPhone.trim() || undefined
    };

    const success = await sendMessage(content, customerInfo);
    
    if (success) {
      await logMessageAction('send', undefined, {
        channel_id: channelId,
        content_length: content.length,
        has_customer_info: !!(customerInfo.name || customerInfo.phone)
      });
      
      setContent('');
      if (!customerName && !customerPhone) {
        setCustomerName('');
        setCustomerPhone('');
      }
    }
  };

  return (
    <div className={cn("border-t p-4", className)} style={{
      borderColor: isDarkMode ? '#374151' : '#e5e7eb'
    }}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Toggle para informações do cliente */}
        <div className="flex items-center justify-between">
          <Label className={cn(
            "text-sm font-medium",
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}>
            Nova mensagem
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomerInfo(!showCustomerInfo)}
            className={cn(
              "text-xs",
              isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"
            )}
          >
            <User size={14} className="mr-1" />
            Info do cliente
          </Button>
        </div>

        {/* Informações do cliente (colapsível) */}
        {showCustomerInfo && (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="customerName" className={cn(
                "text-xs",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>
                Nome do cliente
              </Label>
              <Input
                id="customerName"
                placeholder="Nome (opcional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="text-sm"
                style={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                  color: isDarkMode ? '#ffffff' : '#111827'
                }}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="customerPhone" className={cn(
                "text-xs",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>
                Telefone
              </Label>
              <Input
                id="customerPhone"
                placeholder="(00) 00000-0000"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="text-sm"
                style={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                  color: isDarkMode ? '#ffffff' : '#111827'
                }}
              />
            </div>
          </div>
        )}

        {/* Campo de mensagem */}
        <div className="flex space-x-2">
          <Textarea
            placeholder="Digite sua mensagem..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="flex-1 min-h-[60px] resize-none"
            style={{
              backgroundColor: isDarkMode ? '#374151' : '#ffffff',
              borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
              color: isDarkMode ? '#ffffff' : '#111827'
            }}
          />
          <Button
            type="submit"
            disabled={!content.trim() || sending}
            className="px-3"
            style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send size={16} />
            )}
          </Button>
        </div>

        {/* Dica de atalho */}
        <p className={cn(
          "text-xs",
          isDarkMode ? "text-gray-500" : "text-gray-400"
        )}>
          Pressione Enter para enviar, Shift+Enter para nova linha
        </p>
      </form>
    </div>
  );
};
