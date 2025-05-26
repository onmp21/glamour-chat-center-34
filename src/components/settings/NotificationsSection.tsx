
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Bell } from 'lucide-react';

interface NotificationsSectionProps {
  isDarkMode: boolean;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({ isDarkMode }) => {
  return (
    <Card className={cn(
      "border",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <CardHeader>
        <CardTitle className={cn(
          "flex items-center space-x-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <Bell size={20} />
          <span>Configurações de Notificação</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className={cn(
              "text-base font-medium",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Notificações por Email
            </Label>
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Receber notificações de novas mensagens por email
            </p>
          </div>
          <Switch />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className={cn(
              "text-base font-medium",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Notificações Push
            </Label>
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Receber notificações push no navegador
            </p>
          </div>
          <Switch />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className={cn(
              "text-base font-medium",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Sons de Notificação
            </Label>
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Reproduzir som quando receber novas mensagens
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className={cn(
              "text-base font-medium",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Resumo Diário
            </Label>
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Receber resumo diário de atividades
            </p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
};
