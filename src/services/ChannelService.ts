
import { TableName, getTableNameForChannel } from '@/utils/channelMapping';
import { supabase } from '@/integrations/supabase/client';

export interface ChannelServiceConfig {
  channelId: string;
  tableName: TableName;
}

export class ChannelService {
  private config: ChannelServiceConfig;

  constructor(channelId: string) {
    this.config = {
      channelId,
      tableName: getTableNameForChannel(channelId)
    };
  }

  getTableName(): TableName {
    return this.config.tableName;
  }

  getChannelId(): string {
    return this.config.channelId;
  }

  async fetchMessages() {
    console.log(`🔍 Fetching messages from table: ${this.config.tableName}`);
    
    const { data, error } = await supabase
      .from(this.config.tableName)
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error(`❌ Error fetching from ${this.config.tableName}:`, error);
      throw error;
    }

    console.log(`✅ Fetched ${data?.length || 0} messages from ${this.config.tableName}`);
    return data || [];
  }

  async insertMessage(sessionId: string, message: any) {
    console.log(`💾 Inserting message into ${this.config.tableName}`);
    
    const { error } = await supabase
      .from(this.config.tableName)
      .insert({
        session_id: sessionId,
        message: message
      });

    if (error) {
      console.error(`❌ Error inserting into ${this.config.tableName}:`, error);
      throw error;
    }

    console.log(`✅ Message inserted into ${this.config.tableName}`);
  }

  createRealtimeChannel(channelSuffix: string = '') {
    const channelName = `realtime-${this.config.channelId}-${this.config.tableName}${channelSuffix}`;
    console.log(`🔴 Creating realtime channel: ${channelName}`);
    
    return supabase.channel(channelName);
  }
}
