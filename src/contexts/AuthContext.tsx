
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
        console.log('Login como admin realizado com sucesso');
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
        console.log('Login como usuário regular realizado com sucesso');
        return true;
      }

      console.log('Credenciais inválidas');
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
