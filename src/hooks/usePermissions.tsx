
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
        return ['chat', 'gerente-externo'];
      case 'manager_store':
        return ['chat', 'canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'gerente-lojas'];
      case 'salesperson':
        const storeChannels = user.assignedTabs?.filter(tab => tab !== 'chat' && tab !== 'general') || [];
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

  const canAccessCredentials = () => {
    return user?.role === 'admin';
  };

  const canAccessAuditHistory = () => {
    return user?.role === 'admin' || user?.role === 'manager_external';
  };

  const canManageTabs = () => {
    return user?.role === 'admin';
  };

  const canSendMessage = (channelId: string) => {
    if (!user) return false;
    
    // Canal geral: apenas admin pode enviar mensagens
    if (channelId === 'chat' || channelId === 'general') {
      return user.role === 'admin';
    }
    
    // Outros canais: verificar se tem acesso
    return canAccessChannel(channelId);
  };

  return {
    getAccessibleChannels,
    canAccessChannel,
    canManageUsers,
    canAccessCredentials,
    canAccessAuditHistory,
    canManageTabs,
    canSendMessage
  };
};
