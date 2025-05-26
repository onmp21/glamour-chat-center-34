
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

export const usePermissions = () => {
  const { user } = useAuth();

  const getAccessibleChannels = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return ['chat', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'gerente-lojas', 'gerente-externo'];
      case 'manager_external':
        return ['chat', 'gerente-externo']; // Apenas seu canal + geral (visualização)
      case 'manager_store':
        return ['chat', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'gerente-lojas']; // Canais das lojas + geral
      case 'salesperson':
        // Vendedora acessa apenas seu canal específico + geral
        const storeChannels = user.assignedTabs?.filter(tab => tab !== 'chat') || [];
        return ['chat', ...storeChannels];
      default:
        return ['chat'];
    }
  };

  const canAccessChannel = (channel: string) => {
    return getAccessibleChannels().includes(channel);
  };

  const canManageUsers = () => {
    return user?.role === 'admin';
  };

  const canAccessAuditHistory = () => {
    return user?.role === 'admin' || user?.role === 'manager_external';
  };

  const canManageTabs = () => {
    return user?.role === 'admin';
  };

  return {
    getAccessibleChannels,
    canAccessChannel,
    canManageUsers,
    canAccessAuditHistory,
    canManageTabs
  };
};
