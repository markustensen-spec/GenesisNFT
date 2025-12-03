import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const verified = requestUrl.searchParams.get('verified')

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      try {
        // Exchange the code for a session
        await supabase.auth.exchangeCodeForSession(code)
      } catch (error) {
        console.error('Error exchanging code for session:', error)
      }
    }
  }

  // Redirect to homepage with verification success message
  return NextResponse.redirect(new URL('/?verified=true', requestUrl.origin))
}
