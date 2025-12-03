/**
 * Lazy Minting API
 * Mints NFT on-demand when user purchases
 */

import { NextResponse } from 'next/server'
import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js'
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js'
import { SOLANA_CONFIG } from '@/lib/solana-config'
import { rateLimit, validateEmail } from '@/lib/security'
import { supabase } from '@/lib/supabase'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json()
    const { userWallet, email, nftNumber } = body
    
    // Security: Rate limiting
    if (!rateLimit(`mint_${userWallet}`, 3, 3600000)) {
      return NextResponse.json(
        { error: 'Too many mint attempts. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Validate inputs
    if (!userWallet || !email) {
      return NextResponse.json(
        { error: 'User wallet and email are required' },
        { status: 400 }
      )
    }
    
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }
    
    // Get list of already minted NFTs
    const { data: mintedNFTs, error: queryError } = await supabase
      .from('minted_nfts')
      .select('nft_number')
    
    if (queryError) {
      console.error('Database query error:', queryError)
    }
    
    const mintedNumbers = new Set((mintedNFTs || []).map(m => m.nft_number))
    
    // Get available NFT numbers
    const availableNumbers = []
    for (let i = 1; i <= 10000; i++) {
      if (!mintedNumbers.has(i)) {
        availableNumbers.push(i)
      }
    }
    
    if (availableNumbers.length === 0) {
      return NextResponse.json(
        { error: 'All NFTs have been minted! Collection sold out.' },
        { status: 400 }
      )
    }
    
    // Randomly select an available NFT
    const randomIndex = Math.floor(Math.random() * availableNumbers.length)
    const mintNumber = availableNumbers[randomIndex]
    
    console.log(`Randomly selected NFT #${mintNumber} from ${availableNumbers.length} available NFTs`)
    
    // TODO: Verify payment before minting
    // This would integrate with Solana payment verification
    // For now, we'll proceed with minting
    
    // Connect to Solana
    const connection = new Connection(SOLANA_CONFIG.RPC_URL, 'confirmed')
    
    // IMPORTANT: You need to provide your wallet's private key
    // Store it securely in environment variables
    const walletPrivateKey = process.env.SOLANA_PRIVATE_KEY
    
    if (!walletPrivateKey) {
      return NextResponse.json(
        { error: 'Server configuration error: Wallet not configured' },
        { status: 500 }
      )
    }
    
    // Create keypair from private key
    const secretKey = Uint8Array.from(JSON.parse(walletPrivateKey))
    const payerKeypair = Keypair.fromSecretKey(secretKey)
    
    // Initialize Metaplex
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(payerKeypair))
    
    // Get metadata URI
    const metadataUri = `${SOLANA_CONFIG.BASE_URI}/${mintNumber}`
    
    // Create NFT
    const { nft } = await metaplex.nfts().create({
      uri: metadataUri,
      name: `Leonardo Codex #${mintNumber}`,
      sellerFeeBasisPoints: SOLANA_CONFIG.COLLECTION.royaltyBasisPoints,
      creators: [
        {
          address: new PublicKey(SOLANA_CONFIG.COLLECTION_WALLET),
          share: 100
        }
      ],
      collection: null, // Set if you have a collection NFT
      isMutable: false,
    })
    
    // Transfer NFT to user
    await metaplex.nfts().transfer({
      nftOrSft: nft,
      toOwner: new PublicKey(userWallet),
    })
    
    // Record mint in database
    await supabase.from('minted_nfts').insert([
      {
        nft_number: mintNumber,
        mint_address: nft.address.toString(),
        owner_wallet: userWallet,
        owner_email: email,
        metadata_uri: metadataUri,
        minted_at: new Date().toISOString()
      }
    ])
    
    return NextResponse.json({
      success: true,
      nft: {
        mintAddress: nft.address.toString(),
        nftNumber: mintNumber,
        metadataUri,
        explorerUrl: `https://explorer.solana.com/address/${nft.address.toString()}?cluster=${SOLANA_CONFIG.NETWORK}`
      }
    })
    
  } catch (error) {
    console.error('Minting error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to mint NFT',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
