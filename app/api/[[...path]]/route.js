import { NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Simple API info endpoint - no database needed
export async function GET(request) {
  return NextResponse.json({
    success: true,
    message: 'GenesisHQ API',
    version: '2.0.0',
    endpoints: {
      nft: [
        '/api/nft/metadata/[id] - NFT metadata',
        '/api/nft/mint - Mint NFT',
        '/api/nft/stats - Collection stats',
        '/api/nft/verify-payment - Verify payment'
      ],
      info: 'All NFT data stored in Supabase'
    }
  })
}

// Catch-all for unsupported methods
export async function POST(request) {
  return NextResponse.json({
    success: false,
    error: 'This endpoint has been deprecated. Use specific API routes instead.',
    availableRoutes: [
      '/api/nft/mint',
      '/api/nft/stats'
    ]
  }, { status: 404 })
}
