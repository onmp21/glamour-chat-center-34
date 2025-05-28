
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
      const detailsWithContext = {
        ...details,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        current_url: window.location.href,
        session_info: {
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          viewport: `${window.innerWidth}x${window.innerHeight}`
        }
      };

      await createAuditLog({
        user_name: user.name,
        action,
        resource_type: resourceType,
        user_id: user.id,
        resource_id: resourceId,
        details: detailsWithContext
      });

      console.log(`📋 [AUDIT] ${action} logged for ${resourceType}`, detailsWithContext);
    } catch (error) {
      console.error('❌ [AUDIT] Erro ao criar log de auditoria:', error);
    }
  };

  return {
    // Logs de usuário
    logUserAction: (action: string, targetUserId?: string, details?: any) =>
      logAction(action, 'user', targetUserId, details),
    
    // Logs de perfil
    logProfileAction: (action: string, details?: any) =>
      logAction(action, 'profile', user?.id, details),
    
    // Logs de credenciais
    logCredentialsAction: (action: string, details?: any) =>
      logAction(action, 'credentials', user?.id, details),
    
    // Logs de notificações
    logNotificationAction: (action: string, details?: any) =>
      logAction(action, 'notifications', user?.id, details),
    
    // Logs de autenticação
    logAuthAction: (action: string, details?: any) =>
      logAction(action, 'auth', undefined, details),
    
    // Logs de sistema
    logSystemAction: (action: string, details?: any) =>
      logAction(action, 'system', undefined, details),

    // Logs de canais
    logChannelAction: (action: string, channelId?: string, details?: any) =>
      logAction(action, 'channel', channelId, details),

    // Logs de mensagens
    logMessageAction: (action: string, messageId?: string, details?: any) =>
      logAction(action, 'message', messageId, details),

    // NOVOS LOGS PARA AUDITORIA COMPLETA:

    // Logs de navegação
    logNavigationAction: (action: string, route?: string, details?: any) =>
      logAction(action, 'navigation', route, details),

    // Logs de interação com UI
    logUIAction: (action: string, component?: string, details?: any) =>
      logAction(action, 'ui_interaction', component, details),

    // Logs de dashboard
    logDashboardAction: (action: string, section?: string, details?: any) =>
      logAction(action, 'dashboard', section, details),

    // Logs de conversas
    logConversationAction: (action: string, conversationId?: string, details?: any) =>
      logAction(action, 'conversation', conversationId, details),

    // Logs de refresh/atualização
    logRefreshAction: (action: string, target?: string, details?: any) =>
      logAction(action, 'data_refresh', target, details),

    // Logs de configurações
    logSettingsAction: (action: string, setting?: string, details?: any) =>
      logAction(action, 'settings', setting, details),

    // Logs de CRUD
    logCRUDAction: (action: string, entity?: string, details?: any) =>
      logAction(action, 'crud_operation', entity, details),

    // Logs de filtros e pesquisas
    logSearchAction: (action: string, query?: string, details?: any) =>
      logAction(action, 'search', query, details),

    // Logs de exames
    logExamAction: (action: string, examId?: string, details?: any) =>
      logAction(action, 'exam', examId, details)
  };
};
