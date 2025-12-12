/**
 * NFT Collection Statistics API
 */

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { MINT_PRICE_SOL, COLLECTION_INFO, FOUNDER_NFT_COUNT } from '@/lib/nft-data'

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
    const foundersRemaining = Math.max(0, FOUNDER_NFT_COUNT - totalMinted)
    
    // Get unique owners
    const { data: owners } = await supabase
      .from('minted_nfts')
      .select('owner_wallet')
    
    const uniqueOwners = owners ? new Set(owners.map(o => o.owner_wallet)).size : 0
    
    // Get recent mints
    const { data: recentMints } = await supabase
      .from('minted_nfts')
      .select('nft_number, minted_at')
      .order('minted_at', { ascending: false })
      .limit(5)
    
    return NextResponse.json({
      success: true,
      stats: {
        totalSupply: 10000,
        totalMinted,
        remaining,
        foundersRemaining,
        uniqueOwners,
        progress: ((totalMinted / 10000) * 100).toFixed(2),
        mintPriceSOL: MINT_PRICE_SOL,
        network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
        recentMints: recentMints || []
      },
      collection: {
        name: COLLECTION_INFO.name,
        founderNFTs: COLLECTION_INFO.founderNFTs,
        codexSketches: COLLECTION_INFO.codexSketches,
        leonardoSelfie: COLLECTION_INFO.leonardoSelfie,
        leonardoExclusives: COLLECTION_INFO.leonardoExclusives,
        prize: COLLECTION_INFO.prize,
        founderBenefits: COLLECTION_INFO.founderBenefits,
        sketchBenefits: COLLECTION_INFO.sketchBenefits
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
