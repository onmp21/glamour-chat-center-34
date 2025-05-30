
import { supabase } from '@/integrations/supabase/client';
import { TableName } from '@/utils/channelMapping';

export abstract class BaseRepository<T = any> {
  protected tableName: TableName;

  constructor(tableName: TableName) {
    this.tableName = tableName;
  }

  get table(): TableName {
    return this.tableName;
  }

  // Getter público para acessar o nome da tabela
  get tableNamePublic(): TableName {
    return this.tableName;
  }

  async findAll(): Promise<T[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error(`❌ [REPOSITORY] Error fetching from ${this.tableName}:`, error);
        throw error;
      }

      return (data || []) as T[];
    } catch (err) {
      console.error(`❌ [REPOSITORY] Failed to fetch from ${this.tableName}:`, err);
      throw err;
    }
  }

  async findBySessionId(sessionId: string): Promise<T[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('session_id', sessionId)
        .order('id', { ascending: true });

      if (error) {
        console.error(`❌ [REPOSITORY] Error fetching by session_id from ${this.tableName}:`, error);
        throw error;
      }

      return (data || []) as T[];
    } catch (err) {
      console.error(`❌ [REPOSITORY] Failed to fetch by session_id from ${this.tableName}:`, err);
      throw err;
    }
  }

  async create(data: any): Promise<T> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error(`❌ [REPOSITORY] Error inserting into ${this.tableName}:`, error);
        throw error;
      }

      return result as T;
    } catch (err) {
      console.error(`❌ [REPOSITORY] Failed to insert into ${this.tableName}:`, err);
      throw err;
    }
  }

  async update(id: number, data: any): Promise<T> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`❌ [REPOSITORY] Error updating ${this.tableName}:`, error);
        throw error;
      }

      return result as T;
    } catch (err) {
      console.error(`❌ [REPOSITORY] Failed to update ${this.tableName}:`, err);
      throw err;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`❌ [REPOSITORY] Error deleting from ${this.tableName}:`, error);
        throw error;
      }
    } catch (err) {
      console.error(`❌ [REPOSITORY] Failed to delete from ${this.tableName}:`, err);
      throw err;
    }
  }

  createRealtimeChannel(channelSuffix: string = '') {
    const channelName = `realtime-${this.tableName}${channelSuffix}`;
    console.log(`🔴 Creating realtime channel: ${channelName}`);
    
    return supabase.channel(channelName);
  }
}
