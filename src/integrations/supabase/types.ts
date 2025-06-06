export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      america_dourada_conversas: {
        Row: {
          id: number
          is_read: boolean | null
          mensagemtype: string | null
          message: string
          nome_do_contato: string | null
          read_at: string | null
          session_id: string
          tipo_remetente: string | null
        }
        Insert: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message: string
          nome_do_contato?: string | null
          read_at?: string | null
          session_id: string
          tipo_remetente?: string | null
        }
        Update: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message?: string
          nome_do_contato?: string | null
          read_at?: string | null
          session_id?: string
          tipo_remetente?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
          user_name: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
          user_name: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      canarana_conversas: {
        Row: {
          id: number
          is_read: boolean | null
          mensagemtype: string | null
          message: string
          nome_do_contato: string | null
          read_at: string | null
          session_id: string
          tipo_remetente: string | null
        }
        Insert: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message: string
          nome_do_contato?: string | null
          read_at?: string | null
          session_id: string
          tipo_remetente?: string | null
        }
        Update: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message?: string
          nome_do_contato?: string | null
          read_at?: string | null
          session_id?: string
          tipo_remetente?: string | null
        }
        Relationships: []
      }
      channels: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_tags: {
        Row: {
          applied_at: string | null
          contact_phone: string
          expires_at: string | null
          id: string
          is_active: boolean
          tag_id: string | null
        }
        Insert: {
          applied_at?: string | null
          contact_phone: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          tag_id?: string | null
        }
        Update: {
          applied_at?: string | null
          contact_phone?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      exams: {
        Row: {
          appointment_date: string
          city: string
          created_at: string
          exam_type: string
          id: string
          instagram: string | null
          observations: string | null
          patient_name: string
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          city: string
          created_at?: string
          exam_type?: string
          id?: string
          instagram?: string | null
          observations?: string | null
          patient_name: string
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          city?: string
          created_at?: string
          exam_type?: string
          id?: string
          instagram?: string | null
          observations?: string | null
          patient_name?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      gerente_externo_conversas: {
        Row: {
          id: number
          is_read: boolean | null
          mensagemtype: string | null
          message: string
          Nome_do_contato: string | null
          read_at: string | null
          session_id: string
          tipo_remetente: string | null
        }
        Insert: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message: string
          Nome_do_contato?: string | null
          read_at?: string | null
          session_id: string
          tipo_remetente?: string | null
        }
        Update: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message?: string
          Nome_do_contato?: string | null
          read_at?: string | null
          session_id?: string
          tipo_remetente?: string | null
        }
        Relationships: []
      }
      gerente_lojas_conversas: {
        Row: {
          id: number
          is_read: boolean | null
          mensagemtype: string | null
          message: string
          nome_do_contato: string | null
          read_at: string | null
          session_id: string
          tipo_remetente: string | null
        }
        Insert: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message: string
          nome_do_contato?: string | null
          read_at?: string | null
          session_id: string
          tipo_remetente?: string | null
        }
        Update: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message?: string
          nome_do_contato?: string | null
          read_at?: string | null
          session_id?: string
          tipo_remetente?: string | null
        }
        Relationships: []
      }
      joao_dourado_conversas: {
        Row: {
          id: number
          is_read: boolean | null
          mensagemtype: string | null
          message: string
          nome_do_contato: string | null
          read_at: string | null
          session_id: string
          tipo_remetente: string | null
        }
        Insert: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message: string
          nome_do_contato?: string | null
          read_at?: string | null
          session_id: string
          tipo_remetente?: string | null
        }
        Update: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message?: string
          nome_do_contato?: string | null
          read_at?: string | null
          session_id?: string
          tipo_remetente?: string | null
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      pedro_conversas: {
        Row: {
          id: number
          is_read: boolean | null
          mensagemtype: string | null
          message: string
          nome_do_contato: string | null
          read_at: string | null
          session_id: string
          tipo_remetente: string | null
        }
        Insert: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message: string
          nome_do_contato?: string | null
          read_at?: string | null
          session_id: string
          tipo_remetente?: string | null
        }
        Update: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message?: string
          nome_do_contato?: string | null
          read_at?: string | null
          session_id?: string
          tipo_remetente?: string | null
        }
        Relationships: []
      }
      souto_soares_conversas: {
        Row: {
          id: number
          is_read: boolean | null
          mensagemtype: string | null
          message: string
          nome_do_contato: string | null
          read_at: string | null
          session_id: string
          tipo_remetente: string | null
        }
        Insert: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message: string
          nome_do_contato?: string | null
          read_at?: string | null
          session_id: string
          tipo_remetente?: string | null
        }
        Update: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message?: string
          nome_do_contato?: string | null
          read_at?: string | null
          session_id?: string
          tipo_remetente?: string | null
        }
        Relationships: []
      }
      tag_configurations: {
        Row: {
          color: string
          conditions: Json
          created_at: string | null
          id: string
          is_active: boolean
          is_automatic: boolean
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string
          conditions?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean
          is_automatic?: boolean
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          conditions?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean
          is_automatic?: boolean
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          assigned_cities: string[] | null
          assigned_tabs: string[] | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          password_hash: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          username: string
        }
        Insert: {
          assigned_cities?: string[] | null
          assigned_tabs?: string[] | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          password_hash: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username: string
        }
        Update: {
          assigned_cities?: string[] | null
          assigned_tabs?: string[] | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          password_hash?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      yelena_ai_conversas: {
        Row: {
          id: number
          is_read: boolean | null
          mensagemtype: string | null
          message: string
          Nome_do_contato: string | null
          read_at: string | null
          session_id: string
          tipo_remetente: string | null
        }
        Insert: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message: string
          Nome_do_contato?: string | null
          read_at?: string | null
          session_id: string
          tipo_remetente?: string | null
        }
        Update: {
          id?: number
          is_read?: boolean | null
          mensagemtype?: string | null
          message?: string
          Nome_do_contato?: string | null
          read_at?: string | null
          session_id?: string
          tipo_remetente?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      count_unread_messages: {
        Args: { table_name: string; p_session_id: string }
        Returns: number
      }
      create_audit_log: {
        Args: {
          p_user_name: string
          p_action: string
          p_resource_type: string
          p_user_id?: string
          p_resource_id?: string
          p_details?: Json
        }
        Returns: string
      }
      create_user_with_hash: {
        Args: {
          p_username: string
          p_password: string
          p_name: string
          p_role: Database["public"]["Enums"]["user_role"]
          p_assigned_tabs: string[]
          p_assigned_cities: string[]
        }
        Returns: string
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      mark_messages_as_read: {
        Args: { table_name: string; p_session_id: string }
        Returns: undefined
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      update_user_with_hash: {
        Args: {
          p_user_id: string
          p_username?: string
          p_password?: string
          p_name?: string
          p_role?: Database["public"]["Enums"]["user_role"]
          p_assigned_tabs?: string[]
          p_assigned_cities?: string[]
        }
        Returns: undefined
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      verify_user_credentials: {
        Args: { input_username: string; input_password: string }
        Returns: {
          user_id: string
          user_username: string
          user_name: string
          user_role: Database["public"]["Enums"]["user_role"]
          user_assigned_tabs: string[]
          user_assigned_cities: string[]
        }[]
      }
    }
    Enums: {
      user_role: "admin" | "manager_external" | "manager_store" | "salesperson"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "manager_external", "manager_store", "salesperson"],
    },
  },
} as const
