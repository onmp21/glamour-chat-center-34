
import { useAuditLogs } from './useAuditLogs';
import { useAuth } from '@/contexts/AuthContext';

export const useAuditLogger = () => {
  const { createAuditLog } = useAuditLogs();
  const { user } = useAuth();

  const logAction = async (
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: any
  ) => {
    if (!user) return;

    try {
      await createAuditLog({
        user_name: user.name,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details
      });
    } catch (error) {
      console.error('Erro ao criar log de auditoria:', error);
    }
  };

  return {
    logUserAction: (action: string, targetUserId?: string, details?: any) =>
      logAction(action, 'user', targetUserId, details),
    
    logProfileAction: (action: string, details?: any) =>
      logAction(action, 'profile', user?.id, details),
    
    logCredentialsAction: (action: string, details?: any) =>
      logAction(action, 'credentials', user?.id, details),
    
    logNotificationAction: (action: string, details?: any) =>
      logAction(action, 'notifications', user?.id, details),
    
    logAuthAction: (action: string, details?: any) =>
      logAction(action, 'auth', undefined, details),
    
    logSystemAction: (action: string, details?: any) =>
      logAction(action, 'system', undefined, details)
  };
};
