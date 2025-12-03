/**
 * NFT Collection Statistics API
 */

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Get total minted count
    const { data, error } = await supabase
      .from('minted_nfts')
      .select('nft_number', { count: 'exact' })
    
    if (error) throw error
    
    const totalMinted = data ? data.length : 0
    const remaining = 10000 - totalMinted
    
    // Get unique owners
    const { data: owners } = await supabase
      .from('minted_nfts')
      .select('owner_wallet')
    
    const uniqueOwners = owners ? new Set(owners.map(o => o.owner_wallet)).size : 0
    
    return NextResponse.json({
      success: true,
      stats: {
        totalMinted,
        remaining,
        uniqueOwners,
        progress: (totalMinted / 10000) * 100
      }
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
