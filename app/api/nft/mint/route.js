/**
 * NFT Minting API - Supports multiple NFTs
 * Payment verified on blockchain
 */

import { NextResponse } from 'next/server'
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { SOLANA_CONFIG } from '@/lib/solana-config'
import { supabase } from '@/lib/supabase'
import { generateNFTMetadata, isFounderNFT } from '@/lib/nft-data'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json()
    const { userWallet, paymentSignature, batchIndex = 0, totalPaid } = body
    
    if (!userWallet || !paymentSignature) {
      return NextResponse.json(
        { success: false, error: 'Wallet and payment signature required' },
        { status: 400 }
      )
    }

    // Extract base signature (remove batch index suffix)
    const baseSignature = paymentSignature.split('_')[0]

    // Only verify payment on first NFT of batch
    if (batchIndex === 0) {
      const connection = new Connection(SOLANA_CONFIG.RPC_URL, 'confirmed')
      
      const tx = await connection.getTransaction(baseSignature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0
      })
      
      if (!tx) {
        return NextResponse.json(
          { success: false, error: 'Transaction not found. Wait a moment and try again.' },
          { status: 400 }
        )
      }
      
      if (tx.meta?.err) {
        return NextResponse.json(
          { success: false, error: 'Transaction failed on blockchain' },
          { status: 400 }
        )
      }
      
      // Verify payment
      const collectionWallet = SOLANA_CONFIG.COLLECTION_WALLET
      const preBalances = tx.meta.preBalances
      const postBalances = tx.meta.postBalances
      const accountKeys = tx.transaction.message.staticAccountKeys || tx.transaction.message.accountKeys
      
      let paymentAmount = 0
      for (let i = 0; i < accountKeys.length; i++) {
        if (accountKeys[i].toString() === collectionWallet) {
          paymentAmount = (postBalances[i] - preBalances[i]) / LAMPORTS_PER_SOL
          break
        }
      }
      
      const expectedAmount = totalPaid || SOLANA_CONFIG.COLLECTION.price
      if (paymentAmount < expectedAmount * 0.99) {
        return NextResponse.json(
          { success: false, error: `Payment too low. Expected ${expectedAmount} SOL, got ${paymentAmount.toFixed(3)} SOL` },
          { status: 400 }
        )
      }
    }

    // Check if this exact mint was already done
    const { data: existingMint } = await supabase
      .from('minted_nfts')
      .select('nft_number')
      .eq('mint_address', paymentSignature)
      .single()
    
    if (existingMint) {
      return NextResponse.json(
        { success: false, error: 'Already minted with this transaction' },
        { status: 400 }
      )
    }
    
    // Get minted NFTs
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
        { success: false, error: 'SOLD OUT!' },
        { status: 400 }
      )
    }
    
    // Random selection
    const randomIndex = Math.floor(Math.random() * availableNumbers.length)
    const tokenId = availableNumbers[randomIndex]
    const mintNumber = tokenId + 1
    
    const metadata = generateNFTMetadata(tokenId)
    const isFounder = isFounderNFT(tokenId)
    
    console.log(`✅ MINT #${mintNumber} (${isFounder ? 'FOUNDER' : 'SKETCH'}) → ${userWallet.slice(0,8)}...`)
    
    // Record mint
    const { error: insertError } = await supabase.from('minted_nfts').insert([{
      nft_number: mintNumber,
      mint_address: paymentSignature,
      owner_wallet: userWallet,
      metadata_uri: `/api/nft/metadata/${mintNumber}`,
      minted_at: new Date().toISOString()
    }])
    
    if (insertError) {
      console.error('DB error:', insertError)
      return NextResponse.json(
        { success: false, error: 'Database error' },
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
        description: metadata.description,
        attributes: metadata.attributes,
        transactionId: baseSignature,
        explorerUrl: `https://solscan.io/tx/${baseSignature}`
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
