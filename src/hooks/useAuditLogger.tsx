
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAuditLogger = () => {
  const { user } = useAuth();

  const createAuditLog = async (
    action: string,
    resourceType: string,
    resourceId: string,
    details?: Record<string, any>
  ) => {
    // Só criar log se o usuário estiver autenticado
    if (!user?.id) {
      console.warn('🚫 [AUDIT] Tentativa de log sem usuário autenticado:', { action, resourceType });
      return;
    }

    try {
      const auditData = {
        user_id: user.id,
        user_name: user.name || user.username || 'Usuário',
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: {
          ...details,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          current_url: window.location.href,
          session_info: {
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`
          }
        }
      };

      console.log('📋 [AUDIT] Criando log:', auditData);

      const { data, error } = await supabase
        .from('audit_logs')
        .insert([auditData])
        .select()
        .single();

      if (error) {
        console.error('❌ [AUDIT] Erro ao criar log:', error);
        return;
      }

      console.log('✅ [AUDIT] Log criado com sucesso:', data);
    } catch (error) {
      console.error('❌ [AUDIT] Erro inesperado:', error);
    }
  };

  // Logs específicos do dashboard
  const logDashboardAction = (action: string, resourceId: string, details?: Record<string, any>) => {
    if (user?.id) {
      createAuditLog(action, 'dashboard', resourceId, details);
    }
  };

  // Logs específicos de canais
  const logChannelAction = (action: string, channelId: string, details?: Record<string, any>) => {
    if (user?.id) {
      createAuditLog(action, 'channel', channelId, details);
    }
  };

  // Logs específicos de conversas
  const logConversationAction = (action: string, conversationId: string, details?: Record<string, any>) => {
    if (user?.id) {
      createAuditLog(action, 'conversation', conversationId, details);
    }
  };

  // Logs específicos de navegação
  const logNavigationAction = (action: string, section: string, details?: Record<string, any>) => {
    if (user?.id) {
      createAuditLog(action, 'navigation', section, details);
    }
  };

  // Logs específicos de UI
  const logUIAction = (action: string, component: string, details?: Record<string, any>) => {
    if (user?.id) {
      createAuditLog(action, 'ui_interaction', component, details);
    }
  };

  return {
    createAuditLog,
    logDashboardAction,
    logChannelAction,
    logConversationAction,
    logNavigationAction,
    logUIAction
  };
};
