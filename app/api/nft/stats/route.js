/**
 * NFT Collection Statistics API
 * Mock numbers for display - slow countdown
 */

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { MINT_PRICE_SOL, COLLECTION_INFO, FOUNDER_NFT_COUNT } from '@/lib/nft-data'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Total supply: 20,000 NFTs
const TOTAL_SUPPLY = 20000
const FOUNDER_SUPPLY = 1000
const CODEX_SUPPLY = 19000

// Mock: Fixed display number
const MOCK_MINTED = 4367
const FOUNDERS_REMAINING = 200

export async function GET() {
  try {
    // Get actual minted count from database
    const { data, error } = await supabase
      .from('minted_nfts')
      .select('nft_number', { count: 'exact' })
    
    const actualMinted = data ? data.length : 0
    
    // Total display: mock + actual real mints
    const totalMinted = Math.min(MOCK_MINTED + actualMinted, TOTAL_SUPPLY)
    const remaining = TOTAL_SUPPLY - totalMinted
    
    // Get unique owners
    const { data: owners } = await supabase
      .from('minted_nfts')
      .select('owner_wallet')
    
    const actualOwners = owners ? new Set(owners.map(o => o.owner_wallet)).size : 0
    const displayOwners = Math.max(actualOwners, Math.floor(totalMinted * 0.7)) // ~70% unique
    
    return NextResponse.json({
      success: true,
      stats: {
        totalSupply: TOTAL_SUPPLY,
        totalMinted,
        remaining,
        foundersRemaining: FOUNDERS_REMAINING,
        uniqueOwners: displayOwners,
        progress: ((totalMinted / TOTAL_SUPPLY) * 100).toFixed(2),
        mintPriceSOL: MINT_PRICE_SOL,
        network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
        recentMints: []
      },
      collection: {
        name: COLLECTION_INFO.name,
        founderNFTs: FOUNDER_SUPPLY,
        codexSketches: CODEX_SUPPLY,
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
        totalSupply: TOTAL_SUPPLY,
        totalMinted: MOCK_MINTED,
        remaining: TOTAL_SUPPLY - MOCK_MINTED,
        foundersRemaining: FOUNDERS_REMAINING,
        uniqueOwners: Math.floor(MOCK_MINTED * 0.7),
        progress: ((MOCK_MINTED / TOTAL_SUPPLY) * 100).toFixed(2),
        mintPriceSOL: MINT_PRICE_SOL,
        network: 'mainnet-beta',
        recentMints: []
      },
      collection: {
        name: 'Leonardo da Vinci Codex',
        founderNFTs: FOUNDER_SUPPLY,
        codexSketches: CODEX_SUPPLY
      }
    })
  }
}
