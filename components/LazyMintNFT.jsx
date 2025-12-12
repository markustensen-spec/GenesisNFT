'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, ExternalLink, Wallet as WalletIcon, Smartphone, AlertCircle } from 'lucide-react'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { SOLANA_CONFIG } from '@/lib/solana-config'
import { COLLECTION_INFO, isFounderNFT, FOUNDER_NFT_COUNT } from '@/lib/nft-data'

export default function LazyMintNFT({ user }) {
  const [minting, setMinting] = useState(false)
  const [mintedNFT, setMintedNFT] = useState(null)
  const [error, setError] = useState('')
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [stats, setStats] = useState({
    totalMinted: 0,
    remaining: 10000,
    foundersRemaining: FOUNDER_NFT_COUNT
  })

  useEffect(() => {
    checkWalletConnection()
    fetchStats()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined') {
      // Check for any Solana wallet (Phantom, Solflare, etc)
      const provider = window.solana || window.phantom?.solana
      if (provider) {
        try {
          const response = await provider.connect({ onlyIfTrusted: true })
          if (response.publicKey) {
            setWalletConnected(true)
            setWalletAddress(response.publicKey.toString())
          }
        } catch (err) {
          setWalletConnected(false)
        }
      }
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/nft/stats')
      const data = await response.json()
      if (data.success) {
        setStats({
          ...data.stats,
          foundersRemaining: Math.max(0, FOUNDER_NFT_COUNT - (data.stats.totalMinted || 0))
        })
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const connectWallet = async () => {
    // Check for any Solana wallet provider
    const provider = window.solana || window.phantom?.solana
    
    if (!provider) {
      setError('No Solana wallet found. Please install Phantom, Solflare, or another Solana wallet.')
      return
    }

    try {
      const response = await provider.connect()
      if (response.publicKey) {
        setWalletConnected(true)
        setWalletAddress(response.publicKey.toString())
        setError('')
      }
    } catch (err) {
      if (err.code === 4001) {
        setError('Connection rejected. Please approve the connection in your wallet.')
      } else {
        setError('Failed to connect wallet. Please try again.')
      }
    }
  }

  const handleMint = async () => {
    if (!user) {
      setError('Please login first')
      return
    }

    const provider = window.solana || window.phantom?.solana
    if (!walletConnected || !provider) {
      setError('Please connect your Solana wallet first')
      return
    }

    setMinting(true)
    setError('')

    try {
      const userWallet = provider.publicKey.toString()

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
      const signed = await provider.signTransaction(transaction)
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
  const foundersProgress = ((FOUNDER_NFT_COUNT - stats.foundersRemaining) / FOUNDER_NFT_COUNT) * 100

  return (
    <div className="space-y-6">
      {/* Collection Stats */}
      <Card className="bg-slate-900/50 border-amber-900/30">
        <CardHeader>
          <CardTitle className="text-amber-100">Leonardo da Vinci Collection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Founders Progress - Special highlight */}
          <div className="bg-gradient-to-r from-amber-900/40 to-yellow-900/40 rounded-xl p-4 border border-amber-500/50">
            <div className="flex justify-between text-sm text-amber-100 mb-2">
              <span className="font-bold">🌟 Founder NFTs (Lifetime Access + 8% APY)</span>
              <span className="text-amber-400 font-bold">{stats.foundersRemaining} / 500 left</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-amber-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${foundersProgress}%` }}
              />
            </div>
          </div>

          {/* Total Progress */}
          <div>
            <div className="flex justify-between text-sm text-amber-100/70 mb-2">
              <span>Total Minted</span>
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
            <p className="text-amber-300 font-semibold">Founder NFT Benefits (First 500):</p>
            <p>✨ LIFETIME ACCESS to all features</p>
            <p>📈 8% BONUS APY on staking</p>
            <p>🎁 Exclusive AIRDROPS</p>
            <p className="text-amber-100/40 mt-2">Standard benefits for all NFTs:</p>
            <p>✓ G Lounge membership</p>
            <p>✓ Voting rights in Codex Collective</p>
            <p>✓ Chance to win $5,000 Epic NFT</p>
          </div>

          {/* Wallet Connection - Single Button */}
          {!walletConnected ? (
            <div className="space-y-3">
              <Button 
                onClick={connectWallet}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 h-14 text-lg font-bold"
              >
                <WalletIcon className="w-6 h-6 mr-2" />
                Connect Solana Wallet
              </Button>
              <p className="text-center text-amber-100/50 text-xs">
                Works with Phantom, Solflare, Backpack, and other Solana wallets
              </p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="text-emerald-400 text-sm font-semibold">
                ✓ Wallet Connected
              </div>
              <div className="text-amber-100/50 text-xs truncate">
                {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
              </div>
            </div>
          )}

          {/* Mint Button */}
          {user && walletConnected ? (
            <Button 
              onClick={handleMint}
              disabled={minting || stats.totalMinted >= 10000}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 h-14 text-lg font-bold"
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

          {/* Mobile User Notice */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Smartphone className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-300 font-semibold text-sm mb-1">Mobil bruker?</p>
                <p className="text-blue-200/70 text-xs">
                  Åpne denne siden i din Solana wallet sin innebygde nettleser (f.eks. Phantom browser) for best opplevelse.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
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
              
              {isFounderNFT(mintedNFT.nftNumber - 1) && (
                <div className="bg-gradient-to-r from-amber-900/40 to-yellow-900/40 rounded-lg p-4 border border-amber-500/50">
                  <p className="text-amber-300 font-bold">🌟 You got a FOUNDER NFT!</p>
                  <p className="text-amber-100/70 text-sm mt-1">
                    Lifetime Access + 8% Bonus APY + Exclusive Airdrops
                  </p>
                </div>
              )}
              
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
    </div>
  )
}
