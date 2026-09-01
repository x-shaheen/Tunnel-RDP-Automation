import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

function isValidHttpUrl(value: string | undefined): value is string {
  if (!value) return false

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const hasSupabaseConfig = isValidHttpUrl(supabaseUrl) && Boolean(supabaseAnonKey)

const unavailableSupabase = new Proxy({} as SupabaseClient, {
  get(_target, property: string | symbol) {
    if (property === 'channel') {
      return () => ({
        on() {
          return this
        },
        subscribe() {
          return { unsubscribe() {} }
        },
      })
    }

    throw new Error(
      'Supabase is not configured. Add a valid NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    )
  },
})

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : unavailableSupabase

if (!hasSupabaseConfig) {
  console.warn(
    'Supabase is not configured; the app will use local storage fallbacks until valid environment variables are provided.',
  )
}

// Types for our database schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          github_id: string
          github_username: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          github_id: string
          github_username: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          github_id?: string
          github_username?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rdp_sessions: {
        Row: {
          id: string
          user_id: string
          repository_url: string
          repository_name: string
          connection_details: {
            host: string
            port: string
            username: string
            password: string
          } | null
          status: 'idle' | 'creating' | 'deploying' | 'completed' | 'error'
          message: string | null
          created_at: string
          updated_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          repository_url: string
          repository_name: string
          connection_details?: {
            host: string
            port: string
            username: string
            password: string
          } | null
          status: 'idle' | 'creating' | 'deploying' | 'completed' | 'error'
          message?: string | null
          created_at?: string
          updated_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          user_id?: string
          repository_url?: string
          repository_name?: string
          connection_details?: {
            host: string
            port: string
            username: string
            password: string
          } | null
          status?: 'idle' | 'creating' | 'deploying' | 'completed' | 'error'
          message?: string | null
          created_at?: string
          updated_at?: string
          expires_at?: string
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type RDPSession = Database['public']['Tables']['rdp_sessions']['Row']
export type ConnectionDetails = {
  host: string
  port: string
  username: string
  password: string
}
