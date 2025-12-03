import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST() {
  try {
    // Execute SQL using Supabase REST API
    const sqlStatements = [
      // Enable UUID extension
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
      
      // Create profiles table
      `CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID REFERENCES auth.users(id) PRIMARY KEY,
        username TEXT UNIQUE,
        wallet_address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      
      // Create whitelist table
      `CREATE TABLE IF NOT EXISTS public.whitelist (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      
      // Enable RLS on profiles
      `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY`,
      
      // Enable RLS on whitelist
      `ALTER TABLE public.whitelist ENABLE ROW LEVEL SECURITY`,
    ]

    const results = []
    
    for (const sql of sqlStatements) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({ query: sql })
        })
        
        if (!response.ok) {
          const error = await response.text()
          results.push({ sql: sql.substring(0, 50) + '...', error })
        } else {
          results.push({ sql: sql.substring(0, 50) + '...', success: true })
        }
      } catch (err) {
        results.push({ sql: sql.substring(0, 50) + '...', error: err.message })
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Setup complete! Du må nå kjøre SQL manuelt i Supabase Dashboard.',
      instructions: `
        Gå til Supabase Dashboard:
        1. SQL Editor → New Query
        2. Kopier innholdet fra /app/supabase-setup.sql
        3. Kjør SQL (Run knappen)
        
        Eller bruk denne lenken:
        https://kpdwzbxanqrslupyslkw.supabase.co/project/_/sql/new
      `,
      results
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Setup failed',
      instructions: 'Du må kjøre SQL manuelt i Supabase Dashboard. Se /app/supabase-setup.sql'
    }, { status: 500 })
  }
}
