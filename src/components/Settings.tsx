
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';

interface SettingsProps {
  isDarkMode: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode }) => {
  const { user } = useAuth();

  return (
    <div className={cn(
      "p-6 space-y-6",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div>
        <h1 className={cn(
          "text-3xl font-bold flex items-center space-x-3",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <SettingsIcon size={32} />
          <span>Configurações</span>
        </h1>
        <p className={cn(
          "mt-1",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}>
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perfil do Usuário */}
        <Card className={cn(
          "border",
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        )}>
          <CardHeader>
            <CardTitle className={cn(
              "flex items-center space-x-2",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              <User size={20} />
              <span>Perfil do Usuário</span>
            </CardTitle>
            <CardDescription className={cn(
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={cn(
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>Nome</Label>
              <Input 
                id="name" 
                defaultValue={user?.name} 
                className={cn(
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-200"
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className={cn(
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>Email</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue={user?.email} 
                className={cn(
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-200"
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className={cn(
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>Cargo</Label>
              <Input 
                id="role" 
                defaultValue={user?.role?.replace('_', ' ')} 
                disabled 
                className={cn(
                  "capitalize",
                  isDarkMode 
                    ? "bg-gray-600 border-gray-600 text-gray-400" 
                    : "bg-gray-100 border-gray-200 text-gray-500"
                )}
              />
            </div>
            <Button className="w-full bg-villa-primary hover:bg-villa-primary/90">
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className={cn(
          "border",
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        )}>
          <CardHeader>
            <CardTitle className={cn(
              "flex items-center space-x-2",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              <Bell size={20} />
              <span>Notificações</span>
            </CardTitle>
            <CardDescription className={cn(
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Configure como você recebe notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={cn(
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>Novas mensagens</Label>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>Receber notificações de novas mensagens</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className={cn(
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )} />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={cn(
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>Email</Label>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>Receber notificações por email</p>
              </div>
              <Switch />
            </div>
            <Separator className={cn(
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )} />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={cn(
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>Som</Label>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>Reproduzir som para notificações</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card className={cn(
          "border",
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        )}>
          <CardHeader>
            <CardTitle className={cn(
              "flex items-center space-x-2",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              <Shield size={20} />
              <span>Segurança</span>
            </CardTitle>
            <CardDescription className={cn(
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Gerencie a segurança da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className={cn(
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>Senha Atual</Label>
              <Input 
                id="current-password" 
                type="password" 
                className={cn(
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-200"
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className={cn(
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>Nova Senha</Label>
              <Input 
                id="new-password" 
                type="password" 
                className={cn(
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-200"
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className={cn(
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>Confirmar Nova Senha</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                className={cn(
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-200"
                )}
              />
            </div>
            <Button variant="outline" className={cn(
              "w-full",
              isDarkMode 
                ? "border-gray-600 text-gray-300 hover:bg-gray-700" 
                : "border-gray-300"
            )}>
              Alterar Senha
            </Button>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card className={cn(
          "border",
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        )}>
          <CardHeader>
            <CardTitle className={cn(
              "flex items-center space-x-2",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              <Palette size={20} />
              <span>Aparência</span>
            </CardTitle>
            <CardDescription className={cn(
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Personalize a aparência da aplicação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={cn(
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>Modo Escuro</Label>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>Usar tema escuro na interface</p>
              </div>
              <Switch checked={isDarkMode} />
            </div>
            <Separator className={cn(
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )} />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={cn(
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>Compacto</Label>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>Usar layout mais compacto</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
