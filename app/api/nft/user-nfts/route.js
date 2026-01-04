import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const wallet = searchParams.get('wallet')
    
    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'Wallet address required' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db('genesishq')
    
    const nfts = await db.collection('minted_nfts')
      .find({ owner_wallet: wallet })
      .sort({ minted_at: -1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      count: nfts.length,
      nfts: nfts.map(nft => ({
        name: nft.name,
        nftNumber: nft.nft_number,
        type: nft.nft_type,
        image: nft.image_url,
        mintAddress: nft.mint_address,
        explorerUrl: nft.explorer_url,
        mintedAt: nft.minted_at
      }))
    })
    
  } catch (error) {
    console.error('Error fetching user NFTs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch NFTs' },
      { status: 500 }
    )
  }
}
