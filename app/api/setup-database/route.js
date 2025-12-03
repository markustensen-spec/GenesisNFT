/**
 * Database Setup API - Visit this URL to create tables automatically
 * GET /api/setup-database
 */

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const results = {
      message: 'Checking and setting up database tables...',
      steps: []
    }

    // Check if minted_nfts table exists
    results.steps.push({ step: 1, action: 'Checking minted_nfts table...' })
    
    const { data: existingData, error: checkError } = await supabase
      .from('minted_nfts')
      .select('id')
      .limit(1)

    if (checkError && checkError.message.includes('does not exist')) {
      results.steps.push({
        step: 2,
        status: 'error',
        message: 'Table does not exist',
        solution: 'Please run the SQL script manually'
      })
      
      results.sql = `CREATE TABLE IF NOT EXISTS public.minted_nfts (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, nft_number INTEGER UNIQUE NOT NULL, mint_address TEXT NOT NULL, owner_wallet TEXT NOT NULL, owner_email TEXT NOT NULL, metadata_uri TEXT NOT NULL, transaction_signature TEXT, minted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()); CREATE INDEX IF NOT EXISTS idx_minted_nfts_owner ON public.minted_nfts(owner_wallet); CREATE INDEX IF NOT EXISTS idx_minted_nfts_number ON public.minted_nfts(nft_number); ALTER TABLE public.minted_nfts ENABLE ROW LEVEL SECURITY; DROP POLICY IF EXISTS "view_minted_nfts" ON public.minted_nfts; CREATE POLICY "view_minted_nfts" ON public.minted_nfts FOR SELECT USING (true); DROP POLICY IF EXISTS "insert_minted_nfts" ON public.minted_nfts; CREATE POLICY "insert_minted_nfts" ON public.minted_nfts FOR INSERT WITH CHECK (true); GRANT SELECT ON public.minted_nfts TO anon, authenticated;`
      
      results.instructions = [
        '1. Go to Supabase Dashboard',
        '2. Open SQL Editor',
        '3. Click + New Query',
        '4. Copy the SQL from the "sql" field above',
        '5. Paste and click RUN'
      ]
      
    } else if (checkError) {
      results.steps.push({
        step: 2,
        status: 'error',
        message: checkError.message
      })
    } else {
      results.steps.push({
        step: 2,
        status: 'success',
        message: 'minted_nfts table exists and is accessible!'
      })

      // Get current stats
      const { count } = await supabase
        .from('minted_nfts')
        .select('*', { count: 'exact', head: true })

      results.stats = {
        totalMinted: count || 0,
        remaining: 10000 - (count || 0)
      }
    }

    // Check profiles table
    results.steps.push({ step: 3, action: 'Checking profiles table...' })
    
    const { error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (profilesError) {
      results.steps.push({
        step: 4,
        status: 'error',
        message: 'Profiles table issue: ' + profilesError.message
      })
    } else {
      results.steps.push({
        step: 4,
        status: 'success',
        message: 'profiles table exists and is accessible!'
      })
    }

    return NextResponse.json(results, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Setup check failed',
      message: error.message,
      help: 'Please contact support or run SQL manually'
    }, { status: 500 })
  }
}
