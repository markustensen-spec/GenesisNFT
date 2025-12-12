/**
 * Verify Solana Payment on Blockchain
 */

import { NextResponse } from 'next/server'
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { SOLANA_CONFIG } from '@/lib/solana-config'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const { signature, userWallet } = await request.json()
    
    if (!signature) {
      return NextResponse.json({ success: false, error: 'Transaction signature required' }, { status: 400 })
    }
    
    const connection = new Connection(SOLANA_CONFIG.RPC_URL, 'confirmed')
    
    // Get transaction
    const tx = await connection.getTransaction(signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0
    })
    
    if (!tx) {
      return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 })
    }
    
    if (tx.meta?.err) {
      return NextResponse.json({ success: false, error: 'Transaction failed' }, { status: 400 })
    }
    
    // Verify payment to collection wallet
    const expectedLamports = SOLANA_CONFIG.COLLECTION.price * LAMPORTS_PER_SOL
    const collectionWallet = SOLANA_CONFIG.COLLECTION_WALLET
    
    const preBalances = tx.meta.preBalances
    const postBalances = tx.meta.postBalances
    const accountKeys = tx.transaction.message.staticAccountKeys || tx.transaction.message.accountKeys
    
    let verified = false
    let amount = 0
    
    for (let i = 0; i < accountKeys.length; i++) {
      if (accountKeys[i].toString() === collectionWallet) {
        amount = (postBalances[i] - preBalances[i]) / LAMPORTS_PER_SOL
        if ((postBalances[i] - preBalances[i]) >= expectedLamports * 0.99) {
          verified = true
        }
        break
      }
    }
    
    if (!verified) {
      return NextResponse.json({ 
        success: false, 
        error: `Payment not verified. Expected ${SOLANA_CONFIG.COLLECTION.price} SOL` 
      }, { status: 400 })
    }
    
    return NextResponse.json({ success: true, verified: true, amount, signature })
    
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
