
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

    await createAuditLog({
      user_name: user.name,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details
    });
  };

  return {
    logUserAction: (action: string, targetUserId?: string, details?: any) =>
      logAction(action, 'user', targetUserId, details),
    
    logExamAction: (action: string, examId?: string, details?: any) =>
      logAction(action, 'exam', examId, details),
    
    logChannelAction: (action: string, channelId?: string, details?: any) =>
      logAction(action, 'channel', channelId, details),
    
    logAuthAction: (action: string, details?: any) =>
      logAction(action, 'auth', undefined, details),
    
    logSystemAction: (action: string, details?: any) =>
      logAction(action, 'system', undefined, details)
  };
};
