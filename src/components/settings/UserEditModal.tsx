
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { User, UserRole } from '@/types/auth';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (userId: string, userData: Partial<User>) => void;
  user: User | null;
  isDarkMode: boolean;
}

const availableTabs = [
  { id: 'general', name: 'Canal Geral' },
  { id: 'canarana', name: 'Canarana' },
  { id: 'souto-soares', name: 'Souto Soares' },
  { id: 'joao-dourado', name: 'João Dourado' },
  { id: 'america-dourada', name: 'América Dourada' },
  { id: 'manager-store', name: 'Gerente das Lojas' },
  { id: 'manager-external', name: 'Gerente do Externo' }
];

const rolePermissions: Record<UserRole, string[]> = {
  admin: ['general', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'manager-store', 'manager-external'],
  manager_external: ['general', 'manager-external'],
  manager_store: ['general', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'manager-store'],
  salesperson: ['general']
};

export const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  onUpdateUser,
  user,
  isDarkMode
}) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    role: '' as UserRole,
    assignedTabs: [] as string[]
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        name: user.name,
        role: user.role,
        assignedTabs: user.assignedTabs
      });
    }
  }, [user]);

  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      role,
      assignedTabs: rolePermissions[role] || []
    }));
  };

  const handleTabToggle = (tabId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTabs: prev.assignedTabs.includes(tabId)
        ? prev.assignedTabs.filter(id => id !== tabId)
        : [...prev.assignedTabs, tabId]
    }));
  };

  const handleSubmit = () => {
    if (user && formData.username && formData.name && formData.role) {
      onUpdateUser(user.id, formData);
      onClose();
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      admin: 'Administrador',
      manager_external: 'Gerente Externo',
      manager_store: 'Gerente de Loja',
      salesperson: 'Vendedora'
    };
    return labels[role];
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-md",
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Editar Usuário
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className={cn(
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>Nome de Usuário</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className={cn(
                isDarkMode 
                  ? "bg-gray-800 border-gray-700 text-white" 
                  : "bg-white border-gray-300"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className={cn(
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={cn(
                isDarkMode 
                  ? "bg-gray-800 border-gray-700 text-white" 
                  : "bg-white border-gray-300"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label className={cn(
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>Função</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger className={cn(
                isDarkMode 
                  ? "bg-gray-800 border-gray-700 text-white" 
                  : "bg-white border-gray-300"
              )}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(rolePermissions).map(([role]) => (
                  <SelectItem key={role} value={role}>
                    {getRoleLabel(role as UserRole)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className={cn(
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>Canais Atribuídos</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableTabs.map(tab => (
                <div key={tab.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={tab.id}
                    checked={formData.assignedTabs.includes(tab.id)}
                    onCheckedChange={() => handleTabToggle(tab.id)}
                    disabled={formData.role !== 'admin' && !rolePermissions[formData.role]?.includes(tab.id)}
                  />
                  <Label htmlFor={tab.id} className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}>
                    {tab.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-villa-primary hover:bg-villa-primary/90"
          >
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
