
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
      
      // Primeiro vamos buscar o usuário diretamente para debug
      const { data: userCheck, error: userCheckError } = await supabase
        .from('users')
        .select('id, username, name, role, is_active, assigned_tabs, assigned_cities, password_hash')
        .eq('username', credentials.username)
        .eq('is_active', true);
      
      console.log('Usuário encontrado:', { userCheck, userCheckError });
      
      if (userCheck && userCheck.length > 0) {
        const foundUser = userCheck[0];
        console.log('Detalhes do usuário:', {
          username: foundUser.username,
          role: foundUser.role,
          hasPasswordHash: !!foundUser.password_hash
        });
        
        // Verificar senha usando a função do Supabase
        if (foundUser.role === 'admin') {
          const { data: adminData, error: adminError } = await supabase.rpc('verify_admin_credentials', {
            input_username: credentials.username,
            input_password: credentials.password
          });

          console.log('Resultado verificação admin:', { adminData, adminError });

          if (!adminError && adminData && adminData.length > 0) {
            const admin = adminData[0];
            const adminUser: User = {
              id: admin.admin_id,
              username: admin.admin_username,
              name: admin.admin_name,
              role: 'admin',
              assignedTabs: foundUser.assigned_tabs || ['general', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'manager-store', 'manager-external'],
              assignedCities: foundUser.assigned_cities || ['Canarana', 'Souto Soares', 'João Dourado', 'América Dourada'],
              createdAt: new Date().toISOString()
            };

            setAuthState({ user: adminUser, isAuthenticated: true });
            localStorage.setItem('villa_glamour_user', JSON.stringify(adminUser));
            console.log('Login como admin realizado com sucesso');
            return true;
          }
        } else {
          // Para usuários não-admin
          const { data: userData, error: userError } = await supabase.rpc('verify_user_credentials', {
            input_username: credentials.username,
            input_password: credentials.password
          });

          console.log('Resultado verificação usuário:', { userData, userError });

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
        }
      }

      // Se chegou aqui, as credenciais são inválidas
      console.log('Credenciais inválidas ou usuário não encontrado');
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
