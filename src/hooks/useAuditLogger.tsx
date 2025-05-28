
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuditService } from '@/services/AuditService';
import { useAuditLoggers } from './useAuditLoggers';

export const useAuditLogger = () => {
  const { user } = useAuth();
  const loggers = useAuditLoggers();

  const createAuditLog = useCallback(async (
    action: string,
    resourceType: string,
    resourceId: string,
    details?: Record<string, any>
  ) => {
    if (!user?.id) {
      console.warn('🚫 [AUDIT] Tentativa de log sem usuário autenticado:', { action, resourceType });
      return;
    }

    try {
      const auditService = AuditService.getInstance();
      await auditService.createLog({
        action,
        resourceType,
        resourceId,
        details,
        userId: user.id,
        userName: user.name || user.username || 'Usuário'
      });
    } catch (error) {
      console.error('❌ [AUDIT] Erro ao criar log:', error);
    }
  }, [user]);

  // Backward compatibility functions that delegate to the new loggers
  const logDashboardAction = useCallback((action: string, resourceId: string, details?: Record<string, any>) => {
    if (loggers.dashboard) {
      loggers.dashboard.logAction(action, resourceId, details);
    }
  }, [loggers.dashboard]);

  const logChannelAction = useCallback((action: string, channelId: string, details?: Record<string, any>) => {
    if (loggers.channel) {
      loggers.channel.logAction(action, channelId, details);
    }
  }, [loggers.channel]);

  const logConversationAction = useCallback((action: string, conversationId: string, details?: Record<string, any>) => {
    if (loggers.conversation) {
      loggers.conversation.logAction(action, conversationId, details);
    }
  }, [loggers.conversation]);

  const logNavigationAction = useCallback((action: string, section: string, details?: Record<string, any>) => {
    if (loggers.navigation) {
      loggers.navigation.logAction(action, section, details);
    }
  }, [loggers.navigation]);

  const logUIAction = useCallback((action: string, component: string, details?: Record<string, any>) => {
    if (loggers.ui) {
      loggers.ui.logAction(action, component, details);
    }
  }, [loggers.ui]);

  const logProfileAction = useCallback((action: string, details?: Record<string, any>) => {
    if (loggers.profile) {
      loggers.profile.logAction(action, details);
    }
  }, [loggers.profile]);

  const logCredentialsAction = useCallback((action: string, details?: Record<string, any>) => {
    if (loggers.credentials) {
      loggers.credentials.logAction(action, details);
    }
  }, [loggers.credentials]);

  const logNotificationAction = useCallback((action: string, details?: Record<string, any>) => {
    if (loggers.notifications) {
      loggers.notifications.logAction(action, details);
    }
  }, [loggers.notifications]);

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
