import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserCreateModal } from './UserCreateModal';
import { UserEditModal } from './UserEditModal';
import { User, UserRole } from '@/types/auth';

interface UserManagementSectionProps {
  isDarkMode: boolean;
}

export const UserManagementSection: React.FC<UserManagementSectionProps> = ({ isDarkMode }) => {
  const { getAllUsers, createUser, updateUser, deleteUser } = useAuth();
  const [users, setUsers] = useState(getAllUsers());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      admin: 'Administrador',
      manager_external: 'Gerente Externo',
      manager_store: 'Gerente de Loja',
      salesperson: 'Vendedora'
    };
    return labels[role];
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      admin: 'bg-red-100 text-red-800',
      manager_external: 'bg-blue-100 text-blue-800',
      manager_store: 'bg-green-100 text-green-800',
      salesperson: 'bg-yellow-100 text-yellow-800'
    };
    return colors[role];
  };

  const handleCreateUser = (userData: {
    username: string;
    password: string;
    name: string;
    role: UserRole;
    assignedTabs: string[];
    assignedCities: string[];
  }) => {
    const success = createUser(userData);
    if (success) {
      setUsers(getAllUsers());
      console.log('Usuário criado com sucesso');
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = (userId: string, userData: Partial<User>) => {
    const success = updateUser(userId, userData);
    if (success) {
      setUsers(getAllUsers());
      console.log('Usuário atualizado com sucesso');
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      const success = deleteUser(userToDelete.id);
      if (success) {
        setUsers(getAllUsers());
        console.log('Usuário excluído com sucesso');
      }
      setUserToDelete(null);
    }
  };

  return (
    <>
      <Card className={cn(
        "border"
      )} style={{
        backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
        borderColor: isDarkMode ? '#686868' : '#e5e7eb'
      }}>
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center justify-between",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            <div className="flex items-center space-x-2">
              <Users size={20} />
              <span>Gerenciamento de Usuários</span>
            </div>
            <Button 
              size="sm" 
              onClick={() => setIsCreateModalOpen(true)}
              style={{ backgroundColor: '#b5103c', color: '#ffffff' }}
              className="hover:opacity-90"
            >
              <Plus size={16} className="mr-2" />
              Novo Usuário
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className={cn(
                "flex items-center justify-between p-4 rounded-lg border"
              )} style={{
                backgroundColor: isDarkMode ? '#000000' : '#f9fafb',
                borderColor: isDarkMode ? '#686868' : '#e5e7eb'
              }}>
                <div className="flex-1">
                  <h4 className={cn(
                    "font-medium",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {user.name}
                  </h4>
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  )}>
                    {user.username}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                    <span className={cn(
                      "text-xs",
                      isDarkMode ? "text-gray-400" : "text-gray-400"
                    )}>
                      {user.assignedTabs.length} canal(is) atribuído(s)
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditUser(user)}
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: isDarkMode ? '#686868' : '#d1d5db',
                      color: isDarkMode ? '#ffffff' : '#374151'
                    }}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteUser(user)}
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: '#dc2626',
                      color: '#dc2626'
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateUser={handleCreateUser}
        isDarkMode={isDarkMode}
      />

      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateUser={handleUpdateUser}
        user={selectedUser}
        isDarkMode={isDarkMode}
      />

      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={cn(
            "p-6 rounded-lg max-w-md w-full mx-4"
          )} style={{
            backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#111827'
          }}>
            <h3 className="text-lg font-semibold mb-4">Confirmar Exclusão</h3>
            <p className={cn(
              "mb-6",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
              Tem certeza que deseja excluir o usuário "{userToDelete.name}"? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setUserToDelete(null)}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: isDarkMode ? '#686868' : '#d1d5db',
                  color: isDarkMode ? '#ffffff' : '#374151'
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={confirmDeleteUser}
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff'
                }}
                className="hover:opacity-90"
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
