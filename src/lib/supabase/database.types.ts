/**
 * Database types for the Milaan Postgres schema (Spec §8).
 *
 * NOTE: hand-authored to match supabase/migrations/20260615000001_init.sql.
 * The Supabase CLI (v2.106) gates `gen types` behind `supabase login` even for
 * local DBs, so until you've logged in this file is the source of truth.
 *
 * To regenerate from the live local schema once authenticated:
 *   supabase gen types typescript --local > src/lib/supabase/database.types.ts
 */

export type UserStatus = 'onboarding' | 'verified' | 'suspended';
export type VerifStatus = 'pending' | 'passed' | 'failed';
export type MatchStatus = 'active' | 'pending' | 'archived' | 'blocked';
export type ModStatus = 'pending' | 'approved' | 'rejected';
export type SwipeDirection = 'like' | 'pass' | 'superlike';
export type ReportStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed';

type Timestamptz = string;

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          phone: string | null;
          status: UserStatus;
          masked_aadhaar: string | null;
          aadhaar_hash: string | null;
          dob: string | null;
          gender: string | null;
          last_active: Timestamptz | null;
          created_at: Timestamptz;
        };
        Insert: {
          id: string;
          phone?: string | null;
          status?: UserStatus;
          masked_aadhaar?: string | null;
          aadhaar_hash?: string | null;
          dob?: string | null;
          gender?: string | null;
          last_active?: Timestamptz | null;
          created_at?: Timestamptz;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
        Relationships: [];
      };
      verification: {
        Row: {
          user_id: string;
          identity_status: VerifStatus;
          liveness_status: VerifStatus;
          face_match_score: number | null;
          face_template: string | null;
          completed_at: Timestamptz | null;
        };
        Insert: {
          user_id: string;
          identity_status?: VerifStatus;
          liveness_status?: VerifStatus;
          face_match_score?: number | null;
          face_template?: string | null;
          completed_at?: Timestamptz | null;
        };
        Update: Partial<Database['public']['Tables']['verification']['Insert']>;
        Relationships: [];
      };
      profiles: {
        Row: {
          user_id: string;
          name: string;
          bio: string | null;
          looking_for: string | null;
          interests: string[];
          values: Record<string, unknown>;
          instagram: string | null;
          linkedin: string | null;
          snapchat: string | null;
          location_lat: number | null;
          location_lng: number | null;
          preferences: Record<string, unknown>;
          updated_at: Timestamptz;
        };
        Insert: {
          user_id: string;
          name: string;
          bio?: string | null;
          looking_for?: string | null;
          interests?: string[];
          values?: Record<string, unknown>;
          instagram?: string | null;
          linkedin?: string | null;
          snapchat?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          preferences?: Record<string, unknown>;
          updated_at?: Timestamptz;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      photos: {
        Row: {
          id: string;
          user_id: string;
          storage_path: string;
          face_match_score: number | null;
          moderation_status: ModStatus;
          order: number;
          created_at: Timestamptz;
        };
        Insert: {
          id?: string;
          user_id: string;
          storage_path: string;
          face_match_score?: number | null;
          moderation_status?: ModStatus;
          order?: number;
          created_at?: Timestamptz;
        };
        Update: Partial<Database['public']['Tables']['photos']['Insert']>;
        Relationships: [];
      };
      swipes: {
        Row: {
          id: string;
          swiper_id: string;
          target_id: string;
          direction: SwipeDirection;
          created_at: Timestamptz;
        };
        Insert: {
          id?: string;
          swiper_id: string;
          target_id: string;
          direction: SwipeDirection;
          created_at?: Timestamptz;
        };
        Update: Partial<Database['public']['Tables']['swipes']['Insert']>;
        Relationships: [];
      };
      matches: {
        Row: {
          id: string;
          user_a: string;
          user_b: string;
          status: MatchStatus;
          created_at: Timestamptz;
          last_activity_at: Timestamptz;
        };
        Insert: {
          id?: string;
          user_a: string;
          user_b: string;
          status?: MatchStatus;
          created_at?: Timestamptz;
          last_activity_at?: Timestamptz;
        };
        Update: Partial<Database['public']['Tables']['matches']['Insert']>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          match_id: string;
          sender_id: string;
          body: string | null;
          image_path: string | null;
          created_at: Timestamptz;
          read_at: Timestamptz | null;
        };
        Insert: {
          id?: string;
          match_id: string;
          sender_id: string;
          body?: string | null;
          image_path?: string | null;
          created_at?: Timestamptz;
          read_at?: Timestamptz | null;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
        Relationships: [];
      };
      scores: {
        Row: {
          user_id: string;
          quality_score: number;
          components: Record<string, unknown>;
          exposure_count: number;
          decay_factor: number;
          updated_at: Timestamptz;
        };
        Insert: {
          user_id: string;
          quality_score?: number;
          components?: Record<string, unknown>;
          exposure_count?: number;
          decay_factor?: number;
          updated_at?: Timestamptz;
        };
        Update: Partial<Database['public']['Tables']['scores']['Insert']>;
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          reported_id: string;
          reason: string;
          details: string | null;
          status: ReportStatus;
          created_at: Timestamptz;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          reported_id: string;
          reason: string;
          details?: string | null;
          status?: ReportStatus;
          created_at?: Timestamptz;
        };
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
        Relationships: [];
      };
      blocks: {
        Row: { blocker_id: string; blocked_id: string; created_at: Timestamptz };
        Insert: { blocker_id: string; blocked_id: string; created_at?: Timestamptz };
        Update: Partial<Database['public']['Tables']['blocks']['Insert']>;
        Relationships: [];
      };
    };
    Views: {
      public_profiles: {
        Row: {
          user_id: string | null;
          name: string | null;
          bio: string | null;
          looking_for: string | null;
          interests: string[] | null;
          instagram: string | null;
          linkedin: string | null;
          snapchat: string | null;
          gender: string | null;
          age: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_match_participant: { Args: { m_id: string }; Returns: boolean };
    };
    Enums: {
      user_status: UserStatus;
      verif_status: VerifStatus;
      match_status: MatchStatus;
      mod_status: ModStatus;
      swipe_direction: SwipeDirection;
      report_status: ReportStatus;
    };
  };
}
