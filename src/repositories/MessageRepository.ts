import { BaseRepository } from './BaseRepository';
import { RawMessage } from '@/utils/MessageProcessor';
import { TableName } from '@/utils/channelMapping';

export class MessageRepository extends BaseRepository<RawMessage> {
  constructor(tableName: TableName) {
    super(tableName);
  }

  async insertMessage(sessionId: string, message: string, contactName?: string): Promise<RawMessage> {
    const insertData = {
      session_id: sessionId,
      message: message,
      // Corrected field name to lowercase 'n'
      nome_do_contato: contactName,
      read_at: new Date().toISOString()
    };

    console.log(`💾 [MESSAGE_REPOSITORY] Inserting message into ${this.tableName}`);
    
    return await this.create(insertData);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<RawMessage[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*') // Ensure nome_do_contato is selected
      .ilike('session_id', `%${phoneNumber}%`)
      .order('id', { ascending: true });

    if (error) {
      console.error(`❌ [MESSAGE_REPOSITORY] Error fetching by phone from ${this.tableName}:`, error);
      throw error;
    }

    // Ensure the returned data includes nome_do_contato
    return data || [];
  }

  async markAsRead(sessionId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('session_id', sessionId)
      .eq('is_read', false);

    if (error) {
      console.error(`❌ [MESSAGE_REPOSITORY] Error marking messages as read:`, error);
      throw error;
    }
  }

  // Overriding findAll to explicitly select nome_do_contato
  async findAll(): Promise<RawMessage[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('id, session_id, message, nome_do_contato, created_at, read_at, is_read') // Explicitly select fields
      .order('id', { ascending: true });

    if (error) {
      console.error(`❌ [MESSAGE_REPOSITORY] Error fetching all from ${this.tableName}:`, error);
      throw error;
    }
    return data || [];
  }

  private get supabase() {
    return require('@/integrations/supabase/client').supabase;
  }
}

