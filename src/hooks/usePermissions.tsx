
import { useAuth } from '@/contexts/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  const canManageUsers = () => {
    return user?.role === 'admin';
  };

  const canAccessAuditHistory = () => {
    return user?.role === 'admin' || user?.role === 'manager_external';
  };

  const canManageTabs = () => {
    return user?.role === 'admin';
  };

  // Ativando para todos os usuários poderem alterar suas credenciais
  const canAccessCredentials = () => {
    return true; // Todos os usuários podem alterar suas próprias credenciais
  };

  const getAccessibleChannels = () => {
    if (!user) return [];
    
    // Admin e gerente externo têm acesso a todos os canais
    if (user.role === 'admin' || user.role === 'manager_external') {
      return ['chat', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'gerente-lojas', 'gerente-externo', 'pedro'];
    }
    
    // Gerente de loja tem acesso aos canais das lojas e gerente de lojas
    if (user.role === 'manager_store') {
      return ['canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'gerente-lojas'];
    }
    
    // Vendedoras têm acesso baseado nas cidades atribuídas
    if (user.role === 'salesperson') {
      const channels = ['chat']; // Sempre têm acesso ao chat geral
      
      if (user.assignedCities?.includes('canarana')) {
        channels.push('canarana');
      }
      if (user.assignedCities?.includes('souto-soares')) {
        channels.push('souto-soares');
      }
      if (user.assignedCities?.includes('joao-dourado')) {
        channels.push('joao-dourado');
      }
      if (user.assignedCities?.includes('america-dourada')) {
        channels.push('america-dourada');
      }
      
      return channels;
    }
    
    return ['chat']; // Fallback para pelo menos o chat geral
  };

  return {
    canManageUsers,
    canAccessAuditHistory,
    canManageTabs,
    canAccessCredentials,
    getAccessibleChannels
  };
};
