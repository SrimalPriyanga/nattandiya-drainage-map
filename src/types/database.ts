import type { ReportCategory } from './report'

/**
 * Hand-written equivalent of `supabase gen types typescript` for the tables this app uses.
 * Keep it in sync with supabase/migrations (or replace it with generated types).
 */
export type Database = {
  public: {
    Tables: {
      drainage_reports: {
        Row: {
          id: string
          created_at: string
          latitude: number
          longitude: number
          category: string
          description: string
          status: string
        }
        /** The anon role may only insert these columns (column-level GRANT in the migration). */
        Insert: {
          latitude: number
          longitude: number
          category: ReportCategory
          description: string
        }
        /** Citizens never update reports; status changes happen with service-role access. */
        Update: { [_ in never]: never }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
