/**
 * NFT Minting API - Payment Verified on Blockchain
 * NO private keys needed - user signs everything in their wallet
 */

import { NextResponse } from 'next/server'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { SOLANA_CONFIG } from '@/lib/solana-config'
import { supabase } from '@/lib/supabase'
import { generateNFTMetadata, isFounderNFT } from '@/lib/nft-data'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json()
    const { userWallet, paymentSignature } = body
    
    if (!userWallet || !paymentSignature) {
      return NextResponse.json(
        { success: false, error: 'Wallet and payment signature required' },
        { status: 400 }
      )
    }

    // Connect to Solana and verify payment
    const connection = new Connection(SOLANA_CONFIG.RPC_URL, 'confirmed')
    
    // Get transaction details
    const tx = await connection.getTransaction(paymentSignature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0
    })
    
    if (!tx) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found. Please wait and try again.' },
        { status: 400 }
      )
    }
    
    // Verify transaction was successful
    if (tx.meta?.err) {
      return NextResponse.json(
        { success: false, error: 'Transaction failed on blockchain' },
        { status: 400 }
      )
    }
    
    // Verify payment amount and recipient
    const expectedLamports = SOLANA_CONFIG.COLLECTION.price * LAMPORTS_PER_SOL
    const collectionWallet = SOLANA_CONFIG.COLLECTION_WALLET
    
    // Check pre/post balances to verify payment
    const preBalances = tx.meta.preBalances
    const postBalances = tx.meta.postBalances
    const accountKeys = tx.transaction.message.staticAccountKeys || tx.transaction.message.accountKeys
    
    let paymentVerified = false
    let paymentAmount = 0
    
    for (let i = 0; i < accountKeys.length; i++) {
      const pubkey = accountKeys[i].toString()
      if (pubkey === collectionWallet) {
        paymentAmount = postBalances[i] - preBalances[i]
        if (paymentAmount >= expectedLamports * 0.99) { // Allow 1% for rounding
          paymentVerified = true
        }
        break
      }
    }
    
    if (!paymentVerified) {
      return NextResponse.json(
        { success: false, error: `Payment not verified. Expected ${SOLANA_CONFIG.COLLECTION.price} SOL to ${collectionWallet}` },
        { status: 400 }
      )
    }
    
    // Check if this transaction was already used
    const { data: existingMint } = await supabase
      .from('minted_nfts')
      .select('nft_number')
      .eq('mint_address', paymentSignature)
      .single()
    
    if (existingMint) {
      return NextResponse.json(
        { success: false, error: 'This transaction was already used for minting' },
        { status: 400 }
      )
    }
    
    // Get minted NFTs to find available numbers
    const { data: mintedNFTs } = await supabase
      .from('minted_nfts')
      .select('nft_number')
    
    const mintedNumbers = new Set((mintedNFTs || []).map(m => m.nft_number))
    
    // Get available NFT numbers
    const availableNumbers = []
    for (let i = 0; i < 10000; i++) {
      if (!mintedNumbers.has(i + 1)) {
        availableNumbers.push(i)
      }
    }
    
    if (availableNumbers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'SOLD OUT! All 10,000 NFTs have been minted.' },
        { status: 400 }
      )
    }
    
    // RANDOM selection
    const randomIndex = Math.floor(Math.random() * availableNumbers.length)
    const tokenId = availableNumbers[randomIndex]
    const mintNumber = tokenId + 1
    
    const metadata = generateNFTMetadata(tokenId)
    const isFounder = isFounderNFT(tokenId)
    
    console.log(`✅ VERIFIED MINT: NFT #${mintNumber} (${isFounder ? 'FOUNDER' : 'SKETCH'}) for ${userWallet}`)
    
    // Record mint
    const { error: insertError } = await supabase.from('minted_nfts').insert([{
      nft_number: mintNumber,
      mint_address: paymentSignature,
      owner_wallet: userWallet,
      metadata_uri: `${SOLANA_CONFIG.BASE_URI}/${mintNumber}`,
      minted_at: new Date().toISOString()
    }])
    
    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to record mint' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      nft: {
        nftNumber: mintNumber,
        name: metadata.name,
        type: isFounder ? 'FOUNDER' : 'SKETCH',
        image: metadata.image,
        transactionId: paymentSignature,
        explorerUrl: `https://solscan.io/tx/${paymentSignature}`,
        benefits: isFounder ? 'Lifetime Access + 8% APY + Airdrops' : 'Voting Rights + Staking'
      }
    })
    
  } catch (error) {
    console.error('Mint error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Minting failed' },
      { status: 500 }
    )
  }
}
