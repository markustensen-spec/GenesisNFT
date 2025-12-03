'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, ExternalLink, Wallet as WalletIcon } from 'lucide-react'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { SOLANA_CONFIG } from '@/lib/solana-config'

export default function LazyMintNFT({ user }) {
  const [minting, setMinting] = useState(false)
  const [mintedNFT, setMintedNFT] = useState(null)
  const [error, setError] = useState('')
  const [walletConnected, setWalletConnected] = useState(false)
  const [stats, setStats] = useState({
    totalMinted: 0,
    remaining: 10000
  })

  useEffect(() => {
    checkWalletConnection()
    fetchStats()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.solana) {
      try {
        const response = await window.solana.connect({ onlyIfTrusted: true })
        setWalletConnected(!!response.publicKey)
      } catch (err) {
        setWalletConnected(false)
      }
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/nft/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const connectWallet = async () => {
    if (!window.solana) {
      setError('Please install Phantom wallet from phantom.app')
      return
    }

    try {
      await window.solana.connect()
      setWalletConnected(true)
      setError('')
    } catch (err) {
      setError('Failed to connect wallet')
    }
  }

  const handleMint = async () => {
    if (!user) {
      setError('Please login first')
      return
    }

    if (!walletConnected || !window.solana) {
      setError('Please connect your Phantom wallet first')
      return
    }

    setMinting(true)
    setError('')

    try {
      const userWallet = window.solana.publicKey.toString()

      // Step 1: Create payment transaction
      const connection = new Connection(SOLANA_CONFIG.RPC_URL, 'confirmed')
      const fromPubkey = new PublicKey(userWallet)
      const toPubkey = new PublicKey(SOLANA_CONFIG.COLLECTION_WALLET)

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: SOLANA_CONFIG.COLLECTION.price * LAMPORTS_PER_SOL
        })
      )

      // Get recent blockhash
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      transaction.feePayer = fromPubkey

      // Step 2: Sign and send payment
      const signed = await window.solana.signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signed.serialize())
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed')

      // Step 3: Verify payment
      const verifyResponse = await fetch('/api/nft/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signature,
          userWallet
        })
      })

      const verifyData = await verifyResponse.json()

      if (!verifyData.success) {
        throw new Error('Payment verification failed')
      }

      // Step 4: Mint NFT
      const mintResponse = await fetch('/api/nft/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userWallet,
          email: user.email,
          paymentSignature: signature
        })
      })

      const mintData = await mintResponse.json()

      if (!mintData.success) {
        throw new Error(mintData.error || 'Minting failed')
      }

      setMintedNFT(mintData.nft)
      fetchStats() // Refresh stats

    } catch (err) {
      console.error('Minting error:', err)
      setError(err.message || 'Failed to mint NFT. Please try again.')
    } finally {
      setMinting(false)
    }
  }

  const progress = (stats.totalMinted / 10000) * 100

  return (
    <div className="space-y-6">
      {/* Collection Stats */}
      <Card className="bg-slate-900/50 border-amber-900/30">
        <CardHeader>
          <CardTitle className="text-amber-100">Leonardo da Vinci Collection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-amber-100/70 mb-2">
              <span>Minted</span>
              <span>{stats.totalMinted} / 10,000</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Price */}
          <div className="flex justify-between items-center py-3 border-t border-amber-900/30">
            <span className="text-amber-100/80">Mint Price</span>
            <span className="text-2xl font-bold text-amber-400">
              {SOLANA_CONFIG.COLLECTION.price} SOL
            </span>
          </div>

          {/* Benefits */}
          <div className="text-sm text-amber-100/60 space-y-1">
            <p>✓ 15% royalties on secondary sales</p>
            <p>✓ G Lounge membership included</p>
            <p>✓ Voting rights in Codex Collective</p>
            <p>✓ Chance to win $5,000 Epic NFT</p>
          </div>

          {/* Wallet Connection */}
          {!walletConnected ? (
            <Button 
              onClick={connectWallet}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 h-12"
            >
              <WalletIcon className="w-5 h-5 mr-2" />
              Connect Phantom Wallet
            </Button>
          ) : (
            <div className="text-center text-emerald-400 text-sm">
              ✓ Wallet Connected
            </div>
          )}

          {/* Mint Button */}
          {user && walletConnected ? (
            <Button 
              onClick={handleMint}
              disabled={minting || stats.totalMinted >= 10000}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 h-12 text-lg"
            >
              {minting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Minting...
                </>
              ) : stats.totalMinted >= 10000 ? (
                'SOLD OUT'
              ) : (
                `Mint NFT (${SOLANA_CONFIG.COLLECTION.price} SOL)`
              )}
            </Button>
          ) : !user ? (
            <div className="text-center p-4 bg-amber-900/20 rounded-lg">
              <p className="text-amber-100/80">Please login to mint NFTs</p>
            </div>
          ) : null}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Message */}
      {mintedNFT && (
        <Card className="bg-emerald-900/20 border-emerald-500/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-emerald-500" />
              <h3 className="text-2xl font-bold text-emerald-100">NFT Minted Successfully!</h3>
              <p className="text-emerald-100/80">
                Congratulations! Your Leonardo da Vinci NFT #{mintedNFT.nftNumber} has been minted.
              </p>
              
              <div className="space-y-2">
                <a 
                  href={mintedNFT.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-amber-400 hover:text-amber-300 underline"
                >
                  View on Solana Explorer
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>

              <Button
                onClick={() => setMintedNFT(null)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Mint Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Install Phantom */}
      {!window.solana && (
        <Card className="bg-purple-900/20 border-purple-500/30">
          <CardContent className="pt-6 text-center">
            <WalletIcon className="w-12 h-12 mx-auto mb-3 text-purple-400" />
            <h3 className="text-lg font-semibold text-amber-100 mb-2">
              Phantom Wallet Required
            </h3>
            <p className="text-amber-100/70 mb-4">
              Install Phantom wallet to mint NFTs
            </p>
            <a 
              href="https://phantom.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-purple-600 hover:bg-purple-700">
                Install Phantom
              </Button>
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
