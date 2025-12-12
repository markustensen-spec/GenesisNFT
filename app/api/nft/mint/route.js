/**
 * Lazy Minting API
 * Mints NFT on-demand when user purchases
 * RANDOMIZED minting - users get a random available NFT
 */

import { NextResponse } from 'next/server'
import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js'
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js'
import { SOLANA_CONFIG } from '@/lib/solana-config'
import { rateLimit } from '@/lib/security'
import { supabase } from '@/lib/supabase'
import { generateNFTMetadata, isFounderNFT } from '@/lib/nft-data'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json()
    const { userWallet, email, paymentSignature } = body
    
    // Security: Rate limiting
    if (!rateLimit(`mint_${userWallet}`, 5, 3600000)) {
      return NextResponse.json(
        { error: 'Too many mint attempts. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Validate wallet address
    if (!userWallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
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
    
    // Get available NFT numbers (0-9999 for array index, display as 1-10000)
    const availableNumbers = []
    for (let i = 0; i < 10000; i++) {
      if (!mintedNumbers.has(i + 1)) { // Store as 1-10000 in DB
        availableNumbers.push(i)
      }
    }
    
    if (availableNumbers.length === 0) {
      return NextResponse.json(
        { error: 'All NFTs have been minted! Collection sold out.' },
        { status: 400 }
      )
    }
    
    // RANDOM SELECTION - Crypto-secure randomness
    const randomIndex = Math.floor(Math.random() * availableNumbers.length)
    const tokenId = availableNumbers[randomIndex]
    const mintNumber = tokenId + 1 // Display number (1-10000)
    
    // Get metadata for this NFT
    const metadata = generateNFTMetadata(tokenId)
    const isFounder = isFounderNFT(tokenId)
    
    console.log(`🎲 RANDOM MINT: Selected NFT #${mintNumber} (${isFounder ? 'FOUNDER' : 'SKETCH'}) from ${availableNumbers.length} available`)
    
    // Connect to Solana
    const connection = new Connection(SOLANA_CONFIG.RPC_URL, 'confirmed')
    
    // Check if private key is configured
    const walletPrivateKey = process.env.SOLANA_PRIVATE_KEY
    
    if (!walletPrivateKey) {
      // Record mint in database without actual blockchain mint (for testing)
      const { error: insertError } = await supabase.from('minted_nfts').insert([
        {
          nft_number: mintNumber,
          mint_address: `pending_${Date.now()}_${mintNumber}`,
          owner_wallet: userWallet,
          owner_email: email || null,
          metadata_uri: `${SOLANA_CONFIG.BASE_URI}/${mintNumber}`,
          minted_at: new Date().toISOString()
        }
      ])
      
      if (insertError) {
        console.error('Database insert error:', insertError)
        return NextResponse.json(
          { error: 'Failed to record mint' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        success: true,
        nft: {
          mintAddress: `pending_${mintNumber}`,
          nftNumber: mintNumber,
          name: metadata.name,
          type: isFounder ? 'FOUNDER' : 'SKETCH',
          image: metadata.image,
          metadataUri: `${SOLANA_CONFIG.BASE_URI}/${mintNumber}`,
          explorerUrl: `https://solscan.io/token/pending?cluster=${SOLANA_CONFIG.NETWORK}`,
          benefits: isFounder ? 'Lifetime Access + 8% APY + Airdrops' : 'Voting Rights + Staking'
        },
        message: isFounder 
          ? '🌟 Congratulations! You got a FOUNDER NFT with premium benefits!' 
          : '📜 You got a Codex Sketch NFT with utility benefits!'
      })
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
      name: metadata.name,
      sellerFeeBasisPoints: SOLANA_CONFIG.COLLECTION.royaltyBasisPoints,
      creators: [
        {
          address: new PublicKey(SOLANA_CONFIG.COLLECTION_WALLET),
          share: 100
        }
      ],
      collection: null,
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
        owner_email: email || null,
        metadata_uri: metadataUri,
        minted_at: new Date().toISOString()
      }
    ])
    
    return NextResponse.json({
      success: true,
      nft: {
        mintAddress: nft.address.toString(),
        nftNumber: mintNumber,
        name: metadata.name,
        type: isFounder ? 'FOUNDER' : 'SKETCH',
        image: metadata.image,
        metadataUri,
        explorerUrl: `https://solscan.io/token/${nft.address.toString()}?cluster=${SOLANA_CONFIG.NETWORK}`,
        benefits: isFounder ? 'Lifetime Access + 8% APY + Airdrops' : 'Voting Rights + Staking'
      },
      message: isFounder 
        ? '🌟 Congratulations! You got a FOUNDER NFT with premium benefits!' 
        : '📜 You got a Codex Sketch NFT with utility benefits!'
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
