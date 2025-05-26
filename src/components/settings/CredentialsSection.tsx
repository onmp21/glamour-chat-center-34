
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/hooks/useUsers';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface CredentialsSectionProps {
  isDarkMode: boolean;
}

export const CredentialsSection: React.FC<CredentialsSectionProps> = ({ isDarkMode }) => {
  const { user } = useAuth();
  const { updateUser } = useUsers();
  const { logCredentialsAction } = useAuditLogger();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Validações
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "A nova senha e confirmação não coincidem",
        variant: "destructive"
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      const updateData: any = {};
      const changes: string[] = [];
      
      if (formData.username !== user.username) {
        updateData.username = formData.username;
        changes.push('username');
      }
      
      if (formData.newPassword.trim()) {
        updateData.password = formData.newPassword;
        changes.push('password');
      }

      await updateUser(user.id, updateData);
      
      // Log da ação
      await logCredentialsAction('update', {
        changes,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Sucesso",
        description: "Credenciais atualizadas com sucesso!",
        variant: "default"
      });

      // Limpar senhas após sucesso
      setFormData(prev => ({
        ...prev,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (error) {
      console.error('Erro ao atualizar credenciais:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar credenciais. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn(
      "border",
      isDarkMode ? "border-gray-600" : "border-gray-200"
    )} style={{
      backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff'
    }}>
      <CardHeader>
        <CardTitle className={cn(
          "flex items-center space-x-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <Lock size={20} />
          <span>Alterar Credenciais</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className={cn(
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>Nome de Usuário <span className="text-red-500">*</span></Label>
            <Input 
              id="username" 
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={cn(
                isDarkMode 
                  ? "border-gray-600 text-white" 
                  : "border-gray-300"
              )}
              style={{
                backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff'
              }}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password" className={cn(
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>Nova Senha</Label>
            <Input 
              id="new-password" 
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className={cn(
                isDarkMode 
                  ? "border-gray-600 text-white" 
                  : "border-gray-300"
              )}
              style={{
                backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff'
              }}
              placeholder="Deixe em branco para manter a atual"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className={cn(
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>Confirmar Nova Senha</Label>
            <Input 
              id="confirm-password" 
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={cn(
                isDarkMode 
                  ? "border-gray-600 text-white" 
                  : "border-gray-300"
              )}
              style={{
                backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff'
              }}
              placeholder="Confirme a nova senha"
            />
          </div>
          
          <Button 
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
