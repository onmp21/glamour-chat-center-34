
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface CredentialsSectionProps {
  isDarkMode: boolean;
}

export const CredentialsSection: React.FC<CredentialsSectionProps> = ({ isDarkMode }) => {
  const { user } = useAuth();

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
          <Lock size={20} />
          <span>Alterar Credenciais</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className={cn(
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}>Email <span className="text-red-500">*</span></Label>
          <Input 
            id="email" 
            type="email"
            defaultValue={user?.username} 
            className={cn(
              isDarkMode 
                ? "bg-gray-800 border-gray-700 text-white" 
                : "bg-white border-gray-300"
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="old-password" className={cn(
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}>Senha antiga <span className="text-red-500">*</span></Label>
          <Input 
            id="old-password" 
            type="password" 
            className={cn(
              isDarkMode 
                ? "bg-gray-800 border-gray-700 text-white" 
                : "bg-white border-gray-300"
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password" className={cn(
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}>Nova senha <span className="text-red-500">*</span></Label>
          <Input 
            id="new-password" 
            type="password" 
            className={cn(
              isDarkMode 
                ? "bg-gray-800 border-gray-700 text-white" 
                : "bg-white border-gray-300"
            )}
          />
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          Salvar Alterações
        </Button>
      </CardContent>
    </Card>
  );
};
