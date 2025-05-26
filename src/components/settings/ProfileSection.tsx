
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { ProfilePicture } from '../ProfilePicture';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface ProfileSectionProps {
  isDarkMode: boolean;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ isDarkMode }) => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageChange = (imageUrl: string | null) => {
    setProfileImage(imageUrl);
    // Aqui você pode implementar a lógica para salvar a imagem no backend
    console.log('Nova imagem de perfil:', imageUrl);
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      manager_external: 'Gerente Externo',
      manager_store: 'Gerente de Loja',
      salesperson: 'Vendedora'
    };
    return labels[role] || role;
  };

  return (
    <Card className={cn(
      "border"
    )} style={{
      backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
      borderColor: isDarkMode ? '#686868' : '#e5e7eb'
    }}>
      <CardHeader>
        <CardTitle className={cn(
          "flex items-center space-x-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <User size={20} />
          <span>Perfil do Usuário</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Foto de Perfil */}
        <div className="flex justify-center">
          <ProfilePicture
            isDarkMode={isDarkMode}
            currentImage={profileImage}
            userName={user?.name || ''}
            onImageChange={handleImageChange}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className={cn(
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>Nome Completo</Label>
            <Input 
              id="fullName" 
              defaultValue={user?.name}
              style={{
                backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                borderColor: isDarkMode ? '#686868' : '#d1d5db',
                color: isDarkMode ? '#ffffff' : '#111827'
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username" className={cn(
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>Usuário</Label>
            <Input 
              id="username" 
              defaultValue={user?.username}
              disabled
              style={{
                backgroundColor: isDarkMode ? '#1a1a1a' : '#f3f4f6',
                borderColor: isDarkMode ? '#686868' : '#d1d5db',
                color: isDarkMode ? '#a1a1aa' : '#6b7280'
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className={cn(
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>Cargo</Label>
            <Input 
              id="role" 
              defaultValue={getRoleLabel(user?.role || '')}
              disabled
              style={{
                backgroundColor: isDarkMode ? '#1a1a1a' : '#f3f4f6',
                borderColor: isDarkMode ? '#686868' : '#d1d5db',
                color: isDarkMode ? '#a1a1aa' : '#6b7280'
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className={cn(
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>Biografia</Label>
            <Textarea 
              id="bio" 
              placeholder="Conte um pouco sobre você..."
              style={{
                backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                borderColor: isDarkMode ? '#686868' : '#d1d5db',
                color: isDarkMode ? '#ffffff' : '#111827'
              }}
            />
          </div>
          
          <Button 
            style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
            className="hover:opacity-90"
          >
            Salvar Perfil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
