'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle, ExternalLink, Wallet as WalletIcon, Smartphone, AlertCircle, Plus, Minus, Gift } from 'lucide-react'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { SOLANA_CONFIG } from '@/lib/solana-config'
import { FOUNDER_NFT_COUNT } from '@/lib/nft-data'

export default function LazyMintNFT({ user }) {
  const [minting, setMinting] = useState(false)
  const [mintedNFTs, setMintedNFTs] = useState([])
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [quantity, setQuantity] = useState(1)
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
          foundersRemaining: data.stats.foundersRemaining
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
    setMintedNFTs([])
    
    const totalCost = SOLANA_CONFIG.COLLECTION.price * quantity

    try {
      const userWallet = provider.publicKey.toString()
      const connection = new Connection(SOLANA_CONFIG.RPC_URL, 'confirmed')
      
      setStatus(`Forbereder betaling for ${quantity} NFT(s)...`)
      const fromPubkey = provider.publicKey
      const toPubkey = new PublicKey(SOLANA_CONFIG.COLLECTION_WALLET)

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: totalCost * LAMPORTS_PER_SOL
        })
      )

      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = fromPubkey

      setStatus('Signer i wallet...')
      const signed = await provider.signTransaction(transaction)
      
      setStatus('Sender betaling...')
      const signature = await connection.sendRawTransaction(signed.serialize())
      
      setStatus('Venter på bekreftelse...')
      await connection.confirmTransaction(signature, 'confirmed')
      
      // Mint NFTs one by one
      const mintedResults = []
      for (let i = 0; i < quantity; i++) {
        setStatus(`Minter NFT ${i + 1} av ${quantity}...`)
        
        const mintResponse = await fetch('/api/nft/mint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userWallet,
            paymentSignature: `${signature}_${i}`,
            batchIndex: i,
            totalPaid: totalCost
          })
        })

        const mintData = await mintResponse.json()

        if (mintData.success) {
          mintedResults.push(mintData.nft)
        } else if (i === 0) {
          throw new Error(mintData.error || 'Minting feilet')
        }
      }

      setMintedNFTs(mintedResults)
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

  const totalPrice = (SOLANA_CONFIG.COLLECTION.price * quantity).toFixed(2)
  const progress = (stats.totalMinted / 10000) * 100
  const foundersProgress = ((FOUNDER_NFT_COUNT - stats.foundersRemaining) / FOUNDER_NFT_COUNT) * 100
  const maxQuantity = Math.min(10, stats.remaining)

  // Show minted NFTs
  if (mintedNFTs.length > 0) {
    const founderCount = mintedNFTs.filter(n => n.type === 'ILLUMINATI').length
    const sketchCount = mintedNFTs.filter(n => n.type === 'SKETCH').length
    
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 mx-auto text-emerald-500 mb-3" />
          <h3 className="text-2xl font-bold text-emerald-100">
            {mintedNFTs.length} NFT{mintedNFTs.length > 1 ? 's' : ''} Mintet! 🎉
          </h3>
          {founderCount > 0 && (
            <p className="text-amber-400 font-bold mt-2">
              🌟 {founderCount} Illuminati Atlanticus{founderCount > 1 ? 's' : ''}!
            </p>
          )}
        </div>

        {/* NFT Cards */}
        <div className={`grid gap-4 ${mintedNFTs.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {mintedNFTs.map((nft, idx) => (
            <Card key={idx} className={`overflow-hidden ${nft.type === 'ILLUMINATI' ? 'border-2 border-amber-500' : 'border border-slate-600'}`}>
              <div className="relative">
                <img 
                  src={nft.image} 
                  alt={nft.name}
                  className="w-full h-48 object-cover"
                />
                {nft.type === 'ILLUMINATI' && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                    🌟 ILLUMINATI
                  </div>
                )}
              </div>
              <CardContent className="p-4 bg-slate-900">
                <h4 className="font-bold text-amber-100 text-sm truncate">{nft.name}</h4>
                <p className="text-xs text-slate-400 mt-1">#{nft.nftNumber}</p>
                {nft.type === 'ILLUMINATI' && (
                  <div className="mt-2 text-xs text-amber-300">
                    ✨ Lifetime + 8% APY + Airdrops
                  </div>
                )}
                <a 
                  href={nft.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 text-xs mt-2"
                >
                  Solscan <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          onClick={() => setMintedNFTs([])} 
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600"
        >
          <Gift className="w-4 h-4 mr-2" />
          Mint Flere NFTs
        </Button>
        
        <Button 
          onClick={() => window.location.href = '/my-nfts'}
          variant="outline"
          className="w-full border-amber-500/50 text-amber-100 hover:bg-amber-600/20"
        >
          Se Mine NFTs →
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Founders Progress */}
      <div className="bg-gradient-to-r from-amber-900/40 to-yellow-900/40 rounded-xl p-4 border border-amber-500/50">
        <div className="flex justify-between text-sm text-amber-100 mb-2">
          <span className="font-bold">🌟 Illuminati Atlanticus</span>
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
        <>
          <div className="text-center py-2">
            <div className="text-emerald-400 text-sm font-semibold">✓ Wallet Tilkoblet</div>
            <div className="text-amber-100/50 text-xs">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</div>
          </div>

          {/* Quantity Selector */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-amber-100 font-semibold">Antall NFTs</span>
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-8 w-8 p-0 border-amber-500/50"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-2xl font-bold text-amber-400 w-8 text-center">{quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                  className="h-8 w-8 p-0 border-amber-500/50"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total pris</span>
              <span className="text-amber-400 font-bold">{totalPrice} SOL</span>
            </div>
          </div>

          {/* Mint Button */}
          <Button 
            onClick={handleMint}
            disabled={minting || stats.totalMinted >= 10000}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 h-14 font-bold text-lg"
          >
            {minting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {status || 'Minter...'}
              </>
            ) : stats.totalMinted >= 10000 ? (
              'UTSOLGT'
            ) : (
              `Mint ${quantity} NFT${quantity > 1 ? 's' : ''} (${totalPrice} SOL)`
            )}
          </Button>
        </>
      )}

      {/* Mobile Notice */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Smartphone className="w-4 h-4 text-blue-400 mt-0.5" />
          <p className="text-blue-200/70 text-xs">
            <span className="text-blue-300 font-semibold">Mobile?</span> Open in Phantom/Solflare app browser
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
    </div>
  )
}
