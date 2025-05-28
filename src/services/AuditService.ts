
import { supabase } from '@/integrations/supabase/client';

export interface AuditLogData {
  action: string;
  resourceType: string;
  resourceId: string;
  details?: Record<string, any>;
  userId: string;
  userName: string;
}

export interface SessionInfo {
  timestamp: string;
  user_agent: string;
  current_url: string;
  session_info: {
    screen_resolution: string;
    viewport: string;
  };
}

export class AuditService {
  private static instance: AuditService;

  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  private generateSessionInfo(): SessionInfo {
    return {
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      current_url: window.location.href,
      session_info: {
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`
      }
    };
  }

  private enrichAuditData(data: AuditLogData): any {
    return {
      user_id: data.userId,
      user_name: data.userName,
      action: data.action,
      resource_type: data.resourceType,
      resource_id: data.resourceId,
      details: {
        ...data.details,
        ...this.generateSessionInfo()
      }
    };
  }

  async createLog(data: AuditLogData): Promise<void> {
    try {
      const enrichedData = this.enrichAuditData(data);
      
      console.log('📋 [AUDIT_SERVICE] Creating log:', enrichedData);

      const { data: result, error } = await supabase
        .from('audit_logs')
        .insert([enrichedData])
        .select()
        .single();

      if (error) {
        console.error('❌ [AUDIT_SERVICE] Error creating log:', error);
        return;
      }

      console.log('✅ [AUDIT_SERVICE] Log created successfully:', result);
    } catch (error) {
      console.error('❌ [AUDIT_SERVICE] Unexpected error:', error);
    }
  }
}
