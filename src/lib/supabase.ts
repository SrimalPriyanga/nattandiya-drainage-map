import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

function createSupabaseClient(): SupabaseClient<Database> | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

  if (!url || !anonKey) {
    console.warn(
      '[supabase] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not set — reporting is disabled. See .env.example.',
    )
    return null
  }

  try {
    return createClient<Database>(url, anonKey, {
      // Reporting is anonymous: no sign-in, so never store or refresh auth sessions.
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
  } catch (error) {
    // e.g. a malformed URL — keep the map usable instead of crashing on import.
    console.error('[supabase] Could not create the client. Check VITE_SUPABASE_URL.', error)
    return null
  }
}

/** `null` when the environment is not configured; the UI then runs in a read-only "offline" mode. */
export const supabase = createSupabaseClient()
export const isSupabaseConfigured = supabase !== null
