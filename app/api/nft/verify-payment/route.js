/**
 * Verify Solana Payment
 * Checks if user has sent SOL payment before minting
 */

import { NextResponse } from 'next/server'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { SOLANA_CONFIG } from '@/lib/solana-config'

export async function POST(request) {
  try {
    const { signature, userWallet } = await request.json()
    
    if (!signature || !userWallet) {
      return NextResponse.json(
        { error: 'Transaction signature and wallet required' },
        { status: 400 }
      )
    }
    
    // Connect to Solana
    const connection = new Connection(SOLANA_CONFIG.RPC_URL, 'confirmed')
    
    // Get transaction details
    const transaction = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0
    })
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }
    
    // Verify transaction details
    const receiverPubkey = new PublicKey(SOLANA_CONFIG.COLLECTION_WALLET)
    const expectedAmount = SOLANA_CONFIG.COLLECTION.price * LAMPORTS_PER_SOL
    
    // Check if transaction was to our wallet
    const postBalances = transaction.meta.postBalances
    const preBalances = transaction.meta.preBalances
    const accountKeys = transaction.transaction.message.accountKeys
    
    // Find receiver account index
    const receiverIndex = accountKeys.findIndex(
      key => key.equals(receiverPubkey)
    )
    
    if (receiverIndex === -1) {
      return NextResponse.json(
        { error: 'Payment was not sent to correct address' },
        { status: 400 }
      )
    }
    
    // Calculate amount received
    const amountReceived = postBalances[receiverIndex] - preBalances[receiverIndex]
    
    // Verify amount (allow 1% tolerance for fees)
    if (amountReceived < expectedAmount * 0.99) {
      return NextResponse.json(
        { 
          error: 'Insufficient payment amount',
          expected: SOLANA_CONFIG.COLLECTION.price,
          received: amountReceived / LAMPORTS_PER_SOL
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      verified: true,
      amount: amountReceived / LAMPORTS_PER_SOL,
      signature
    })
    
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
