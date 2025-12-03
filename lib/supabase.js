import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Email configuration for verification
export const emailConfig = {
  from: 'GenesisHQ <noreply@genesishq.io>',
  logo: 'https://raw.githubusercontent.com/markustensen-spec/Logo/refs/heads/main/1000004278.jpg.png',
  siteName: 'GenesisHQ',
  siteUrl: 'https://genesishq.io',
  colors: {
    primary: '#d97706', // amber-600
    background: '#0f172a', // slate-950
    text: '#fef3c7' // amber-100
  }
}
