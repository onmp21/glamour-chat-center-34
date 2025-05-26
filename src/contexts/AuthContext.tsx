
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, UserRole } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => boolean;
  updateUser: (userId: string, userData: Partial<User>) => boolean;
  deleteUser: (userId: string) => boolean;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dados mockados atualizados com as novas funções e permissões
const defaultUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    name: 'Administrador Villa Glamour',
    role: 'admin',
    assignedTabs: ['chat', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'gerente-lojas', 'gerente-externo'],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    username: 'gerente.ext',
    name: 'Gerente Externo',
    role: 'manager_external',
    assignedTabs: ['chat', 'gerente-externo'],
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    username: 'gerente.lojas',
    name: 'Gerente de Lojas',
    role: 'manager_store',
    assignedTabs: ['chat', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'gerente-lojas'],
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    username: 'vendedora.canarana',
    name: 'Vendedora Canarana',
    role: 'salesperson',
    assignedTabs: ['chat', 'canarana'],
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    username: 'vendedora.souto',
    name: 'Vendedora Souto Soares',
    role: 'salesperson',
    assignedTabs: ['chat', 'souto-soares'],
    createdAt: new Date().toISOString()
  }
];

const userPasswords: Record<string, string> = {
  'admin': 'admin123',
  'gerente.ext': 'gerente123',
  'gerente.lojas': 'gerente123',
  'vendedora.canarana': 'vendedora123',
  'vendedora.souto': 'vendedora123'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });
  const [users, setUsers] = useState<User[]>(defaultUsers);

  useEffect(() => {
    const savedUser = localStorage.getItem('villa_glamour_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuthState({ user, isAuthenticated: true });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const user = users.find(u => u.username === credentials.username);
    const expectedPassword = userPasswords[credentials.username];
    
    if (user && expectedPassword === credentials.password) {
      setAuthState({ user, isAuthenticated: true });
      localStorage.setItem('villa_glamour_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('villa_glamour_user');
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt'>): boolean => {
    if (authState.user?.role !== 'admin') return false;
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setUsers(prev => [...prev, newUser]);
    userPasswords[userData.username] = 'password123'; // Senha padrão
    return true;
  };

  const updateUser = (userId: string, userData: Partial<User>): boolean => {
    if (authState.user?.role !== 'admin') return false;
    
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
    return true;
  };

  const deleteUser = (userId: string): boolean => {
    if (authState.user?.role !== 'admin') return false;
    
    setUsers(prev => prev.filter(user => user.id !== userId));
    return true;
  };

  const getAllUsers = (): User[] => {
    return authState.user?.role === 'admin' ? users : [];
  };

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
