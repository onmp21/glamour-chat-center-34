
import { useAuth } from '@/contexts/AuthContext';
import { AuditService } from '@/services/AuditService';
import { useAuditLoggers } from './useAuditLoggers';

export const useAuditLogger = () => {
  const { user } = useAuth();
  const loggers = useAuditLoggers();

  const createAuditLog = async (
    action: string,
    resourceType: string,
    resourceId: string,
    details?: Record<string, any>
  ) => {
    if (!user?.id) {
      console.warn('🚫 [AUDIT] Tentativa de log sem usuário autenticado:', { action, resourceType });
      return;
    }

    const auditService = AuditService.getInstance();
    await auditService.createLog({
      action,
      resourceType,
      resourceId,
      details,
      userId: user.id,
      userName: user.name || user.username || 'Usuário'
    });
  };

  // Backward compatibility functions that delegate to the new loggers
  const logDashboardAction = (action: string, resourceId: string, details?: Record<string, any>) => {
    loggers.dashboard.logAction(action, resourceId, details);
  };

  const logChannelAction = (action: string, channelId: string, details?: Record<string, any>) => {
    loggers.channel.logAction(action, channelId, details);
  };

  const logConversationAction = (action: string, conversationId: string, details?: Record<string, any>) => {
    loggers.conversation.logAction(action, conversationId, details);
  };

  const logNavigationAction = (action: string, section: string, details?: Record<string, any>) => {
    loggers.navigation.logAction(action, section, details);
  };

  const logUIAction = (action: string, component: string, details?: Record<string, any>) => {
    loggers.ui.logAction(action, component, details);
  };

  const logProfileAction = (action: string, details?: Record<string, any>) => {
    loggers.profile.logAction(action, details);
  };

  const logCredentialsAction = (action: string, details?: Record<string, any>) => {
    loggers.credentials.logAction(action, details);
  };

  const logNotificationAction = (action: string, details?: Record<string, any>) => {
    loggers.notifications.logAction(action, details);
  };

  return {
    createAuditLog,
    logDashboardAction,
    logChannelAction,
    logConversationAction,
    logNavigationAction,
    logUIAction,
    logProfileAction,
    logCredentialsAction,
    logNotificationAction,
    // Expose the new structured loggers for advanced usage
    loggers
  };
};
