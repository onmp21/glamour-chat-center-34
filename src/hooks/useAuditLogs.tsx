
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  user_id: string | null;
  user_name: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = async (page = 0, limit = 50) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);

      if (fetchError) {
        console.error('Erro ao carregar logs de auditoria:', fetchError);
        setError('Erro ao carregar logs de auditoria');
        return;
      }

      // Converter os dados para o tipo correto
      const formattedLogs: AuditLog[] = (data || []).map(log => ({
        ...log,
        ip_address: log.ip_address ? String(log.ip_address) : null
      }));

      setLogs(formattedLogs);
    } catch (err) {
      console.error('Erro ao carregar logs:', err);
      setError('Erro inesperado ao carregar logs');
    } finally {
      setLoading(false);
    }
  };

  const createAuditLog = async (logData: {
    user_name: string;
    action: string;
    resource_type: string;
    user_id?: string;
    resource_id?: string;
    details?: any;
  }) => {
    try {
      const { error } = await supabase
        .rpc('create_audit_log', {
          p_user_name: logData.user_name,
          p_action: logData.action,
          p_resource_type: logData.resource_type,
          p_user_id: logData.user_id || null,
          p_resource_id: logData.resource_id || null,
          p_details: logData.details || null
        });

      if (error) {
        console.error('Erro ao criar log de auditoria:', error);
        throw error;
      }

      console.log('Log de auditoria criado:', logData);
    } catch (err) {
      console.error('Erro ao criar log de auditoria:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return {
    logs,
    loading,
    error,
    loadLogs,
    createAuditLog
  };
};
