
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertTriangle, ShoppingCart, Headphones, HelpCircle, Star } from 'lucide-react';

interface ConversationTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onTagSelect: (tag: string) => void;
}

export const ConversationTagModal: React.FC<ConversationTagModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onTagSelect
}) => {
  const tags = [
    { id: 'urgent', label: 'Urgente', icon: AlertTriangle, color: '#ef4444' },
    { id: 'sale', label: 'Venda', icon: ShoppingCart, color: '#22c55e' },
    { id: 'support', label: 'Suporte', icon: Headphones, color: '#3b82f6' },
    { id: 'question', label: 'Dúvida', icon: HelpCircle, color: '#f59e0b' },
    { id: 'vip', label: 'VIP', icon: Star, color: '#b5103c' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-md",
        isDarkMode ? "bg-zinc-900 border-zinc-700 text-white" : "bg-white border-gray-200"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(isDarkMode ? "text-white" : "text-gray-900")}>
            Classificar Conversa
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-zinc-400" : "text-gray-600"
          )}>
            Selecione uma categoria para classificar esta conversa:
          </p>
          
          <div className="space-y-2">
            {tags.map(tag => {
              const IconComponent = tag.icon;
              return (
                <Button
                  key={tag.id}
                  variant="outline"
                  onClick={() => onTagSelect(tag.id)}
                  className={cn(
                    "w-full justify-start gap-3 h-12 border-2 transition-all hover:scale-[1.02]",
                    isDarkMode 
                      ? "border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700" 
                      : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                  )}
                  style={{
                    borderColor: tag.color + '40',
                    backgroundColor: isDarkMode ? '#18181b' : '#fafafa'
                  }}
                >
                  <div 
                    className="rounded-full p-2"
                    style={{ backgroundColor: tag.color + '20' }}
                  >
                    <IconComponent size={16} style={{ color: tag.color }} />
                  </div>
                  <span className="font-medium">{tag.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
