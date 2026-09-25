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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applicant_id: string
          applied_at: string
          cover_note: string | null
          id: string
          job_id: string
          resume_path: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          applicant_id: string
          applied_at?: string
          cover_note?: string | null
          id?: string
          job_id: string
          resume_path?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          applied_at?: string
          cover_note?: string | null
          id?: string
          job_id?: string
          resume_path?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          employee_count: string | null
          id: string
          industry: string | null
          location: string | null
          logo_path: string | null
          name: string
          owner_id: string
          updated_at: string
          verified: boolean
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          employee_count?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_path?: string | null
          name: string
          owner_id: string
          updated_at?: string
          verified?: boolean
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          employee_count?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_path?: string | null
          name?: string
          owner_id?: string
          updated_at?: string
          verified?: boolean
          website?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          active: boolean
          base_salary: number
          company_id: string
          created_at: string
          department: string
          designation: string
          employee_code: string
          id: string
          joining_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          base_salary: number
          company_id: string
          created_at?: string
          department: string
          designation: string
          employee_code: string
          id?: string
          joining_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          base_salary?: number
          company_id?: string
          created_at?: string
          department?: string
          designation?: string
          employee_code?: string
          id?: string
          joining_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      job_categories: {
        Row: {
          created_at: string
          icon: string
          id: string
          labels: Json
          slug: string
        }
        Insert: {
          created_at?: string
          icon: string
          id?: string
          labels: Json
          slug: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          labels?: Json
          slug?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          benefits: string[]
          category_id: string | null
          company_id: string
          created_at: string
          description: string
          education: string | null
          experience: string | null
          id: string
          job_type: string
          location: string
          max_salary: number | null
          min_salary: number | null
          published_at: string | null
          requirements: string[]
          responsibilities: string[]
          salary_type: string
          skills: string[]
          status: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at: string
          vacancies: number
          work_mode: string
        }
        Insert: {
          benefits?: string[]
          category_id?: string | null
          company_id: string
          created_at?: string
          description: string
          education?: string | null
          experience?: string | null
          id?: string
          job_type: string
          location: string
          max_salary?: number | null
          min_salary?: number | null
          published_at?: string | null
          requirements?: string[]
          responsibilities?: string[]
          salary_type?: string
          skills?: string[]
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at?: string
          vacancies?: number
          work_mode: string
        }
        Update: {
          benefits?: string[]
          category_id?: string | null
          company_id?: string
          created_at?: string
          description?: string
          education?: string | null
          experience?: string | null
          id?: string
          job_type?: string
          location?: string
          max_salary?: number | null
          min_salary?: number | null
          published_at?: string | null
          requirements?: string[]
          responsibilities?: string[]
          salary_type?: string
          skills?: string[]
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          updated_at?: string
          vacancies?: number
          work_mode?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "job_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          category: string
          created_at: string
          destination: string | null
          id: string
          is_read: boolean
          message: string
          recipient_id: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          destination?: string | null
          id?: string
          is_read?: boolean
          message: string
          recipient_id: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          destination?: string | null
          id?: string
          is_read?: boolean
          message?: string
          recipient_id?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_path: string | null
          bio: string | null
          created_at: string
          full_name: string
          headline: string | null
          id: string
          location: string | null
          phone: string | null
          preferred_job_type: string | null
          preferred_language: string
          profile_completion: number
          salary_expectation: number | null
          skills: string[]
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          headline?: string | null
          id: string
          location?: string | null
          phone?: string | null
          preferred_job_type?: string | null
          preferred_language?: string
          profile_completion?: number
          salary_expectation?: number | null
          skills?: string[]
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          headline?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          preferred_job_type?: string | null
          preferred_language?: string
          profile_completion?: number
          salary_expectation?: number | null
          skills?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      salary_records: {
        Row: {
          allowances: number
          basic: number
          bonus: number
          created_at: string
          deductions: number
          employee_id: string
          id: string
          net_salary: number | null
          paid_at: string | null
          payslip_path: string | null
          salary_month: string
          status: string
          updated_at: string
        }
        Insert: {
          allowances?: number
          basic?: number
          bonus?: number
          created_at?: string
          deductions?: number
          employee_id: string
          id?: string
          net_salary?: number | null
          paid_at?: string | null
          payslip_path?: string | null
          salary_month: string
          status?: string
          updated_at?: string
        }
        Update: {
          allowances?: number
          basic?: number
          bonus?: number
          created_at?: string
          deductions?: number
          employee_id?: string
          id?: string
          net_salary?: number | null
          paid_at?: string | null
          payslip_path?: string | null
          salary_month?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "admin" | "super_admin"
      application_status:
        | "applied"
        | "under_review"
        | "shortlisted"
        | "interview"
        | "selected"
        | "rejected"
      job_status: "draft" | "active" | "paused" | "closed"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["user", "admin", "super_admin"],
      application_status: [
        "applied",
        "under_review",
        "shortlisted",
        "interview",
        "selected",
        "rejected",
      ],
      job_status: ["draft", "active", "paused", "closed"],
    },
  },
} as const
