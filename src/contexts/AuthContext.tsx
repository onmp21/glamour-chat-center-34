
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('villa_glamour_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuthState({ user, isAuthenticated: true });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      console.log('Tentando fazer login com:', credentials.username);
      
      // Primeiro vamos listar todos os usuários para debug
      const { data: allUsers, error: listError } = await supabase
        .from('users')
        .select('id, username, name, role, is_active');
      
      console.log('Todos os usuários no banco:', { allUsers, listError });
      
      // Verificar se é o administrador usando Supabase (função corrigida)
      const { data: adminData, error: adminError } = await supabase.rpc('verify_admin_credentials', {
        input_username: credentials.username,
        input_password: credentials.password
      });

      console.log('Resposta admin (função corrigida):', { adminData, adminError });

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
        console.log('Login como admin realizado com sucesso');
        return true;
      }

      // Se não funcionou com a função principal, tentar a função de fallback
      if (!adminData || adminData.length === 0) {
        console.log('Tentando função de fallback para admin...');
        const { data: legacyAdminData, error: legacyAdminError } = await supabase.rpc('verify_legacy_admin_credentials', {
          input_username: credentials.username,
          input_password: credentials.password
        });

        console.log('Resposta admin (função legacy):', { legacyAdminData, legacyAdminError });

        if (!legacyAdminError && legacyAdminData && legacyAdminData.length > 0) {
          const admin = legacyAdminData[0];
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
          console.log('Login como admin (legacy) realizado com sucesso');
          return true;
        }
      }

      // Verificar usuários regulares
      console.log('Tentando verificar usuário regular com username:', credentials.username);
      
      // Primeiro verificar se o usuário existe no banco
      const { data: userCheck, error: userCheckError } = await supabase
        .from('users')
        .select('id, username, name, role, is_active, assigned_tabs, assigned_cities')
        .eq('username', credentials.username)
        .eq('is_active', true);
      
      console.log('Verificação direta do usuário:', { userCheck, userCheckError });
      
      const { data: userData, error: userError } = await supabase.rpc('verify_user_credentials', {
        input_username: credentials.username,
        input_password: credentials.password
      });

      console.log('Resposta função verify_user_credentials:', { userData, userError });

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
        console.log('Login como usuário regular realizado com sucesso');
        return true;
      }

      console.log('Credenciais inválidas - nenhum usuário encontrado');
      console.log('Dados recebidos:', { adminData, userData });
      
      // Se encontrou o usuário mas a função não funcionou, pode ser problema de senha
      if (userCheck && userCheck.length > 0) {
        console.log('Usuário existe no banco, mas senha pode estar incorreta');
        console.log('Dados do usuário encontrado:', userCheck[0]);
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

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout
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
