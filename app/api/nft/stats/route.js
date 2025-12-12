/**
 * NFT Collection Statistics API
 * Mock numbers for display - counts every other mint
 */

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { MINT_PRICE_SOL, COLLECTION_INFO, FOUNDER_NFT_COUNT } from '@/lib/nft-data'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Mock base number - displayed mints
const MOCK_BASE_MINTED = 4627

export async function GET() {
  try {
    // Get actual minted count from database
    const { data, error } = await supabase
      .from('minted_nfts')
      .select('nft_number', { count: 'exact' })
    
    const actualMinted = data ? data.length : 0
    
    // Display number: mock base + every other real mint (divide by 2)
    const displayMinted = MOCK_BASE_MINTED + Math.floor(actualMinted / 2)
    
    // Cap at 10000
    const totalMinted = Math.min(displayMinted, 10000)
    const remaining = 10000 - totalMinted
    
    // Founders: 500 total, show most as taken
    const foundersRemaining = Math.max(0, 500 - Math.floor(totalMinted * 0.05))
    
    // Get unique owners
    const { data: owners } = await supabase
      .from('minted_nfts')
      .select('owner_wallet')
    
    const actualOwners = owners ? new Set(owners.map(o => o.owner_wallet)).size : 0
    const displayOwners = 847 + actualOwners // Mock base owners
    
    return NextResponse.json({
      success: true,
      stats: {
        totalSupply: 10000,
        totalMinted,
        remaining,
        foundersRemaining,
        uniqueOwners: displayOwners,
        progress: ((totalMinted / 10000) * 100).toFixed(2),
        mintPriceSOL: MINT_PRICE_SOL,
        network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
        recentMints: []
      },
      collection: {
        name: COLLECTION_INFO.name,
        founderNFTs: COLLECTION_INFO.founderNFTs,
        codexSketches: COLLECTION_INFO.codexSketches,
        founderBenefits: COLLECTION_INFO.founderBenefits,
        sketchBenefits: COLLECTION_INFO.sketchBenefits
      }
    })
  } catch (error) {
    console.error('Stats error:', error)
    // Return mock data even on error
    return NextResponse.json({
      success: true,
      stats: {
        totalSupply: 10000,
        totalMinted: MOCK_BASE_MINTED,
        remaining: 10000 - MOCK_BASE_MINTED,
        foundersRemaining: 269,
        uniqueOwners: 847,
        progress: ((MOCK_BASE_MINTED / 10000) * 100).toFixed(2),
        mintPriceSOL: MINT_PRICE_SOL,
        network: 'mainnet-beta',
        recentMints: []
      },
      collection: {
        name: 'Leonardo da Vinci Codex',
        founderNFTs: 500,
        codexSketches: 9500
      }
    })
  }
}
