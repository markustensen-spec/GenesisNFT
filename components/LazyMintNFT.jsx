'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle, ExternalLink, Wallet as WalletIcon, Smartphone, AlertCircle } from 'lucide-react'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { SOLANA_CONFIG } from '@/lib/solana-config'
import { FOUNDER_NFT_COUNT } from '@/lib/nft-data'

export default function LazyMintNFT({ user }) {
  const [minting, setMinting] = useState(false)
  const [mintedNFT, setMintedNFT] = useState(null)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
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

  const getProvider = () => {
    if (typeof window === 'undefined') return null
    return window.solana || window.phantom?.solana || window.solflare
  }

  const checkWalletConnection = async () => {
    const provider = getProvider()
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
    const provider = getProvider()
    
    if (!provider) {
      setError('Ingen Solana wallet funnet. Installer Phantom eller Solflare.')
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
      setError('Tilkobling avvist. Godkjenn i wallet.')
    }
  }

  const handleMint = async () => {
    const provider = getProvider()
    if (!walletConnected || !provider) {
      setError('Koble til wallet først')
      return
    }

    setMinting(true)
    setError('')
    setStatus('Forbereder transaksjon...')

    try {
      const userWallet = provider.publicKey.toString()
      const connection = new Connection(SOLANA_CONFIG.RPC_URL, 'confirmed')
      
      // Create payment transaction
      setStatus('Opprett betaling...')
      const fromPubkey = provider.publicKey
      const toPubkey = new PublicKey(SOLANA_CONFIG.COLLECTION_WALLET)

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: SOLANA_CONFIG.COLLECTION.price * LAMPORTS_PER_SOL
        })
      )

      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = fromPubkey

      // User signs in their wallet
      setStatus('Signer i wallet...')
      const signed = await provider.signTransaction(transaction)
      
      // Send transaction
      setStatus('Sender betaling...')
      const signature = await connection.sendRawTransaction(signed.serialize())
      
      // Wait for confirmation
      setStatus('Venter på bekreftelse...')
      await connection.confirmTransaction(signature, 'confirmed')
      
      // Mint NFT (backend verifies payment and assigns random NFT)
      setStatus('Minter NFT...')
      const mintResponse = await fetch('/api/nft/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userWallet,
          paymentSignature: signature
        })
      })

      const mintData = await mintResponse.json()

      if (!mintData.success) {
        throw new Error(mintData.error || 'Minting feilet')
      }

      setMintedNFT(mintData.nft)
      setStatus('')
      fetchStats()

    } catch (err) {
      console.error('Mint error:', err)
      if (err.message?.includes('User rejected')) {
        setError('Transaksjon avvist i wallet')
      } else if (err.message?.includes('insufficient')) {
        setError('Ikke nok SOL i wallet')
      } else {
        setError(err.message || 'Minting feilet')
      }
      setStatus('')
    } finally {
      setMinting(false)
    }
  }

  const progress = (stats.totalMinted / 10000) * 100
  const foundersProgress = ((FOUNDER_NFT_COUNT - stats.foundersRemaining) / FOUNDER_NFT_COUNT) * 100

  return (
    <div className="space-y-4">
      {/* Founders Progress */}
      <div className="bg-gradient-to-r from-amber-900/40 to-yellow-900/40 rounded-xl p-4 border border-amber-500/50">
        <div className="flex justify-between text-sm text-amber-100 mb-2">
          <span className="font-bold">🌟 Founder NFTs (Lifetime + 8% APY)</span>
          <span className="text-amber-400 font-bold">{stats.foundersRemaining} / 500 igjen</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-amber-500 h-3 rounded-full transition-all"
            style={{ width: `${foundersProgress}%` }}
          />
        </div>
      </div>

      {/* Total Progress */}
      <div>
        <div className="flex justify-between text-sm text-amber-100/70 mb-2">
          <span>Totalt Mintet</span>
          <span>{stats.totalMinted} / 10,000</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Price */}
      <div className="flex justify-between items-center py-2 border-t border-amber-900/30">
        <span className="text-amber-100/80">Pris</span>
        <span className="text-xl font-bold text-amber-400">{SOLANA_CONFIG.COLLECTION.price} SOL</span>
      </div>

      {/* Wallet Connection */}
      {!walletConnected ? (
        <div className="space-y-2">
          <Button 
            onClick={connectWallet}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 h-12 font-bold"
          >
            <WalletIcon className="w-5 h-5 mr-2" />
            Koble til Solana Wallet
          </Button>
          <p className="text-center text-amber-100/50 text-xs">
            Phantom, Solflare, Backpack
          </p>
        </div>
      ) : (
        <div className="text-center py-2">
          <div className="text-emerald-400 text-sm font-semibold">✓ Wallet Tilkoblet</div>
          <div className="text-amber-100/50 text-xs">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</div>
        </div>
      )}

      {/* Mint Button */}
      {walletConnected && (
        <Button 
          onClick={handleMint}
          disabled={minting || stats.totalMinted >= 10000}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 h-12 font-bold"
        >
          {minting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {status || 'Minter...'}
            </>
          ) : stats.totalMinted >= 10000 ? (
            'UTSOLGT'
          ) : (
            `Mint NFT (${SOLANA_CONFIG.COLLECTION.price} SOL)`
          )}
        </Button>
      )}

      {/* Mobile Notice */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Smartphone className="w-4 h-4 text-blue-400 mt-0.5" />
          <p className="text-blue-200/70 text-xs">
            <span className="text-blue-300 font-semibold">Mobil?</span> Åpne i Phantom/Solflare app browser
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Success */}
      {mintedNFT && (
        <Card className="bg-emerald-900/20 border-emerald-500/50">
          <CardContent className="pt-6 text-center space-y-3">
            <CheckCircle className="w-12 h-12 mx-auto text-emerald-500" />
            <h3 className="text-xl font-bold text-emerald-100">NFT Mintet! 🎉</h3>
            <p className="text-emerald-100/80">{mintedNFT.name}</p>
            
            {mintedNFT.type === 'FOUNDER' && (
              <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-500/50">
                <p className="text-amber-300 font-bold">🌟 FOUNDER NFT!</p>
                <p className="text-amber-100/70 text-xs">Lifetime + 8% APY + Airdrops</p>
              </div>
            )}
            
            <a 
              href={mintedNFT.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-amber-400 hover:text-amber-300 text-sm"
            >
              Se på Solscan <ExternalLink className="w-3 h-3 ml-1" />
            </a>

            <Button onClick={() => setMintedNFT(null)} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              Mint En Til
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
