
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';

interface UserManagementSectionProps {
  isDarkMode: boolean;
}

const mockUsers = [
  { id: '1', name: 'Admin Principal', username: 'admin', role: 'admin', assignedTabs: ['all'] },
  { id: '2', name: 'Gerente Externo', username: 'gerente.ext', role: 'gerente_externo', assignedTabs: ['gerente-externo', 'general'] },
  { id: '3', name: 'Operador Canarana', username: 'op.canarana', role: 'operador_loja', assignedTabs: ['canarana'] }
];

export const UserManagementSection: React.FC<UserManagementSectionProps> = ({ isDarkMode }) => {
  const [users, setUsers] = useState(mockUsers);

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'admin': 'Administrador',
      'gerente_externo': 'Gerente Externo',
      'gerente_lojas': 'Gerente de Lojas',
      'operador_loja': 'Operador de Loja'
    };
    return labels[role] || role;
  };

  return (
    <Card className={cn(
      "border",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
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
            className="bg-villa-primary hover:bg-villa-primary/90"
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
              "flex items-center justify-between p-4 rounded-lg border",
              isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
            )}>
              <div className="flex-1">
                <h4 className={cn(
                  "font-medium",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  {user.name}
                </h4>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                )}>
                  {user.username}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline">
                    {getRoleLabel(user.role)}
                  </Badge>
                  <span className={cn(
                    "text-xs",
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  )}>
                    {user.assignedTabs.length} aba(s) atribuída(s)
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit size={16} />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
