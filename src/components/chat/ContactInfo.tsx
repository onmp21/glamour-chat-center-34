
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Phone, Tag, FileText, ArrowRight, CheckCircle } from 'lucide-react';

interface ContactInfoProps {
  isDarkMode: boolean;
  activeConversation: string | null;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
  isDarkMode,
  activeConversation
}) => {
  return (
    <Card className={cn(
      "col-span-3 border-0 rounded-none h-full",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <CardHeader className="pb-3">
        <CardTitle className={cn(
          "text-lg flex items-center",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <Phone size={20} className="mr-2 text-gray-500" />
          Informações
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeConversation ? (
          <div className="space-y-4">
            <div>
              <h4 className={cn(
                "font-medium",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Maria Silva
              </h4>
              <p className={cn(
                "text-sm flex items-center",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>
                <Phone size={14} className="mr-1" />
                (77) 99999-1234
              </p>
            </div>
            
            <div>
              <h5 className={cn(
                "font-medium mb-2",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>
                Status
              </h5>
              <Badge className="bg-red-100 text-red-800">Não lida</Badge>
            </div>

            <div>
              <h5 className={cn(
                "font-medium mb-2 flex items-center",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>
                <Tag size={16} className="mr-1" />
                Tags
              </h5>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">promoção</Badge>
                <Badge variant="outline">produtos</Badge>
              </div>
            </div>

            <div>
              <h5 className={cn(
                "font-medium mb-2 flex items-center",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>
                <FileText size={16} className="mr-1" />
                Notas
              </h5>
              <textarea
                className={cn(
                  "w-full p-2 border rounded-md text-sm resize-none",
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    : "bg-white border-gray-200"
                )}
                placeholder="Adicionar notas sobre o cliente..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className={cn(
                  "w-full",
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300"
                )}
              >
                <ArrowRight size={16} className="mr-2" />
                Transferir Conversa
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle size={16} className="mr-2" />
                Finalizar Atendimento
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <div className="text-3xl mb-2">👤</div>
            <p className="text-sm">Selecione uma conversa para ver as informações</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
