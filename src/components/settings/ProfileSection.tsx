
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface ProfileSectionProps {
  isDarkMode: boolean;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ isDarkMode }) => {
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
          <User size={20} />
          <span>Perfil do Usuário</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className={cn(
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}>Nome Completo</Label>
          <Input 
            id="fullName" 
            defaultValue={user?.name}
            className={cn(
              isDarkMode 
                ? "bg-gray-800 border-gray-700 text-white" 
                : "bg-white border-gray-300"
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role" className={cn(
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}>Cargo</Label>
          <Input 
            id="role" 
            defaultValue={user?.role}
            disabled
            className={cn(
              isDarkMode 
                ? "bg-gray-800 border-gray-700 text-gray-400" 
                : "bg-gray-100 border-gray-300 text-gray-500"
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio" className={cn(
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}>Biografia</Label>
          <Textarea 
            id="bio" 
            placeholder="Conte um pouco sobre você..."
            className={cn(
              isDarkMode 
                ? "bg-gray-800 border-gray-700 text-white" 
                : "bg-white border-gray-300"
            )}
          />
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          Salvar Perfil
        </Button>
      </CardContent>
    </Card>
  );
};
