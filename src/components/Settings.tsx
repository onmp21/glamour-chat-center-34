
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/types/auth';
import { ChatTab } from '@/types/chat';

export const Settings: React.FC = () => {
  const { user, getAllUsers, createUser, updateUser, deleteUser } = useAuth();
  const { tabs, createTab, deleteTab } = useChat();
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    role: 'operator' as UserRole,
    assignedTabs: [] as string[]
  });
  const [newTab, setNewTab] = useState({
    name: '',
    type: 'store' as ChatTab['type']
  });

  const isAdmin = user?.role === 'admin';

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.name) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }

    const success = createUser(newUser);
    if (success) {
      toast({
        title: 'Sucesso',
        description: 'Usuário criado com sucesso.'
      });
      setNewUser({
        username: '',
        name: '',
        role: 'operator',
        assignedTabs: []
      });
    }
  };

  const handleCreateTab = () => {
    if (!newTab.name) {
      toast({
        title: 'Erro',
        description: 'Nome da aba é obrigatório.',
        variant: 'destructive'
      });
      return;
    }

    const success = createTab(newTab.name, newTab.type);
    if (success) {
      toast({
        title: 'Sucesso',
        description: 'Aba criada com sucesso.'
      });
      setNewTab({ name: '', type: 'store' });
    }
  };

  const handleDeleteTab = (tabId: string) => {
    const success = deleteTab(tabId);
    if (success) {
      toast({
        title: 'Sucesso',
        description: 'Aba removida com sucesso.'
      });
    } else {
      toast({
        title: 'Erro',
        description: 'Não é possível remover a aba padrão.',
        variant: 'destructive'
      });
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      admin: 'Administrador',
      manager_external: 'Gerente Externo',
      manager_store: 'Gerente de Lojas',
      operator: 'Operador'
    };
    return labels[role];
  };

  const getTypeLabel = (type: ChatTab['type']) => {
    const labels = {
      general: 'Geral',
      store: 'Loja',
      department: 'Departamento',
      external: 'Externo'
    };
    return labels[type];
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Suas configurações pessoais</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar as configurações do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔒</div>
              <p className="text-gray-500">Apenas administradores podem gerenciar usuários e configurações.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie usuários e configurações do sistema</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="tabs">Abas de Atendimento</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Criar Usuário */}
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Usuário</CardTitle>
              <CardDescription>
                Adicione um novo usuário ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Usuário</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="nome.usuario"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do usuário"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="role">Tipo de Acesso</Label>
                <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager_external">Gerente Externo</SelectItem>
                    <SelectItem value="manager_store">Gerente de Lojas</SelectItem>
                    <SelectItem value="operator">Operador de Loja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Abas Permitidas</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {tabs.map(tab => (
                    <label key={tab.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newUser.assignedTabs.includes(tab.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewUser(prev => ({ ...prev, assignedTabs: [...prev.assignedTabs, tab.id] }));
                          } else {
                            setNewUser(prev => ({ ...prev, assignedTabs: prev.assignedTabs.filter(id => id !== tab.id) }));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{tab.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button onClick={handleCreateUser} className="bg-villa-primary hover:bg-villa-primary/90">
                Criar Usuário
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Usuários */}
          <Card>
            <CardHeader>
              <CardTitle>Usuários do Sistema</CardTitle>
              <CardDescription>
                Lista de todos os usuários cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getAllUsers().map(userItem => (
                  <div key={userItem.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{userItem.name}</h4>
                      <p className="text-sm text-gray-600">@{userItem.username}</p>
                      <Badge variant="outline" className="mt-1">
                        {getRoleLabel(userItem.role)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-2">{userItem.assignedTabs.length} abas</p>
                      {userItem.id !== user?.id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteUser(userItem.id)}
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tabs" className="space-y-6">
          {/* Criar Aba */}
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Aba</CardTitle>
              <CardDescription>
                Adicione uma nova aba de atendimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tabName">Nome da Aba</Label>
                  <Input
                    id="tabName"
                    value={newTab.name}
                    onChange={(e) => setNewTab(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome da nova aba"
                  />
                </div>
                <div>
                  <Label htmlFor="tabType">Tipo</Label>
                  <Select value={newTab.type} onValueChange={(value: ChatTab['type']) => setNewTab(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="store">Loja</SelectItem>
                      <SelectItem value="department">Departamento</SelectItem>
                      <SelectItem value="external">Externo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleCreateTab} className="bg-villa-primary hover:bg-villa-primary/90">
                Criar Aba
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Abas */}
          <Card>
            <CardHeader>
              <CardTitle>Abas de Atendimento</CardTitle>
              <CardDescription>
                Gerencie as abas de atendimento do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tabs.map(tab => (
                  <div key={tab.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{tab.name}</h4>
                      <Badge variant="outline" className="mt-1">
                        {getTypeLabel(tab.type)}
                      </Badge>
                      {tab.isDefault && (
                        <Badge className="ml-2 bg-villa-primary">
                          Padrão
                        </Badge>
                      )}
                    </div>
                    <div>
                      {!tab.isDefault && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTab(tab.id)}
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
