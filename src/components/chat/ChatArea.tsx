
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';

interface ChatAreaProps {
  isDarkMode: boolean;
  activeConversation: string | null;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  isDarkMode,
  activeConversation
}) => {
  return (
    <Card className={cn(
      "col-span-6 border-0 border-r rounded-none h-full",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <CardHeader className="pb-3">
        <CardTitle className={cn(
          "text-lg",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          {activeConversation ? 'Chat Ativo' : 'Selecione uma conversa'}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100vh-160px)] flex flex-col p-4">
        {activeConversation ? (
          <>
            <div className={cn(
              "flex-1 rounded-lg p-4 mb-4 overflow-y-auto",
              isDarkMode ? "bg-black" : "bg-gray-50"
            )}>
              <div className="space-y-4">
                <div className="text-center text-sm text-gray-500 mb-4">
                  Conversa iniciada hoje
                </div>
                
                <div className="flex justify-start">
                  <div className={cn(
                    "p-3 rounded-lg shadow-sm max-w-xs border",
                    isDarkMode
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-200"
                  )}>
                    <p className={cn(
                      "text-sm",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>
                      Gostaria de saber sobre os produtos em promoção
                    </p>
                    <span className="text-xs text-gray-400">10:30</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-villa-primary p-3 rounded-lg shadow-sm max-w-xs">
                    <p className="text-sm text-white">
                      Olá! Claro, posso ajudá-la com informações sobre nossas promoções.
                    </p>
                    <span className="text-xs text-villa-primary/70">10:32</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Digite sua mensagem..."
                className={cn(
                  "flex-1",
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    : "bg-white border-gray-200"
                )}
              />
              <Button className="bg-villa-primary hover:bg-villa-primary/90">
                <Send size={16} />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <p>Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
