export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ballot_entries: {
        Row: {
          ballot_id: string
          competitor_id: string
          created_at: string | null
          feedback: string | null
          id: string
          rank: number | null
          score: number | null
        }
        Insert: {
          ballot_id: string
          competitor_id: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          rank?: number | null
          score?: number | null
        }
        Update: {
          ballot_id?: string
          competitor_id?: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          rank?: number | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ballot_entries_ballot_id_fkey"
            columns: ["ballot_id"]
            isOneToOne: false
            referencedRelation: "ballots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ballot_entries_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      ballots: {
        Row: {
          created_at: string | null
          format: string | null
          id: string
          judge_id: string
          notes: string | null
          round_number: number | null
          session_name: string | null
          status: string | null
          submitted_at: string | null
          tournament_name: string | null
        }
        Insert: {
          created_at?: string | null
          format?: string | null
          id?: string
          judge_id: string
          notes?: string | null
          round_number?: number | null
          session_name?: string | null
          status?: string | null
          submitted_at?: string | null
          tournament_name?: string | null
        }
        Update: {
          created_at?: string | null
          format?: string | null
          id?: string
          judge_id?: string
          notes?: string | null
          round_number?: number | null
          session_name?: string | null
          status?: string | null
          submitted_at?: string | null
          tournament_name?: string | null
        }
        Relationships: []
      }
      competitors: {
        Row: {
          created_at: string | null
          id: string
          is_guest: boolean | null
          name: string
          school: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_guest?: boolean | null
          name: string
          school?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_guest?: boolean | null
          name?: string
          school?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      congress_legislation: {
        Row: {
          created_at: string | null
          id: string
          legislation_type: string | null
          session_id: string
          sort_order: number | null
          title: string
          vote_outcome: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          legislation_type?: string | null
          session_id: string
          sort_order?: number | null
          title: string
          vote_outcome?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          legislation_type?: string | null
          session_id?: string
          sort_order?: number | null
          title?: string
          vote_outcome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "congress_legislation_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "congress_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      congress_session_students: {
        Row: {
          competitor_id: string
          created_at: string | null
          final_rank: number | null
          id: string
          is_presiding_officer: boolean | null
          po_comments: string | null
          po_score: number | null
          session_id: string
        }
        Insert: {
          competitor_id: string
          created_at?: string | null
          final_rank?: number | null
          id?: string
          is_presiding_officer?: boolean | null
          po_comments?: string | null
          po_score?: number | null
          session_id: string
        }
        Update: {
          competitor_id?: string
          created_at?: string | null
          final_rank?: number | null
          id?: string
          is_presiding_officer?: boolean | null
          po_comments?: string | null
          po_score?: number | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "congress_session_students_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "congress_session_students_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "congress_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      congress_sessions: {
        Row: {
          chamber_number: string | null
          created_at: string | null
          id: string
          judge_id: string
          notes: string | null
          questioning_format: string | null
          round_number: number | null
          session_name: string | null
          speaking_order_method: string | null
          status: string | null
          submitted_at: string | null
          tournament_name: string | null
        }
        Insert: {
          chamber_number?: string | null
          created_at?: string | null
          id?: string
          judge_id: string
          notes?: string | null
          questioning_format?: string | null
          round_number?: number | null
          session_name?: string | null
          speaking_order_method?: string | null
          status?: string | null
          submitted_at?: string | null
          tournament_name?: string | null
        }
        Update: {
          chamber_number?: string | null
          created_at?: string | null
          id?: string
          judge_id?: string
          notes?: string | null
          questioning_format?: string | null
          round_number?: number | null
          session_name?: string | null
          speaking_order_method?: string | null
          status?: string | null
          submitted_at?: string | null
          tournament_name?: string | null
        }
        Relationships: []
      }
      congress_speeches: {
        Row: {
          created_at: string | null
          id: string
          legislation_id: string | null
          notes: string | null
          questioning_score: number | null
          session_id: string
          side: string | null
          speech_order: number | null
          speech_score: number | null
          student_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          legislation_id?: string | null
          notes?: string | null
          questioning_score?: number | null
          session_id: string
          side?: string | null
          speech_order?: number | null
          speech_score?: number | null
          student_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          legislation_id?: string | null
          notes?: string | null
          questioning_score?: number | null
          session_id?: string
          side?: string | null
          speech_order?: number | null
          speech_score?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "congress_speeches_legislation_id_fkey"
            columns: ["legislation_id"]
            isOneToOne: false
            referencedRelation: "congress_legislation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "congress_speeches_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "congress_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "congress_speeches_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "congress_session_students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          school: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          school?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          school?: string | null
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          created_at: string | null
          created_by: string | null
          end_date: string | null
          id: string
          location: string | null
          name: string
          start_date: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name: string
          start_date?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name?: string
          start_date?: string | null
          status?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      initialize_user_profile: {
        Args: { _email: string; _full_name: string; _role?: string }
        Returns: undefined
      }
      search_students: {
        Args: { _limit?: number; _query: string }
        Returns: {
          email: string | null
          full_name: string | null
          id: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "judge" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "judge", "student"],
    },
  },
} as const
