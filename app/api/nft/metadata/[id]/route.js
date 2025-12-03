/**
 * NFT Metadata API - Dynamic generation for lazy minting
 * Returns Metaplex-compatible metadata
 */

import { NextResponse } from 'next/server'
import { SOLANA_CONFIG, getNFTTier, generateAttributes } from '@/lib/solana-config'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  try {
    const nftId = parseInt(params.id)
    
    // Validate NFT ID
    if (isNaN(nftId) || nftId < 1 || nftId > 10000) {
      return NextResponse.json(
        { error: 'Invalid NFT ID. Must be between 1 and 10000' },
        { status: 400 }
      )
    }
    
    // Get tier and generate metadata
    const tier = getNFTTier(nftId)
    const attributes = generateAttributes(tier, nftId)
    
    // Generate image URL (you'll need to host actual images)
    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/images/nft/${tier.rarity.toLowerCase()}/${nftId}.png`
    
    // Metaplex-compatible metadata
    const metadata = {
      name: `${tier.name} #${nftId}`,
      symbol: SOLANA_CONFIG.COLLECTION.symbol,
      description: `${SOLANA_CONFIG.COLLECTION.description} This is ${tier.name} #${nftId} with ${tier.rarity} rarity.`,
      image: imageUrl,
      external_url: `https://genesishq.io/nft/${nftId}`,
      attributes,
      properties: {
        files: [
          {
            uri: imageUrl,
            type: 'image/png'
          }
        ],
        category: 'image',
        creators: [
          {
            address: SOLANA_CONFIG.COLLECTION_WALLET,
            share: 100
          }
        ]
      },
      seller_fee_basis_points: SOLANA_CONFIG.COLLECTION.royaltyBasisPoints,
      collection: {
        name: SOLANA_CONFIG.COLLECTION.name,
        family: 'GenesisHQ'
      }
    }
    
    // Return with proper CORS headers
    return NextResponse.json(metadata, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*'
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
