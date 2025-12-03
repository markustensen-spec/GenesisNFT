/**
 * NFT Metadata API - Dynamic generation for lazy minting
 * Returns Metaplex-compatible metadata using nft-data.js
 */

import { NextResponse } from 'next/server'
import { generateNFTMetadata } from '@/lib/nft-data'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  try {
    const nftId = parseInt(params.id)
    
    // Validate NFT ID (0-based internally, but API accepts 1-10000)
    if (isNaN(nftId) || nftId < 1 || nftId > 10000) {
      return NextResponse.json(
        { error: 'Invalid NFT ID. Must be between 1 and 10000' },
        { status: 400 }
      )
    }
    
    // Convert to 0-based index for internal use
    const tokenId = nftId - 1
    
    // Generate complete metadata using our nft-data.js
    const metadata = generateNFTMetadata(tokenId)
    
    // Return with proper CORS headers for Solana/Metaplex compatibility
    return NextResponse.json(metadata, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    console.error('Metadata generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate metadata' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
