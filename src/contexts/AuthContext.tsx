
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  createUser: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('villa_glamour_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuthState({ user, isAuthenticated: true });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // Verificar se é o administrador usando Supabase
      const { data: adminData, error: adminError } = await supabase.rpc('verify_admin_credentials', {
        input_username: credentials.username,
        input_password: credentials.password
      });

      if (!adminError && adminData && adminData.length > 0) {
        const admin = adminData[0];
        const adminUser: User = {
          id: admin.admin_id,
          username: admin.admin_username,
          name: admin.admin_name,
          role: 'admin',
          assignedTabs: ['general', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'manager-store', 'manager-external'],
          assignedCities: ['Canarana', 'Souto Soares', 'João Dourado', 'América Dourada'],
          createdAt: new Date().toISOString()
        };

        setAuthState({ user: adminUser, isAuthenticated: true });
        localStorage.setItem('villa_glamour_user', JSON.stringify(adminUser));
        return true;
      }

      // Verificar usuários regulares
      const { data: userData, error: userError } = await supabase.rpc('verify_user_credentials', {
        input_username: credentials.username,
        input_password: credentials.password
      });

      if (!userError && userData && userData.length > 0) {
        const userInfo = userData[0];
        const user: User = {
          id: userInfo.user_id,
          username: userInfo.user_username,
          name: userInfo.user_name,
          role: userInfo.user_role as UserRole,
          assignedTabs: userInfo.user_assigned_tabs || [],
          assignedCities: userInfo.user_assigned_cities || [],
          createdAt: new Date().toISOString()
        };

        setAuthState({ user, isAuthenticated: true });
        localStorage.setItem('villa_glamour_user', JSON.stringify(user));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro durante login:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('villa_glamour_user');
  };

  const createUser = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
    if (authState.user?.role !== 'admin') return false;
    
    try {
      const { data, error } = await supabase.rpc('create_user_with_hash', {
        p_username: userData.username,
        p_password: userData.password,
        p_name: userData.name,
        p_role: userData.role,
        p_assigned_tabs: userData.assignedTabs,
        p_assigned_cities: userData.assignedCities
      });

      if (error) {
        console.error('Erro ao criar usuário:', error);
        return false;
      }

      // Recarregar usuários
      await loadUsers();
      return true;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return false;
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    if (authState.user?.role !== 'admin') return false;
    
    try {
      const updateData: any = {};
      
      if (userData.username) updateData.username = userData.username;
      if (userData.name) updateData.name = userData.name;
      if (userData.role) updateData.role = userData.role;
      if (userData.assignedTabs) updateData.assigned_tabs = userData.assignedTabs;
      if (userData.assignedCities) updateData.assigned_cities = userData.assignedCities;

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        return false;
      }

      await loadUsers();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    if (authState.user?.role !== 'admin') return false;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) {
        console.error('Erro ao excluir usuário:', error);
        return false;
      }

      await loadUsers();
      return true;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      return false;
    }
  };

  const loadUsers = async () => {
    if (authState.user?.role !== 'admin') return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar usuários:', error);
        return;
      }

      const formattedUsers: User[] = (data || []).map(user => ({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role as UserRole,
        assignedTabs: user.assigned_tabs || [],
        assignedCities: user.assigned_cities || [],
        createdAt: user.created_at
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const getAllUsers = (): User[] => {
    return authState.user?.role === 'admin' ? users : [];
  };

  // Carregar usuários quando admin faz login
  useEffect(() => {
    if (authState.user?.role === 'admin') {
      loadUsers();
    }
  }, [authState.user]);

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      createUser,
      updateUser,
      deleteUser,
      getAllUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
