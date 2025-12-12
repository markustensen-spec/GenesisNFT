import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create client with fallback empty strings to avoid build errors
// The actual validation happens at runtime when auth is used
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
)

// Export a helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseAnonKey !== 'placeholder-key')
}

// Email configuration for verification
export const emailConfig = {
  from: 'Genesis Nexus7 <noreply@genesishq.io>',
  logo: 'https://raw.githubusercontent.com/markustensen-spec/Logo/refs/heads/main/1000004278.jpg.png',
  siteName: 'Genesis Nexus7',
  siteUrl: 'https://genesishq.io',
  colors: {
    primary: '#d97706', // amber-600
    background: '#0f172a', // slate-950
    text: '#fef3c7' // amber-100
  }
}
